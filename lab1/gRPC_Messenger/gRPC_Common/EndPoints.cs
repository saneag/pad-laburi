namespace gRPC_Common;

public class EndPoints
{
    public static readonly string Broker = $"https://{IpUtilities.GetLocalNetworkIpAddress()}:5050";

    public static readonly string Subscriber = $"https://{IpUtilities.GetLocalNetworkIpAddress()}:0";
}   