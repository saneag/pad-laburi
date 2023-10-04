using gRPC_Common;
using gRPC_Messenger;
using Grpc.Net.Client;
using Spectre.Console;

var httpHandler = new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
};

Console.WriteLine("\tPUBLISHER\n\n");

Console.Write("Enter broker ip: ");
var ipAddress = Console.ReadLine();
ipAddress = string.IsNullOrEmpty(ipAddress)
    ? EndPoints.Broker
    : $"https://{ipAddress}:5050";

using var channel = GrpcChannel.ForAddress(ipAddress,
    new GrpcChannelOptions { HttpHandler = httpHandler });

var client = new Publisher.PublisherClient(channel);

while (true)
{
    var topic = AnsiConsole.Ask<string>("Enter topic: ");
    var title = AnsiConsole.Ask<string>("Enter title: ");
    var message = AnsiConsole.Ask<string>("Enter message: ");
    
    var request = new PublishRequest
    {
        Topic = topic,
        Title = title,
        Message = message
    };

    try
    {
        var reply = await client.PublishPostAsync(request);
        Console.WriteLine($"Publish Reply: {reply.IsSuccess}");
    }
    catch (Exception e)
    {
        Console.WriteLine($"Error sending message: {e.Message}");
    }

    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();
}