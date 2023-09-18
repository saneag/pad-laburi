using Broker;

var ip = "127.0.0.1";
var port = 5050;  
var connectionsLimit = 15;

var server = new Server();

try
{
    server.Init(ip, port);
}
catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}

try
{
    server.BindAndListen(connectionsLimit);
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
    return;
}

server.AcceptAndHandleConnections();