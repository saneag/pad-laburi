using gRPC_Broker.Entities;

namespace gRPC_Broker.Services.Interfaces;

public interface IPostStorageService
{
    void AddPost(Post post);

    Post? GetNext();

    bool IsEmpty();
}   