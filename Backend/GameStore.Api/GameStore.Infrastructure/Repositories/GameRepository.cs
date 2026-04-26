using GameStore.Application.Interfaces;
using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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
        return await _context.Games
            .Include(g => g.Achievements) 
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
    await _context.Games.OrderByDescending(g => g.Price).Take(6).ToListAsync(); // Пример логики

    public async Task<IEnumerable<Game>> GetMostPlayedAsync() =>
        await _context.Games.Take(6).ToListAsync();

    public async Task<IEnumerable<Game>> GetUpcomingAsync() =>
        await _context.Games.Where(g => g.Price > 100).Take(6).ToListAsync();
}