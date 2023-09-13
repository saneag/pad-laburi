using System.Net.Sockets;

namespace Broker.Clients;

internal class Publisher : IClient
{
    public string Ip { get; set; } = string.Empty;
    public int Port { get; set; }
    public Socket Socket { get; set; }
}