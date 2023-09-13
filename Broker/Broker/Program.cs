using Broker;

var server = new Server();

try
{
    server.Init("127.0.0.1", 5050);
}
catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}

try
{
    server.BindAndListen(15);
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
    return;
}

server.AcceptAndHandleClients();