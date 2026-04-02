using Microsoft.AspNetCore.Mvc;
using GameStore.Infrastructure.Persistence;
using GameStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly GameStoreDbContext _context;

    public AuthController(GameStoreDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            return BadRequest("Пользователь с таким Email уже есть");

        user.CreatedAt = DateTime.UtcNow;
        user.UserLevel = 1;
        user.Balance = 0;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Успех!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Nickname == login.Nickname && u.PasswordHash == login.Password);

        if (user == null) return Unauthorized("Неверный логин или пароль");

        return Ok(user); // Отправляем все данные пользователя в React
    }
}

public class LoginDto
{
    public string Nickname { get; set; }
    public string Password { get; set; }
}
