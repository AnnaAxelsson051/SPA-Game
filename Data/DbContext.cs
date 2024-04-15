using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SPAGame.Models;

namespace SPAGame.Data
{
    public class DbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        public DbSet<Score> Scores { get; set; }
        public DbSet<Guess> Guesses { get; set; }
        public DbSet<Game> Games { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasMany(user => user.Scores)
                .WithOne(score => score.User)
                .HasForeignKey(score => score.UserId);

            builder.Entity<Game>()
                .HasMany(game => game.Scores)
                .WithOne(score => score.Game)
                .HasForeignKey(score => score.GameId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Game>()
                .HasMany(game => game.Guesses)
                .WithOne(game => game.Game)
                .HasForeignKey(game => game.GameId);

            builder.Entity<ApplicationUser>()
             .HasMany(user => user.Games)
             .WithOne(game => game.User)
             .HasForeignKey(game => game.UserId);

        }
    }
}