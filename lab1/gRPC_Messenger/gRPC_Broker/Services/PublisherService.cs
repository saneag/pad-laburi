using Grpc.Core;
using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;
using gRPC_Messenger;

namespace gRPC_Broker.Services;

public class PublisherService: Publisher.PublisherBase
{   
    private readonly IPostStorageService _postStorageService;
    private readonly ILogStorageService _logStorageService;


    public PublisherService(IPostStorageService postStorageService, ILogStorageService logStorageService)
    {
        _postStorageService = postStorageService;
        _logStorageService = logStorageService;
    }

    public override Task<PublishReply> PublishPost(PublishRequest request, ServerCallContext context)
    {
        var post = new Post(request.Topic, request.Title, request.Message);

        _postStorageService.AddPost(post);

        _logStorageService.AddLog($"[yellow]NEW_POST[/] Topic: {request.Topic}");

        return Task.FromResult(new PublishReply
        {
            IsSuccess = true
        });
    }
}