using gRPC_Broker.Services;
using gRPC_Broker.Services.Implementations;
using gRPC_Broker.Services.Interfaces;
using gRPC_Common;
using Spectre.Console;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();
builder.Services.AddSingleton<IPostStorageService, PostStorageService>();
builder.Services.AddSingleton<ISubscriberStorageService, SubscriberStorageService>();
builder.Services.AddSingleton<ILogStorageService, LogStorageService>();
builder.Services.AddHostedService<PostSenderService>();
builder.Services.AddHostedService<LogPrintService>();

var app = builder.Build();

app.Urls.Add(EndPoints.Broker);

app.UseHttpsRedirection();

app.MapGrpcService<SubscriberService>();
app.MapGrpcService<PublisherService>();

app.MapGet("/", () => "gRPC_Messenger");

app.Run();