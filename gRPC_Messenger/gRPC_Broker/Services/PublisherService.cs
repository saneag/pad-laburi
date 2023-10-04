using Grpc.Core;
using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class PublisherService: Publisher.PublisherBase
{   
    private readonly ILogger<PublisherService> _logger;
    private readonly IPostStorageService _postStorageService;


    public PublisherService(ILogger<PublisherService> logger, IPostStorageService postStorageService)
    {
        _logger = logger;
        _postStorageService = postStorageService;
    }

    public override Task<PublishReply> PublishPost(PublishRequest request, ServerCallContext context)
    {
        var post = new Post(request.Topic, request.Title, request.Message);

        _postStorageService.AddPost(post);

        Console.WriteLine($"NEW POST: {request.Topic} {request.Title} {request.Message}");

        return Task.FromResult(new PublishReply
        {
            IsSuccess = true
        });
    }
}