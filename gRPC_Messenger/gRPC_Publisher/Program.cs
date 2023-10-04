using System.Net;
using System.Threading.Tasks;
using Grpc.Net.Client;
using gRPC_Common;
using gRPC_Messenger;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;

var httpHandler = new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
};

Console.WriteLine("\tPUBLISHER\n\n");

Console.Write("Enter IP address: ");
var ipAddress = Console.ReadLine();
ipAddress = string.IsNullOrEmpty(ipAddress) 
    ? EndPoints.Broker 
    : $"https://{ipAddress}:5050";

using var channel = GrpcChannel.ForAddress(ipAddress,
    new GrpcChannelOptions { HttpHandler = httpHandler });

var client = new Publisher.PublisherClient(channel);

while (true)
{
    Console.Write("Enter topic: ");
    var topic = Console.ReadLine() ?? "";
    Console.Write("Enter title: ");
    var title = Console.ReadLine() ?? "";
    Console.Write("Enter message: ");
    var message = Console.ReadLine() ?? "";

    var request = new PublishRequest()
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