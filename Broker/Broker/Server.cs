using System.Net;
using System.Net.Sockets;
using System.Text;
using Broker.Clients;

namespace Broker;

public class Server
{
    private Socket _serverSocket;
    private IPEndPoint _serverEndPoint;


    private readonly List<Subscriber> _clients = new List<Subscriber>();      

    private static readonly object _locker = new();

    public void Init(string ip, int port)
    {
        var ipAddress = IPAddress.Parse(ip);

        _serverSocket = new Socket(AddressFamily.InterNetwork,
            SocketType.Stream, ProtocolType.Tcp);

        _serverEndPoint = new IPEndPoint(ipAddress, port);
    }

    public void BindAndListen(int queueLimit)
    {
        try
        {
            _serverSocket.Bind(_serverEndPoint);



            _serverSocket.Listen(queueLimit);

            Console.WriteLine("Server listening on: {0}", _serverEndPoint);
        }
        catch (SocketException ex)
        {
            Console.WriteLine("Socket error: {0}", ex.Message);
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine("Error binding or listening: {0}", e.Message);
            throw;
        }
    }

    public void AcceptAndHandleClients()
    {
        while (true)
        {
            var clientSocket = AcceptClient();

            if (clientSocket == null) continue;

            Task.Run(() =>
            {
                HandleClient(clientSocket);
            });
        }
    }

    public Socket? AcceptClient()
    {
        Socket socket = null!;
        try
        {
            socket = _serverSocket.Accept();
        }
        catch (Exception e)
        {
            Console.WriteLine("Error accepting client: {0}", e.Message);
        }

        return socket;
    }

    private void HandleClient(Socket clientSocket)
    {
        var client = new Subscriber(clientSocket);

        _clients.Add(client);

        ReceiveMessageLoop(client);
    }


    private void ReceiveMessageLoop(Subscriber client)
    {
        while (true)
        {
            try
            {
                byte[] bytesReceived = new byte[1024];
                int byteCount = client.Socket.Receive(bytesReceived, SocketFlags.None);

                if (byteCount == 0)
                {
                    //RemoveClient(client);
                    continue;
                }

                string messageText = Encoding.UTF8.GetString(bytesReceived, 0, byteCount);

                //PrintClientMessage(client, messageText);

                //SendMessageToOtherClients(client, messageText);
            }
            catch (SocketException)
            {
                //RemoveClient(client);
                break;
            }
            catch (Exception e)
            {
                Console.WriteLine("Error receiving data from client {0}", client.Socket.RemoteEndPoint);
                Console.WriteLine(e.Message);
            }
        }
    }



    private void PrintColoredText(string text, ConsoleColor color)
    {
        Console.ForegroundColor = color;
        Console.Write(text);
        Console.ForegroundColor = ConsoleColor.White;
    }
}

