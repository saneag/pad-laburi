using System.Net.Sockets;

namespace Broker.Clients;
    
internal interface IClient
{
    public string Ip { get; set; } 
    public int Port { get; set; }
}   