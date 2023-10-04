using System.Text;
using gRPC_Broker.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Spectre.Console;

namespace gRPC_Broker.Services;

public class LogPrintService : IHostedService
{
    private Timer _timer;
    private const int TimeToWait = 5000;

    private readonly IPostStorageService _postStorageService;
    private readonly ISubscriberStorageService _subscriberStorageService;
    private readonly ILogStorageService _logStorageService;
        
    public LogPrintService(IServiceScopeFactory serviceScopeFactory, IPostStorageService postStorageService, ISubscriberStorageService subscriberStorageService, ILogStorageService logStorageService)
    {
        using var scope = serviceScopeFactory.CreateScope();

        _postStorageService = postStorageService;
        _subscriberStorageService = subscriberStorageService;
        _logStorageService = logStorageService;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, 0, TimeToWait);
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
        Console.Clear();

        var layout = new Layout("Root")
            .SplitColumns(
                new Layout("Left"),
                new Layout("Right").Size(40));

        // logs
        var logs = new StringBuilder();

        if (!_logStorageService.IsEmpty())
        {
            foreach (var log in _logStorageService.GetAll())
            {
                logs.Append($"{log}\n");
            }
        }


        layout["Left"].Update(
            new Panel(Align.Left(new Markup($"{logs}")))
                .Expand());

        // subs
        var subs = new StringBuilder();
        foreach (var sub in _subscriberStorageService.GetAll())
            subs.Append($"{sub.Address.Replace("https://", "")}\n");

        layout["Right"]
            .Update(new Panel(
                Align.Left(
                    new Markup($"Subscribers online: [red]{_subscriberStorageService.SubscribersCount()}[/]\n{subs}")))
                .Expand());



        // Render the layout
        AnsiConsole.Write(layout);
    }
}