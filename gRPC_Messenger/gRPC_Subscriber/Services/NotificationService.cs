using gRPC_Messenger;
using Grpc.Core;
using Spectre.Console;

namespace gRPC_Subscriber.Services;

public class NotificationService : Notification.NotificationBase
{
    public override Task<NotifyReply> Notify(NotifyRequest request, ServerCallContext context)
    {
        // Console.WriteLine($"Notification received: {request.Title} {request.Message}");

        var rows = new List<Text>()
        {
            new Text("Topic: " + request.Topic, new Style(Color.Gold3)),
            new Text("Title: " + request.Title, new Style(Color.Yellow)),
            new Text("Message: " + request.Message, new Style(Color.MediumVioletRed))
        };

        Console.WriteLine();
        AnsiConsole.Write(new Rows(rows));

        return Task.FromResult(new NotifyReply
        {
            IsSuccess = true
        });
    }
}