using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using net_demo_e_ndid_authorize_redirect.Server.Handlers;
using net_demo_e_ndid_authorize_redirect.Server.SignalR;
using net_demo_e_ndid_authorize_redirect.Server.ViewModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace net_demo_e_ndid_authorize_redirect.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly BackgroundTaskQueue _taskQueue;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly SignalRService _signalR;

        public RequestController(BackgroundTaskQueue taskQueue, IHubContext<ChatHub> hubContext, SignalRService signalR)
        {
            _taskQueue = taskQueue;
            _hubContext = hubContext;
            _signalR = signalR;

        }

        [HttpPost, Route("RequestNDID")]
        public async Task<IActionResult> RequestNDID(QueueViewModel param)
        {
            await _taskQueue.QueueTaskAsync(async () =>
            {
                Console.WriteLine($"Processing Task {param.Guid}...");
                await Task.Delay(10000);
                Console.WriteLine("Task Completed");
            }, param);

            var connectionId = _signalR.GetConnectionId("<specific_token>");
            if (connectionId != null)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", "<send_to_token>", "<message>");
                //IHubContext<ChatHub> context = GlobalHost
            }
                

            return Ok(new RequestNDIDViewModel
            {
                IsSuccess = true,
            });
        }

        [HttpGet, Route("GetTask")]
        public IActionResult GetTask()
        {
            return Ok(_taskQueue.GetTask());
        }

    }

    public class RequestNDIDViewModel
    {
        public bool IsSuccess { get; set; }
    }
}
