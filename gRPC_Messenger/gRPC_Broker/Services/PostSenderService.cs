using Grpc.Core;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class PostSenderService: IHostedService
{
    private Timer _timer;
    private const int TimeToWait = 5000;

    private readonly IPostStorageService _postStorageService;
    private readonly ISubscriberStorageService _subscriberStorageService;

    public PostSenderService(IServiceScopeFactory serviceScopeFactory)
    {
        using var scope = serviceScopeFactory.CreateScope();

        _postStorageService = scope.ServiceProvider.GetRequiredService<IPostStorageService>();
        _subscriberStorageService = scope.ServiceProvider.GetRequiredService<ISubscriberStorageService>();
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

    private void DoWork(object state)
    {
        while (!_postStorageService.IsEmpty())
        {
            var post = _postStorageService.GetNext();
                
            if (post == null) continue;

            var subscribers = _subscriberStorageService.Get(post.Topic);

            foreach (var subscriber in subscribers)
            {
                var client = new Notification.NotificationClient(subscriber.Channel);

                var request = new NotifyRequest
                {
                    Title = post.Title,
                    Message = post.Message
                };

                try
                {
                    var reply = client.Notify(request);

                    Console.WriteLine($"Notification sent: {reply.IsSuccess}");
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error notifying subscriber. {e.Message}");
                    
                }
            }

        }
    }
}   