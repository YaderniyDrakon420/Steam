using Microsoft.EntityFrameworkCore;
using GameStore.Domain.Entities;

namespace GameStore.Infrastructure.Persistence;

public class GameStoreDbContext : DbContext
{
    public GameStoreDbContext(DbContextOptions<GameStoreDbContext> options) : base(options) { }

    public DbSet<Game> Games { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserLibrary> UserLibrary { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Настройка таблицы Users
        modelBuilder.Entity<User>().ToTable("Users");

        // Связь Achievement -> Game
        modelBuilder.Entity<Achievement>()
            .HasOne(a => a.Game)
            .WithMany(g => g.Achievements)
            .HasForeignKey(a => a.GameId);

        // Составной ключ для UserLibrary (UserId + GameId)
        modelBuilder.Entity<UserLibrary>()
            .HasKey(ul => new { ul.UserId, ul.GameId });

        // Составной ключ для UserAchievement (UserId + AchievementId)
        modelBuilder.Entity<UserAchievement>()
            .HasKey(ua => new { ua.UserId, ua.AchievementId });

        // Составной ключ для Carts (UserId + GameID) 
        // Важно: проверь, что в модели Cart поле называется GameID (как на схеме)
        modelBuilder.Entity<Cart>()
            .HasKey(c => new { c.UserId, c.GameID });

        // Составной ключ для Wishlists (UserId + GameID)
        modelBuilder.Entity<Wishlist>()
            .HasKey(w => new { w.UserId, w.GameId });

        // Составной ключ для OrderDetails (OrderId + GameId)
        modelBuilder.Entity<OrderDetail>()
            .HasKey(od => new { od.OrderId, od.GameId });
    }
}