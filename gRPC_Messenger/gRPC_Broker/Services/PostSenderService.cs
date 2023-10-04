using Grpc.Core;
using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class PostSenderService: IHostedService
{
    private Timer _timer;
    private const int TimeToWait = 5000;

    private readonly IPostStorageService _postStorageService;
    private readonly ISubscriberStorageService _subscriberStorageService;
    private readonly ILogStorageService _logStorageService;

    public PostSenderService(IServiceScopeFactory serviceScopeFactory, ILogStorageService logStorageService)
    {
        _logStorageService = logStorageService;

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

            try
            {
                foreach (var subscriber in subscribers)
                {
                    var client = new Notification.NotificationClient(subscriber.Channel);

                    var request = new NotifyRequest
                    {
                        Topic = post.Topic,
                        Title = post.Title,
                        Message = post.Message
                    };

                    try
                    {
                        var reply = client.Notify(request);

                        _logStorageService.AddLog(reply.IsSuccess ? "[green]SUCCESS[/] sending post" : "[red]FAIL[/] sending post");
                    }
                    catch (RpcException)
                    {
                        _subscriberStorageService.Remove(subscriber);
                        _logStorageService.AddLog($"[red]DISCONNECTED[/] {subscriber.Address.Replace("https://","")}");
                    }
                    catch (Exception)
                    {
                        _logStorageService.AddLog($"Error notifying subscriber.");
                    }
                }
            }
            catch (Exception)
            {
                _logStorageService.AddLog($"[red]Error[/] accessing subscribers");
            }

        }
    }
}   