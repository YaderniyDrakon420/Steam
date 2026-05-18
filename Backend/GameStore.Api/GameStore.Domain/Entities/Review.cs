using System;

namespace GameStore.Domain.Entities;

public class Review
{
    public int Id { get; set; }
    public int GameId { get; set; } // К какой игре отзыв
    public int UserId { get; set; } // Кто оставил отзыв
    public bool IsPositive { get; set; } // true = Рекомендую (вверх), false = Не рекомендую (вниз)
    public string Content { get; set; } = string.Empty; // Текст отзыва
    public DateTime CreatedAt { get; set; } // Дата написания

    // Навигационные свойства
    public virtual Game Game { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}