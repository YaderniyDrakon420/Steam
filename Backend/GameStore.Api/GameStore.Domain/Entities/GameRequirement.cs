using System;

namespace GameStore.Domain.Entities;

public class GameRequirement
{
    public int Id { get; set; }
    public int GameId { get; set; } // Внешний ключ к таблице Games
    public bool IsRecommended { get; set; } // false = Минимальные, true = Рекомендуемые
    public string OS { get; set; } = string.Empty;
    public string Processor { get; set; } = string.Empty;
    public string Memory { get; set; } = string.Empty;
    public string Graphics { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;

    // Навигационное свойство
    public virtual Game Game { get; set; } = null!;
}