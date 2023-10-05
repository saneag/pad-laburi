using Grpc.Net.Client;

namespace gRPC_Broker.Entities;

public class Subscriber
{
    public Subscriber(string address, List<string> subscriptions)
    {
        Address = address;
        Subscriptions = subscriptions;

        var httpHandler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };

        Channel = GrpcChannel.ForAddress(address,
            new GrpcChannelOptions { HttpHandler = httpHandler });
    }

    public string Address { get; private set; }
    public List<string> Subscriptions { get; private set; }

    public GrpcChannel Channel { get; private set; }
}   