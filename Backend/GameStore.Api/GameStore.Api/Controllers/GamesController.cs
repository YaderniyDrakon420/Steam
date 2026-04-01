using GameStore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GameStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameRepository _gameRepository;

    public GamesController(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetGames()
    {
        var games = await _gameRepository.GetAllAsync();
        return Ok(games);
    }
}
