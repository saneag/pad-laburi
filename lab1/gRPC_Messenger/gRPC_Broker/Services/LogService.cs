using gRPC_Broker.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Spectre.Console;

namespace gRPC_Broker.Services;

public class LogService : IHostedService
{
    private Timer _timer;
    private const int TimeToWait = 5000;

    private readonly IPostStorageService _postStorageService;
    private readonly ISubscriberStorageService _subscriberStorageService;

    private int count = 0;
        
    public LogService(IServiceScopeFactory serviceScopeFactory, IPostStorageService postStorageService, ISubscriberStorageService subscriberStorageService)
    {
        using var scope = serviceScopeFactory.CreateScope();

        _postStorageService = postStorageService;
        _subscriberStorageService = subscriberStorageService;
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


        var layout = new Layout("Root")
            .SplitColumns(
                new Layout("Left"),
                new Layout("Right")
                    .SplitRows(
                        new Layout("Top"),
                        new Layout("Bottom")));

        // Update the left column
        layout["Left"].Update(
            new Panel(
                    Align.Center(
                        new Markup($"Hello [blue]{count++}[/]"),
                        VerticalAlignment.Middle))
                .Expand());

        // users
        layout["Right"]["Top"].Update(
            new Panel(
                Align.Left(
                    new Markup($"Subscribers online: [red]{_subscriberStorageService.SubscribersCount()}[/]"))
                ).Expand());

        // Render the layout
        AnsiConsole.Write(layout);
    }
}