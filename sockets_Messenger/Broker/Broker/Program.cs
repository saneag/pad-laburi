using Broker;

Console.ForegroundColor = ConsoleColor.White;

var connectionsLimit = 15;

var server = new Server(5050);

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