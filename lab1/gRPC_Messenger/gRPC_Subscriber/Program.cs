using Grpc.Net.Client;
using gRPC_Common;
using gRPC_Messenger;
using gRPC_Subscriber.Services;
using Spectre.Console;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

var app = builder.Build();

app.Urls.Add(EndPoints.Subscriber);

app.MapGrpcService<NotificationService>();

app.MapGet("/", () => "");

app.Start();

Console.Clear();

var appAddress = app.Urls.First();

var httpHandler = new HttpClientHandler
{
    ServerCertificateCustomValidationCallback =
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
};

Console.Write("Enter broker ip: ");
var ipAddress = Console.ReadLine();
ipAddress = string.IsNullOrEmpty(ipAddress) 
    ? EndPoints.Broker 
    : $"https://{ipAddress}:5050";

using var channel = GrpcChannel.ForAddress(ipAddress,
    new GrpcChannelOptions { HttpHandler = httpHandler });

var client = new Subscriber.SubscriberClient(channel);

var topics = AnsiConsole.Prompt(
    new MultiSelectionPrompt<string>()
        .Title("Select topics")
        .PageSize(10)
        .AddChoices(new[]
        {
            "sport",
            "politics",
            "business",
            "entertainment",
            "science",
            "health",
            "technology",
            "world"
        })
);

foreach (string topic in topics)
{
    AnsiConsole.WriteLine(topic);
}

var request = new SubscribeRequest()
{
    Address = appAddress,
    Subscriptions = { topics }
};

try
{
    var reply = await client.SubscribeAsync(request);
    if (!reply.IsSuccess)
    {
        Console.WriteLine($"Error subscribing");
        return;
    }

    Console.WriteLine($"You are now subscribed!");
}
catch (Exception e)
{
    Console.WriteLine($"Error subscribing: {e.Message}");
}

Console.ReadKey();