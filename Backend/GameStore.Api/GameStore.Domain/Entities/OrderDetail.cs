using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Domain.Entities;

public class OrderDetail
{
    public int OrderId { get; set; }
    public int GameId { get; set; }
    public decimal PriceAtPurchase { get; set; }

    public virtual Order Order { get; set; } = null!;
    public virtual Game Game { get; set; } = null!;
}
