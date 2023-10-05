

using System.Text;
using Grpc.Core;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class SubscriberService: Subscriber.SubscriberBase
{
    private readonly ISubscriberStorageService _subscriberStorageService;
    private readonly ILogStorageService _logStorageService;

    private readonly object _lock = new();

    public SubscriberService(ISubscriberStorageService subscriberStorageService, ILogStorageService logStorageService)
    {
        _subscriberStorageService = subscriberStorageService;
        _logStorageService = logStorageService;
    }   

    public override Task<SubscribeReply> Subscribe(SubscribeRequest request, ServerCallContext context)
    {
        var sb = new StringBuilder();

        sb.Append($"[green]CONNECTED[/] {request.Address.Replace("https://","")} subscribed to: ");
        foreach (var topic in request.Subscriptions)
            sb.Append($" {topic}");
        sb.Append(' ');

        lock (_lock)
        {
            _logStorageService.AddLog(sb.ToString());
        }

        try
        {
            var subscriber = new Entities.Subscriber(request.Address, request.Subscriptions.ToList());

            _subscriberStorageService.Add(subscriber, request.Subscriptions.ToList());
        }
        catch (Exception)
        {
            lock (_lock)
            {
                _logStorageService.AddLog($"[red]Error[/] Fail to add subscriber: {request.Address}");
            }
        }
        

        return Task.FromResult(new SubscribeReply
        {
            IsSuccess = true
        });
    }
}