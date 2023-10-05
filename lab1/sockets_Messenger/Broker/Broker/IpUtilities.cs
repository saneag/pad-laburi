using System.Net.Sockets;
using System.Net;

namespace Broker;   

public class IpUtilities
{
    public static IPAddress GetIpAddress()
    {
        var ipEntry = Dns.GetHostEntry(Dns.GetHostName());
        return ipEntry.AddressList.First(x => x.AddressFamily == AddressFamily.InterNetwork);
    }

    public static int GetAvailablePort()
    {
        var udp = new UdpClient(0, AddressFamily.InterNetwork);
        return ((IPEndPoint)udp.Client.LocalEndPoint).Port;
    }
}   