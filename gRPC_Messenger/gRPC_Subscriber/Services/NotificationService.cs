using gRPC_Messenger;
using Grpc.Core;

namespace gRPC_Subscriber.Services;

public class NotificationService : Notification.NotificationBase
{
    public override Task<NotifyReply> Notify(NotifyRequest request, ServerCallContext context)
    {
        Console.WriteLine($"Notification received: {request.Title} {request.Message}");

        return Task.FromResult(new NotifyReply
        {
            IsSuccess = true
        });
    }
}   