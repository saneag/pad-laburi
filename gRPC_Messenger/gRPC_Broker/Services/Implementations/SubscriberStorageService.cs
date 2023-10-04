using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;
using Microsoft.AspNetCore.DataProtection;
using System.Collections.Concurrent;
using System.Net.Sockets;

namespace gRPC_Broker.Services.Implementations;

public class SubscriberStorageService: ISubscriberStorageService
{
    private readonly ConcurrentDictionary<string ,List<Subscriber>> _subscribers = new();
    private readonly object _lock = new();

    public void Add(Subscriber subscriber, List<string> topics)
    {
        lock (_lock)
        {
            foreach (var topic in topics)
            {
                if (_subscribers.TryGetValue(topic, out var subscribers))
                {
                    subscribers.Add(subscriber);
                }
                else
                {
                    _subscribers.TryAdd(topic, new List<Subscriber> { subscriber });
                }
            }
        }
    }

    public void Add(Subscriber subscriber, string topic)
    {
        lock (_lock)
        {
            if (_subscribers.TryGetValue(topic, out var subscribers))
                subscribers.Add(subscriber);
            else
                _subscribers.TryAdd(topic, new List<Subscriber> { subscriber });
        }
    }

    public void Remove(Subscriber subscriber)
    {
        lock (_lock)
        {
            foreach (var (_, subs) in _subscribers)
            {
                if (subs.Contains(subscriber)) subs.Remove(subscriber);
            }
        }
    }

    public IList<Subscriber> Get(string topic)
    {
        lock (_lock)
        {
            return _subscribers.TryGetValue(topic, out var subscribers) 
                ? subscribers 
                : new List<Subscriber>();
        }
    }
}