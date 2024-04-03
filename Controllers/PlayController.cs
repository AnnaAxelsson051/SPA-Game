using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SPAGame.Data;
using SPAGame.Models;
using System.Security.Claims;

// Fixad

namespace SPAGame.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class PlayController : ControllerBase
    {
        private readonly DbContext _context;

        public PlayController(DbContext context)
        {
            _context = context;
        }

        // Retrieving the scores of the current player from completed
        // games returning  scores in descending order based on
        // game creation date

        [HttpGet("scores")]
        public IActionResult GetUserScores()
        {
            var userId = GetUserId();
            var userScores = _context.Games
                .Where(game => game.UserId == userId && game.IsCompleted)
                .OrderByDescending(game => game.CreatedAt)
                .Select(game => new { 
                    GameId = game.Id, 
                    Score = CalculateUserScore(game) 
                    })
                .ToList();

            return Ok(userScores);
        }

        private int CalculateUserScore(Game game)
        {
            int initialScore = 100;
            int penaltyPerAttempt = 20;
            int numberOfAttempts = _context.Guesses.Count(currentGuess => currentGuess.GameId == game.Id);
            int finalScore = initialScore - (numberOfAttempts * penaltyPerAttempt);

            return Math.Max(finalScore, 0);
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // Initializing a new game with a random number,
        // associating it with auth user and updating users game statistics 

        [HttpPost("new")]
        public IActionResult StartANewGame()
        {
            var newRandomNumber = new Random().Next(1, 10);
            var userId = GetUserId();

            var newGame = new Game
            {
                TargetNumber = newRandomNumber,
                UserId = userId,
                Guesses = new List<Guess>(),
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow
            };
            _context.Games.Add(newGame);
            _context.SaveChanges();

            var user = _context.Users.SingleOrDefault(user => user.Id == userId);
            if (user != null)
            {
                user.GamesPlayed++;
                _context.SaveChanges();
            }

            return Ok(new { GameId = newGame.Id });
        }

       

}
}
