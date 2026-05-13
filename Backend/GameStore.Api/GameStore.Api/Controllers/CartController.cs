using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly GameStoreDbContext _context;

    public CartController(GameStoreDbContext context)
    {
        _context = context;
    }

    // 1. Отримати всі ігри в кошику
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cartItems = await _context.Carts
            .Where(c => c.UserId == userId)
            .Include(c => c.Game)
            .Select(c => new {
                id = c.GameID,
                title = c.Game.Title,
                price = c.Game.Price,
                image = c.Game.CoverImageUrl
            })
            .ToListAsync();

        return Ok(cartItems);
    }

    // 2. Додати гру в кошик
    [HttpPost("{userId}/{gameId}")]
    public async Task<IActionResult> AddToCart(int userId, int gameId)
    {
        // ПЕРЕВІРКА 1: Чи є гра вже в бібліотеці (куплена)
        var isInLibrary = await _context.UserLibrary
            .AnyAsync(ul => ul.UserId == userId && ul.GameId == gameId);

        if (isInLibrary)
            return BadRequest("Ця гра вже є у вашій бібліотеці. Ви не можете купити її вдруге.");

        // ПЕРЕВІРКА 2: Чи немає вже такої гри в кошику
        var isInCart = await _context.Carts
            .AnyAsync(c => c.UserId == userId && c.GameID == gameId);

        if (isInCart)
            return BadRequest("Гра вже додана до кошика.");

        // Додавання
        var cartItem = new Cart { UserId = userId, GameID = gameId };
        _context.Carts.Add(cartItem);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // 3. Видалити гру з кошика
    [HttpDelete("{userId}/{gameId}")]
    public async Task<IActionResult> RemoveFromCart(int userId, int gameId)
    {
        var item = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.GameID == gameId);

        if (item == null) return NotFound();

        _context.Carts.Remove(item);
        await _context.SaveChangesAsync();

        return Ok();
    }
}