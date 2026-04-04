using Books.Application.Interfaces.Helpers;
using GameStore.Application.Interfaces; 
using GameStore.Domain.Entities;
using GameStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly GameStoreDbContext _context;
    private readonly IHashHelper _hashHelper;

    // Внедряем хелпер через конструктор
    public AuthController(GameStoreDbContext context, IHashHelper hashHelper)
    {
        _context = context;
        _hashHelper = hashHelper;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        // 1. Проверяем, не занят ли Email
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            return BadRequest(new { message = "Пользователь с таким Email уже есть" });

        // 2. ХЕШИРУЕМ ПАРОЛЬ перед сохранением
        user.PasswordHash = _hashHelper.Hash(user.PasswordHash);

        // 3. Устанавливаем дефолтные значения
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
        // 1. Ищем пользователя только по Никнейму
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Nickname == login.Nickname);

        // 2. Если пользователь не найден ИЛИ пароль не совпадает с хешем
        if (user == null || !_hashHelper.IsValidPassword(login.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Неверный логин или пароль" });
        }

        // 3. Если всё ок, возвращаем данные (в будущем тут будет выдача JWT токена)
        return Ok(user);
    }
}

public class LoginDto
{
    public string Nickname { get; set; }
    public string Password { get; set; }
}