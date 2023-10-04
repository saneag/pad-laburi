using gRPC_Broker.Entities;

namespace gRPC_Broker.Services.Interfaces;

public interface ISubscriberStorageService
{   
    void Add(Subscriber subscriber, List<string> topics);
    void Add(Subscriber subscriber, string topic);
    void Remove(Subscriber subscriber);
    IList<Subscriber> Get(string topic);
}           