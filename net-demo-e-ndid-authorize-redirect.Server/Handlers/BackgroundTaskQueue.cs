using Microsoft.AspNetCore.SignalR;
using net_demo_e_ndid_authorize_redirect.Server.SignalR;
using net_demo_e_ndid_authorize_redirect.Server.ViewModel;
using System.Collections.Concurrent;
using System.Threading.Channels;

namespace net_demo_e_ndid_authorize_redirect.Server.Handlers
{
    public class BackgroundTaskQueue
    {
        private readonly Channel<Func<Task>> _channel = Channel.CreateUnbounded<Func<Task>>();
        private ConcurrentQueue<QueueViewModel> _taskList = new ConcurrentQueue<QueueViewModel>();

        public async Task QueueTaskAsync(Func<Task> task, QueueViewModel item)
        {
            _taskList.Enqueue(item);
            await _channel.Writer.WriteAsync(async () =>
            {
                await task();
                _taskList.TryDequeue(out _);
            });
        }

        public async Task<Func<Task>> DequeueAsync()
        {
            return await _channel.Reader.ReadAsync();
        }

        public List<QueueViewModel> GetTask()
        {
            return _taskList.ToArray().ToList();
        }
    }
}
