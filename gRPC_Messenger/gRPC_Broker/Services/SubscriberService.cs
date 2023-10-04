

using Grpc.Core;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class SubscriberService: Subscriber.SubscriberBase
{
    private readonly ILogger<SubscriberService> _logger;
    private readonly ISubscriberStorageService _subscriberStorageService;

    public SubscriberService(ILogger<SubscriberService> logger, ISubscriberStorageService subscriberStorageService)
    {
        _logger = logger;
        _subscriberStorageService = subscriberStorageService;
    }   

    public override Task<SubscribeReply> Subscribe(SubscribeRequest request, ServerCallContext context)
    {
        Console.Write($"NEW SUB: {request.Address} [");
        foreach (var topic in request.Subscriptions)
            Console.Write($" {topic}");
        Console.WriteLine(" ]");

        try
        {
            var subscriber = new Entities.Subscriber(request.Address, request.Subscriptions.ToList());

            _subscriberStorageService.Add(subscriber, request.Subscriptions.ToList());
        }
        catch (Exception)
        {
            Console.WriteLine($"Fail to add subscriber: {request.Address}");
        }

        

        return Task.FromResult(new SubscribeReply
        {
            IsSuccess = true
        });
    }
}