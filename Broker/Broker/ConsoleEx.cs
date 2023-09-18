namespace Broker;

internal static class ConsoleEx
{
    public static void Write(string write, ConsoleColor color = ConsoleColor.White)
    {
        Console.ForegroundColor = color;
        Console.Write(write);
        Console.ForegroundColor = ConsoleColor.White;
    }
    public static void WriteLine(string write, ConsoleColor color = ConsoleColor.White)
    {
        Write(write + "\n", color);
    }
    public static void WriteError(string write)
    {
        Write(write, ConsoleColor.Red);
    }
    public static void WriteLineError(string write)
    {
        WriteLine(write, ConsoleColor.Red);
    }
     public static void WriteSuccess(string write)
     {
        Write(write, ConsoleColor.Green);
     }

     public static void WriteLineSuccess(string write)
     {
        WriteLine(write, ConsoleColor.Green);
     }
     
}