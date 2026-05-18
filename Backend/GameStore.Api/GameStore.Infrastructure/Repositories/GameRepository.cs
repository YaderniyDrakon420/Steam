using GameStore.Application.Interfaces;
using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Repositories;

public class GameRepository : IGameRepository
{
    private readonly GameStoreDbContext _context;

    public GameRepository(GameStoreDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Game>> GetAllAsync()
    {
        return await _context.Games.ToListAsync();
    }

    public async Task<Game?> GetByIdAsync(int id)
    {
        // Измененный метод: подтягиваем данные из связанных таблиц
        return await _context.Games
            .Include(g => g.Achievements)
            .Include(g => g.Screenshots)  // Тянем реальные скриншоты
            .Include(g => g.Requirements) // Тянем системные требования
            .Include(g => g.Reviews)      // Тянем отзывы к игре
                .ThenInclude(r => r.User) // Внутри отзывов тянем автора (юзера), чтобы взять его никнейм
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<IEnumerable<Game>> SearchGamesAsync(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return new List<Game>();

        return await _context.Games
            .Where(g => g.Title.Contains(searchTerm))
            .Take(5)
            .ToListAsync();
    }

    public async Task<IEnumerable<Game>> GetTopSellersAsync() =>
        await _context.Games.OrderByDescending(g => g.Price).Take(6).ToListAsync();

    public async Task<IEnumerable<Game>> GetMostPlayedAsync() =>
        await _context.Games.Take(6).ToListAsync();

    public async Task<IEnumerable<Game>> GetUpcomingAsync() =>
        await _context.Games.Where(g => g.Price > 100).Take(6).ToListAsync();
}