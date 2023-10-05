using gRPC_Broker.Entities;

namespace gRPC_Broker.Services.Interfaces;

public interface ILogStorageService
{
    void AddLog(string log);
    string? GetNext();

    List<string> GetAll();

    bool IsEmpty(); 
}   