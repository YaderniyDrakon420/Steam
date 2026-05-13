using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Controllers // Перевір, щоб namespace збігався з твоїм проектом
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly GameStoreDbContext _context;

        public OrderController(GameStoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout/{userId}")]
        public async Task<IActionResult> Checkout(int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Отримуємо ігри з кошика
                var cartItems = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Game)
                    .ToListAsync();

                if (!cartItems.Any())
                    return BadRequest("Cart is empty");

                // 2. Створюємо основне замовлення
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    TotalPrice = cartItems.Sum(i => i.Game.Price),
                    PaymentMethod = "Visa"
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Рятуємо OrderId для OrderDetails

                foreach (var item in cartItems)
                {
                    // 3. Додаємо деталі замовлення
                    _context.OrderDetails.Add(new OrderDetail
                    {
                        OrderId = order.Id,
                        GameId = item.GameID,
                        PriceAtPurchase = item.Game.Price
                    });

                    // 4. Додаємо в бібліотеку, якщо гри там ще немає
                    if (!await _context.UserLibrary.AnyAsync(ul => ul.UserId == userId && ul.GameId == item.GameID))
                    {
                        _context.UserLibrary.Add(new UserLibrary
                        {
                            UserId = userId,
                            GameId = item.GameID,
                            PlayTime = 0,
                            LastPlayed = null, // Тепер це працює, бо ми зробили поле DateTime?
                            PurchaseDate = DateTime.UtcNow
                        });
                    }

                    // 5. Видаляємо з вішліста (якщо гра там була)
                    var wish = await _context.Wishlists
                        .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == item.GameID);
                    if (wish != null)
                        _context.Wishlists.Remove(wish);
                }

                // 6. Очищаємо кошик у базі
                _context.Carts.RemoveRange(cartItems);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Success", orderId = order.Id });
            }
            catch (Exception ex)
            {
                // Якщо щось зламається — база повернеться до початкового стану
                await transaction.RollbackAsync();

                var inner = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, $"DB Error: {inner}");
            }
        }
    }
}