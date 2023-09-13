﻿using System.Net.Sockets;

namespace Broker.Clients;
    
internal class Subscriber : IClient
{
    public Subscriber(Socket socket)
    {
        Socket = socket;
    }

    public string Ip { get; set; } = string.Empty;
    public int Port { get; set; }
    public Socket Socket { get; set; }
}