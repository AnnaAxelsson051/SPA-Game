using Microsoft.AspNetCore.Identity;

// Defining models for user profiles, games, guesses, and scores

namespace SPAGame.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? NickName { get; set; }
        public int GamesWon { get; set; }
        public int GamesPlayed { get; set; }
        public ICollection<Score> Scores { get; set; }
        public ICollection<Game> Games { get; set; }
  
    }

    public class Guess
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public Guid GameId { get; set; }
        public Game Game { get; set; }
    }

    public class Game
    {
        public Game()
        {
            Guesses = new List<Guess>();
            Scores = new List<Score>();
        }
        public Guid Id { get; set; }
        public int TargetNumber { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public ICollection<Guess> Guesses { get; set; }
        public ICollection<Score> Scores { get; set; }
    }

    public class Score
    {
        public Guid Id { get; set; }
        public int Points { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid GameId { get; set; }
        public ApplicationUser User { get; set; }
        public Game Game { get; set; }
    }
}
    
