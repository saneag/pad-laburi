using System.Collections.Concurrent;
using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;

namespace gRPC_Broker.Services.Implementations;

public class PostStorageService: IPostStorageService
{
    private readonly ConcurrentQueue<Post> _posts = new();

    public void AddPost(Post post) => _posts.Enqueue(post);

    public Post? GetNext() => _posts.TryDequeue(out var post) ? post : null;

    public bool IsEmpty() => _posts.IsEmpty;
}