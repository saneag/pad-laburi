using Broker;

Console.ForegroundColor = ConsoleColor.White;

var ip = "127.0.0.1";
var port = 5050;  
var connectionsLimit = 15;

var server = new Server(ip, port);

try
{
    server.BindAndListen(connectionsLimit);
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
    return;
}

Console.WriteLine("Waiting for clients!");

server.AcceptAndHandleConnections();

//await Task.Delay(Timeout.Infinite);