using System.Net;
using System.Net.Sockets;
using System.Text;
using Newtonsoft.Json;

Socket socket = new(
    AddressFamily.InterNetwork,
    SocketType.Stream,
    ProtocolType.Tcp);


var ipAddress = IPAddress.Parse("127.0.0.1");
var remoteEndPoint = new IPEndPoint(ipAddress, 5050);

try
{
    Console.Write("Try to connect to ");
    PrintColoredText($"{remoteEndPoint}\n", ConsoleColor.Green);

    socket.Connect(remoteEndPoint);

    Console.WriteLine("Successful connected to {0}", remoteEndPoint);
}
catch (Exception e)
{
    Console.WriteLine("Error: {0}", e.Message);
    
}

SendMessage("subscriber");

// receive topics
var bytes = new byte[1024];
var bytesRec = socket.Receive(bytes);

// deserialize topic list
var topics = Encoding.UTF8.GetString(bytes, 0, bytesRec);
var topicList = JsonConvert.DeserializeObject<List<string>>(topics);

Console.WriteLine("Topics: ");
foreach (var topic in topicList)
{
    Console.WriteLine(topic);
}

// subscribe to topic
List<string> subscribedTopics = new()
{
    "sport",
    "science"
};

//serialize topic list
var json = JsonConvert.SerializeObject(subscribedTopics);

//send subscribed topics
SendMessage(json);

//wait for messages
while (true)
{
    bytes = new byte[1024];
    bytesRec = socket.Receive(bytes);

    var message = Encoding.UTF8.GetString(bytes, 0, bytesRec);

    Console.WriteLine(message);
}

Console.ReadLine();

void SendMessage(string message)
{
    var bytesData = Encoding.UTF8.GetBytes(message);

    try
    {
        var sendBytes = socket.Send(bytesData);

        if (sendBytes == bytesData.Length)
            PrintColoredText("Success. All data has been sent\n", ConsoleColor.Green);
        else
            PrintColoredText("Fail. Not all data has been sent\n", ConsoleColor.Red);
    }
    catch (Exception e)
    {
        Console.WriteLine(e.Message);
    }
}

void PrintColoredText(string text, ConsoleColor color)
{
    Console.ForegroundColor = color;
    Console.Write(text);
    Console.ForegroundColor = ConsoleColor.White;
}