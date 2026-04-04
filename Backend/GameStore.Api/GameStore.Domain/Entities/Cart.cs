namespace GameStore.Domain.Entities;

public class Cart
{
    public int UserId { get; set; }
    public int GameID { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Game Game { get; set; } = null!;
}
