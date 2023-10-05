namespace Broker;

internal static class ConsoleEx
{
    public static void Write(string? colored, ConsoleColor color = ConsoleColor.White)
    {
        Console.ForegroundColor = color;    
        Console.Write(colored);
        Console.ForegroundColor = ConsoleColor.White;
    }
    public static void Write(string colored, string? colorless, ConsoleColor color = ConsoleColor.White)
    {
        Write(colored, color);
        Write(colorless);
    }
    public static void WriteLine(string colored, ConsoleColor color = ConsoleColor.White) 
        => Write($"{colored}\n", color);
    public static void WriteLine(string colored, string? colorless, ConsoleColor color = ConsoleColor.White)
        => Write(colored, $"{colorless}\n", color);

    public static void WriteError(string colored, string colorless = "")     
        => Write(colored, colorless, ConsoleColor.Red);
    public static void WriteLineError(string colored) 
        => WriteLine(colored, ConsoleColor.Red);
    public static void WriteLineError(string colored, string colorless) 
        => Write(colored, $"{colorless}\n", ConsoleColor.Red);

    public static void WriteSuccess(string colored) 
        => Write(colored, ConsoleColor.Green);
    public static void WriteSuccess(string colored, string? colorless)
        => Write(colored, colorless, ConsoleColor.Green);
    public static void WriteLineSuccess(string colored) 
        => WriteLine(colored, ConsoleColor.Green);
    public static void WriteLineSuccess(string colored, string colorless)
        => Write(colored, $"{colorless}\n", ConsoleColor.Green);
}