namespace gRPC_Broker.Entities;

public class Post
{
    public Post(string topic, string title, string message)
    {
        Topic = topic;
        Title = title;
        Message = message;
    }

    public string Topic { get; private set; }
    public string Title { get; private set; }
    public string Message { get; private set; }
}