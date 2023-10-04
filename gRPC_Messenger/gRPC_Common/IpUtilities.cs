using System.Net.Sockets;
using System.Net;

namespace gRPC_Common;

internal class IpUtilities
{
    public static IPAddress GetLocalNetworkIpAddress()
    {
        var ipEntry = Dns.GetHostEntry(Dns.GetHostName());
        return ipEntry.AddressList.First(x => x.AddressFamily == AddressFamily.InterNetwork);
    }
        
    public static int GetAvailablePort()
    {
        var udp = new UdpClient(0, AddressFamily.InterNetwork);
        return ((IPEndPoint)udp.Client.LocalEndPoint!).Port;
    }
}