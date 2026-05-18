using System;

namespace GameStore.Domain.Entities;

public class GameScreenshot
{
    public int Id { get; set; }
    public int GameId { get; set; } // Внешний ключ к таблице Games
    public string Url { get; set; } = string.Empty; // Ссылка на картинку

    // Навигационное свойство для Entity Framework
    public virtual Game Game { get; set; } = null!;
}