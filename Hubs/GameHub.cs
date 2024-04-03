using Microsoft.AspNetCore.SignalR;

namespace SPAGame.Hubs
{
    public class GameHub : Hub
    {

        //Sending message to connected
        //clients, notifying them about new game

        public async Task NotifyNewGame(string gameId)
        {
            await Clients.All.SendAsync("NewGame", gameId);
        }
    }
}
