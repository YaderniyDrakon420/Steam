using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Controllers // Перевір, щоб простір імен збігався з твоїм проектом
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly GameStoreDbContext _context;

        public WishlistController(GameStoreDbContext context)
        {
            _context = context;
        }

        // 1. Отримати весь список бажаного для користувача
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(int userId)
        {
            var wishlist = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Game)
                .Select(w => new
                {
                    id = w.GameId,
                    title = w.Game.Title,
                    price = w.Game.Price,
                    discount = w.Game.DiscountPercentage,
                    coverUrl = w.Game.CoverImageUrl,
                    addedDate = w.AddedDate.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(wishlist);
        }

        // 2. Додати гру до списку бажаного
        [HttpPost("add")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequest request)
        {
            // Перевірка наявності в бібліотеці
            var isInLibrary = await _context.UserLibrary
                .AnyAsync(ul => ul.UserId == request.UserId && ul.GameId == request.GameId);

            if (isInLibrary)
                return BadRequest("Ця гра вже є у вашій бібліотеці");

            // Перевірка наявності у вішлісті
            var existsInWishlist = await _context.Wishlists
                .AnyAsync(w => w.UserId == request.UserId && w.GameId == request.GameId);

            if (existsInWishlist)
                return BadRequest("Гра вже у списку бажаного");

            var item = new Wishlist
            {
                UserId = request.UserId,
                GameId = request.GameId,
                AddedDate = DateTime.UtcNow
            };

            _context.Wishlists.Add(item);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // 3. Видалити гру зі списку
        [HttpDelete("{userId}/{gameId}")]
        public async Task<IActionResult> RemoveFromWishlist(int userId, int gameId)
        {
            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == gameId);

            if (item == null) return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    // ВАЖЛИВО: Додай цей клас тут, якщо його немає в окремому файлі
    public class WishlistRequest
    {
        public int UserId { get; set; }
        public int GameId { get; set; }
    }
}