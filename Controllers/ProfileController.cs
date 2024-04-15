using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPAGame.Data;
using SPAGame.Models;
using System.Security.Claims;

namespace SPAGame.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly DbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager, DbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // Retrieving profile data of the auth user, including 
        // username, user ID, total games played, games won and total
        // guessing attempts made accross all games

        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("The user was not found");
            }
            var userName = user.UserName;
            var totalGamesPlayed = await _context.Games.CountAsync(game => game.UserId == userId);
            var totalGamesWon = await _context.Games.CountAsync(game => game.UserId == userId && game.IsCompleted);
            var totalGuessingAttempts = await _context.Guesses.CountAsync(game => game.Game.UserId == userId);

            var userProfile = new
            {
                UserName = userName,
                UserId = userId,
                GamesPlayed = totalGamesPlayed,
                GamesWon = totalGamesWon,
                GuessingAttempts = totalGuessingAttempts
            };

            return Ok(userProfile);
        }
     
}


}
