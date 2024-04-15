using Microsoft.AspNetCore.SignalR;

namespace SPAGame.Hubs
{
    public class GameHub : Hub
    {

        public async Task NotifyNewGame(string gameId)
        {
            await Clients.All.SendAsync("NewGame", gameId);
        }
    }
}
