using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace net_demo_e_ndid_authorize_redirect.Server.SignalR
{
    public class ChatHub : Hub
    {
        private readonly SignalRService _signalR;

        public ChatHub(SignalRService signalR)
        {
            _signalR = signalR;
        }

        public override Task OnConnectedAsync()
        {
            //string userId = Context.UserIdentifier ?? Context.ConnectionId; // Ensure unique identifier
            var httpContext = Context.GetHttpContext();
            string? token = httpContext?.Request.Query["token"];

            if (!string.IsNullOrEmpty(token))
            {
                _signalR.AddToken(token, Context.ConnectionId);
            }

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _signalR.RemoveToken(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessageToUser(string token, string message)
        {
            var connectionId = _signalR.GetConnectionId(token);

            if(connectionId != null)
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", token, message);
        }
    }
}
