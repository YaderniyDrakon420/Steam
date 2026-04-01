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
}