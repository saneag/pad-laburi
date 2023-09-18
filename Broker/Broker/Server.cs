using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;
using Broker.Clients;

namespace Broker;

public class Server
{
    private Socket _serverSocket;
    private IPEndPoint _serverEndPoint;
    
    private readonly List<Subscriber> _subscribers = new();

    private ConcurrentDictionary<string, EndPoint> _clients = new();


    private static readonly object _locker = new();

    public void Init(string ip, int port)
    {
        _serverSocket = new Socket(
            AddressFamily.InterNetwork,
            SocketType.Stream, 
            ProtocolType.Tcp);

        _serverEndPoint = new IPEndPoint(IPAddress.Parse(ip), port);
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
            ConsoleEx.WriteError("Socket error: "); 
            Console.WriteLine(ex.Message);
            throw;
        }
        catch (Exception e)
        {
            ConsoleEx.WriteError("Error binding or listening: ");
            Console.WriteLine(e.Message);
            throw;
        }
    }

    public void AcceptAndHandleConnections()
    {
        Console.WriteLine("Waiting for clients!");
        while (true)    
        {
            var clientSocket = AcceptClient();

            if (clientSocket == null) continue;

            var ip = ((IPEndPoint) clientSocket.RemoteEndPoint!).Address.ToString();

            Console.Write($"{ip}");
            ConsoleEx.WriteLineSuccess(" connected!");

            Task.Run(() =>
            {
                HandleConnections(clientSocket);
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
            ConsoleEx.WriteLineError($"Error accepting client: {e.Message}");
        }

        return socket;
    }

    private void HandleConnections(Socket clientSocket)
    {
        var client = new Subscriber(clientSocket);

        //

        _subscribers.Add(client);

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

                //print ip
                
                //Console.WriteLine("Client {0} sent: ", client.Socket.RemoteEndPoint);
                Console.WriteLine($"{client.Socket.RemoteEndPoint}: {messageText}");

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

