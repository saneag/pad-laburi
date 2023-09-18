using Broker.Test;

var client = new ClientSocket();

Console.WriteLine("Default ip: 127.0.0.1");
Console.WriteLine("Default port: 5050");

Console.Write("\nEnter ip: ");
var sip = Console.ReadLine() ?? "";
var ip = sip == string.Empty ? "127.0.0.1" : sip;
Console.Write("Enter port: ");
var p = Console.ReadLine() ?? "";
var port = p == string.Empty ? 5050 : int.Parse(p);

try
{
    client.Connect(ip, port);
}
catch (Exception)
{
    Console.WriteLine("Cannot connect to server.");
    return;
}

client.SendMessageLoop();