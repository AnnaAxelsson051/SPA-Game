using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPAGame.Data;

namespace SPAGame.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopListController : ControllerBase
    {
        private readonly DbContext _context;

        public TopListController(DbContext context)
        {
            _context = context;
        }

        // Retrieving highest score achieved by user

        [HttpGet]
        public IActionResult GetHighestPoints()
        {
            var highestScores = _context.Scores
                .Include(score => score.User) 
                .GroupBy(score => score.UserId)
                .Select(group => new
                {
                    UserId = group.Key,
                    UserName = group.First().User != null ? group.First().User.UserName : "Unknown", 
                    HighestPoints = group.Max(score => score.Points)
                })
                .ToList();

            return Ok(highestScores);
        }



    }
}
