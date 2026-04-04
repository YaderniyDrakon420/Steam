namespace GameStore.Domain.Entities;

public class Wishlist
{
    public int UserId { get; set; }
    public int GameId { get; set; } 
    public DateTime AddedDate { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Game Game { get; set; } = null!;
}