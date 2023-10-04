using System.Collections;

namespace gRPC_Broker.Entities;

public class SlidingBuffer<T> : IEnumerable<T>
{
    private readonly Queue<T> _queue;
    private readonly int _maxCount;

    public int Count => _queue.Count;

    public SlidingBuffer(int maxCount)
    {
        _maxCount = maxCount;
        _queue = new Queue<T>(maxCount);
    }

    public void Add(T item)
    {
        if (_queue.Count == _maxCount)
            _queue.Dequeue();
        _queue.Enqueue(item);
    }

    public IEnumerator<T> GetEnumerator()
    {
        return _queue.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}