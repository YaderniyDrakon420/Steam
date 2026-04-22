 // Замени на твой реальный namespace контекста БД
using GameStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly GameStoreDbContext _context; // Тот самый _context, которого не хватало

    public ProfileController(GameStoreDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}/games")]
    public async Task<IActionResult> GetUserGames(int userId)
    {
        var games = await _context.UserLibrary
            .Where(u => u.UserId == userId)
            .Include(u => u.Game)
            .Select(u => new {
                id = u.GameId,
                title = u.Game.Title,
                playTime = u.PlayTime,
                lastPlayed = u.LastPlayed.ToString("yyyy-MM-dd"),
                completedPct = 0,
                coverUrl = u.Game.CoverImageUrl,
                icons = new[] { "🎮" }
            })
            .ToListAsync();

        return Ok(games); // Теперь Ok() будет существовать
    }

    [HttpGet("{userId}/achievements")]
    public async Task<IActionResult> GetUserAchievements(int userId)
    {
        var achievements = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Include(ua => ua.Achievement)
            .Select(ua => new {
                id = ua.AchievementId,
                title = ua.Achievement.Title,
                rarityPct = ua.Achievement.RarityPercentage,
                iconUrl = ua.Achievement.IconUrl,
                unlocked = true // Так как мы берем из UserAchievements, они все разблокированы
            })
            .ToListAsync();

        return Ok(achievements);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(int userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new {
                nickname = u.Nickname,
                email = u.Email,
                avatarUrl = (string)null, // Если в БД нет аватара
                level = u.UserLevel,
                balance = u.Balance,
                gamesCount = _context.UserLibrary.Count(ul => ul.UserId == userId),
                achievementsCount = _context.UserAchievements.Count(ua => ua.UserId == userId)
            })
            .FirstOrDefaultAsync();

        if (user == null) return NotFound();

        return Ok(user);
    }
}