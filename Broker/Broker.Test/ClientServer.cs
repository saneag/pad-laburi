using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Broker.Test;

public class ClientSocket
{
    private readonly Socket _clientSocket = new(
        AddressFamily.InterNetwork,
        SocketType.Stream,
        ProtocolType.Tcp);

    public void Connect(string remoteIp, int remotePort)
    {
        var ipAddress = IPAddress.Parse(remoteIp);
        var remoteEndPoint = new IPEndPoint(ipAddress, remotePort);

        try
        {
            Console.Write("Try to connect to ");
            PrintColoredText(remoteEndPoint + "\n", ConsoleColor.Green);

            _clientSocket.Connect(remoteEndPoint);

            Console.WriteLine("Successful connected to {0}", remoteEndPoint);
        }
        catch (SocketException e)
        {
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine("Error: {0}", e.Message);
        }
    }

    public void SendMessageLoop()
    {
        while (true)
        {
            Console.Write("\nInput: ");

            var input = Console.ReadLine() ?? "";

            var bytesData = Encoding.UTF8.GetBytes(input.ToString());

            try
            {
                var sendBytes = _clientSocket.Send(bytesData);

                if (sendBytes == bytesData.Length)
                    PrintColoredText("Success. All data has been sent", ConsoleColor.Green);
                else
                    PrintColoredText("Fail. Not all data has been sent", ConsoleColor.Red);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                break;
            }
        }

        _clientSocket.Close();
    }

    public void SendMessage(string message)
    {
        var bytesData = Encoding.UTF8.GetBytes(message);

        try
        {
            var sendBytes = _clientSocket.Send(bytesData);

            if (sendBytes == bytesData.Length)
                PrintColoredText("Success. All data has been sent", ConsoleColor.Green);
            else
                PrintColoredText("Fail. Not all data has been sent", ConsoleColor.Red);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }

    private void PrintColoredText(string text, ConsoleColor color)
    {
        Console.ForegroundColor = color;
        Console.Write(text);
        Console.ForegroundColor = ConsoleColor.White;
    }
}