namespace GameStore.Domain.Entities;

public class UserLibrary
{
    public int UserId { get; set; }
    public int GameId { get; set; }
    public double PlayTime { get; set; }
    public DateTime LastPlayed { get; set; }
    public DateTime PurchaseDate { get; set; } 

    public virtual User User { get; set; } = null!;
    public virtual Game Game { get; set; } = null!;
}