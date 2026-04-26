using GameStore.Application.Interfaces;
using GameStore.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    [HttpGet("{id}")]
    public async Task<ActionResult<Game>> GetGame(int id)
    {
        var game = await _gameRepository.GetByIdAsync(id);

        if (game == null)
        {
            return NotFound();
        }

        return Ok(game);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Game>>> Search(string query)
    {
        var results = await _gameRepository.SearchGamesAsync(query);
        return Ok(results);
    }
}