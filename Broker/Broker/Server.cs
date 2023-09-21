using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using Newtonsoft.Json;

namespace Broker;

public class Server
{
    public Server(string ip, int port)
    {
        _serverSocket = new Socket(
            AddressFamily.InterNetwork,
            SocketType.Stream,
            ProtocolType.Tcp);

        _serverEndPoint = new IPEndPoint(IPAddress.Parse(ip), port);
    }

    public const string SUBSCRIBER = "subscriber";
    public const string PUBLISHER = "publisher";

    private readonly Socket _serverSocket;
    private readonly IPEndPoint _serverEndPoint;

    private readonly List<string> _topics = new()
    {
        "sport",
        "politics",
        "science",
    };
    private static readonly object LockerTopicList = new();

    // topic -> subscribers 
    private readonly ConcurrentDictionary<string, List<Socket>> _subscriptions = new();
    private static readonly object LockerSubscriptions = new();


    public void BindAndListen(int queueLimit)
    {
        try
        {
            _serverSocket.Bind(_serverEndPoint);
            _serverSocket.Listen(queueLimit);

            Console.WriteLine("Server listening on: {0}", _serverEndPoint);
        }
        catch (Exception e)
        {
            ConsoleEx.WriteLineError("Error binding or listening: ", e.Message);
            throw;
        }
    }

    public void AcceptAndHandleConnections()
    {
        while (true)
        {
            try
            {
                var connectedSocked = _serverSocket.Accept();

                Console.Write($"{(IPEndPoint)connectedSocked.RemoteEndPoint!}");
                ConsoleEx.WriteLineSuccess(" CONNECTED");

                Task.Run(() => { RegisterConnection(connectedSocked); });
            }
            catch (Exception e)
            {
                ConsoleEx.WriteLineError("Error accepting client: ", e.Message);
            }
        }
    }

    private void RegisterConnection(Socket connectedSocked)
    {
        Console.WriteLine("Thread={0}", Environment.CurrentManagedThreadId);

        var data = new byte[1024];

        try
        {
            connectedSocked.Receive(data);
        }
        catch (Exception)
        {
            DisconnectSocket(connectedSocked);
            return;
        }

        var role = Encoding.ASCII.GetString(data).Trim().Replace("\0", "");

        if (string.Equals(role, SUBSCRIBER))
            HandleSubscriber(connectedSocked);
        else if (string.Equals(role, PUBLISHER))
            HandlePublisher(connectedSocked);
        else
        {
            var message = $"Invalid role!. Valid roles: {SUBSCRIBER}, {PUBLISHER}. Reconnect!";
            connectedSocked.Send(Encoding.ASCII.GetBytes(message));
            DisconnectSocket(connectedSocked);
        }
    }

    private void HandlePublisher(Socket publisherSocket)
    {
        var endPoint = (IPEndPoint)publisherSocket.RemoteEndPoint!;

        Console.Write($"{endPoint} ");
        ConsoleEx.WriteLine("PUBLISHER", ConsoleColor.DarkCyan);

        // wait for publisher messages
        while (true)
        {
            var data = new byte[1024];

            try
            {
                publisherSocket.Receive(data);
            }
            catch (Exception)
            {
                DisconnectSocket(publisherSocket);
                break;
            }

            var message = Encoding.ASCII.GetString(data).Trim().Replace("\0", "");

            var post = new Post();
            try
            {
                post = JsonConvert.DeserializeObject<Post>(message);

               if (string.IsNullOrEmpty(post.Topic)
                   || string.IsNullOrEmpty(post.Title)
                   || string.IsNullOrEmpty(post.Message))
               {
                   Console.Write($"Post from {endPoint} do not contains:");
                   ConsoleEx.Write(post.Topic != String.Empty ? "" : " topic");
                   Console.Write(post.Title != String.Empty ? "" : " title");
                   Console.Write(post.Message != String.Empty ? "" : " message");
                   Console.WriteLine();

                   continue;
                }
            }
            catch (Exception)
            {
                ConsoleEx.WriteLineError("Error deserializing post from: ", endPoint.ToString());
            }

            // check if topic exists
            lock (LockerTopicList)
            {
                if (!_topics.Contains(post.Topic))
                    _topics.Add(post.Topic);
            }

            // notify subscribers
            lock (LockerSubscriptions)
            {
                if (!_subscriptions.TryGetValue(post.Topic, out var subscribers))
                    continue;

                ConsoleEx.Write("NEW", ConsoleColor.Yellow);
                Console.WriteLine($" post from {endPoint}. Send to {subscribers.Count} subscribers");

                foreach (var subscriber in subscribers)
                {
                    try
                    {
                        subscriber.Send(data);
                    }
                    catch (Exception)
                    {
                        DisconnectSocket(subscriber);
                        DeleteSubscriberFromSubscriptions(subscriber);
                    }
                }
            }
        }
    }

    private void HandleSubscriber(Socket subscriberSocket)
    {
        Console.Write($"{(IPEndPoint)subscriberSocket.RemoteEndPoint!} ");
        ConsoleEx.WriteLine("SUBSCRIBER", ConsoleColor.Blue);

        // send serialized topic list
        if (!SendTopicsToSubscriber(subscriberSocket)) return;

        // wait for list of subscriptions
        if (!GetSubscriptionsFromSubscriber(subscriberSocket)) return;

        if (!SocketConnectionState(subscriberSocket).Result)
        {
            DisconnectSocket(subscriberSocket);
            DeleteSubscriberFromSubscriptions(subscriberSocket);
        }
    }

    private bool GetSubscriptionsFromSubscriber(Socket subscriberSocket)
    {
        var data = new byte[1024];
        try
        {
            // receive json list of subscriptions from subscriber
            subscriberSocket.Receive(data);

            var subscriptions = JsonConvert.DeserializeObject<List<string>>(Encoding.ASCII.GetString(data));

            Console.Write($"{(IPEndPoint)subscriberSocket.RemoteEndPoint!} subscribed to: ");


            //add subscriber to subscriptions
            foreach (var subscription in subscriptions)
            {
                Console.Write($"{subscription} ");
                if (_subscriptions.TryGetValue(subscription, out var subscribers))
                {
                    subscribers.Add(subscriberSocket);
                }
                else
                {
                    lock (LockerSubscriptions)
                    {
                         _subscriptions.TryAdd(subscription, new List<Socket> { subscriberSocket });
                    }
                }
            }
            Console.WriteLine();
        }
        catch (Exception)
        {
            DisconnectSocket(subscriberSocket);
            DeleteSubscriberFromSubscriptions(subscriberSocket);
            return false;
        }

        return true;
    }

    private bool SendTopicsToSubscriber(Socket subscriberSocket)
    {
        try
        {
            var topicsJson = JsonConvert.SerializeObject(_topics);

            subscriberSocket.Send(Encoding.ASCII.GetBytes(topicsJson));
        }
        catch (Exception)
        {
            DisconnectSocket(subscriberSocket);
            return false;
        }
        return true;
    }

    private static async Task<bool> SocketConnectionState(Socket subscriberSocket)
    {
        while (true)
        {
            try
            {
                await subscriberSocket.ReceiveAsync(new byte[1024]);
            }
            catch (Exception)
            {
                return false;
            }
        }
        return true;
    }

    private void DeleteSubscriberFromSubscriptions(Socket subscriberSocket)
    {
        lock (LockerSubscriptions)
        {
            foreach (var (_, subscribers) in _subscriptions)
            {
                if (subscribers.Contains(subscriberSocket))
                    subscribers.Remove(subscriberSocket);
            }
        }
    }

    private static void DisconnectSocket(Socket socket)
    {
        Console.Write($"{(IPEndPoint)socket.RemoteEndPoint!} ");
        ConsoleEx.WriteLineError("DISCONNECTED");

        socket.Close();
    }
}