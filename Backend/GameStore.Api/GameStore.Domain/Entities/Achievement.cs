using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Domain.Entities;

public class Achievement
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public decimal RarityPercentage { get; set; }

    public Game? Game { get; set; }
}
