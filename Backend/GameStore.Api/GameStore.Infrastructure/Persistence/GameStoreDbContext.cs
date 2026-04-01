using Microsoft.EntityFrameworkCore;
using GameStore.Domain.Entities;

namespace GameStore.Infrastructure.Persistence;

public class GameStoreDbContext : DbContext
{
    public GameStoreDbContext(DbContextOptions<GameStoreDbContext> options) : base(options) { }

    public DbSet<Game> Games { get; set; }
    public DbSet<Achievement> Achievements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Achievement>()
            .HasOne(a => a.Game)
            .WithMany(g => g.Achievements)
            .HasForeignKey(a => a.GameId);
    }
}