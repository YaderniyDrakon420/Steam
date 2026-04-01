using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Domain.Entities;
public class Game
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int DiscountPercentage { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? HeaderImageUrl { get; set; }

    public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
}
