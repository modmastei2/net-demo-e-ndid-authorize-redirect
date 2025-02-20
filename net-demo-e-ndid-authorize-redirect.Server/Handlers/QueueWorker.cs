
namespace net_demo_e_ndid_authorize_redirect.Server.Handlers
{
    public class QueueWorker : BackgroundService
    {
        private readonly BackgroundTaskQueue _taskQueue;

        public QueueWorker(BackgroundTaskQueue taskQueue)
        {
            _taskQueue = taskQueue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var task = await _taskQueue.DequeueAsync();
                await task();
            }
        }
    }
}
