namespace GameStore.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } // Согласно схеме
    public decimal TotalPrice { get; set; } // Согласно схеме
    public string PaymentMethod { get; set; } = string.Empty;

    public virtual User User { get; set; } = null!;
    public virtual ICollection<OrderDetail> Details { get; set; } = new List<OrderDetail>();
}
