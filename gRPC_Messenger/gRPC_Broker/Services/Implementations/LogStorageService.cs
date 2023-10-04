using gRPC_Broker.Entities;
using gRPC_Broker.Services.Interfaces;
using System.Collections.Concurrent;

namespace gRPC_Broker.Services.Implementations;

public class LogStorageService: ILogStorageService
{
    private readonly ConcurrentQueue<string> _logs = new();

    //private readonly object _lock = new();
        
    public void AddLog(string log) => _logs.Enqueue(log);

    public string? GetNext() => _logs.TryPeek(out var log) ? log : null;
    public List<string> GetAll()
    {
        return _logs.Select(x => x).ToList();
    }


    public bool IsEmpty() => _logs.IsEmpty;
}   