using System.Collections.Concurrent;

namespace net_demo_e_ndid_authorize_redirect.Server.SignalR
{
    public class SignalRService
    {
        private readonly ConcurrentDictionary<string, string> _userConnections = new ConcurrentDictionary<string, string>();

        public void AddToken(string token, string connectionId)
        {
            _userConnections[token] = connectionId;
        }

        public void RemoveToken(string connectionId)
        {
            var user = _userConnections.FirstOrDefault(x => x.Value == connectionId);
            if (!string.IsNullOrEmpty(user.Key))
            {
                _userConnections.TryRemove(user.Key, out _);
            }
        }

        public string? GetConnectionId(string token)
        {
            _userConnections.TryGetValue(token, out var connectionId);
            return connectionId;
        }
    }
}
