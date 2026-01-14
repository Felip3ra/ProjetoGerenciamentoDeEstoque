using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovementController : ControllerBase
    {
        private readonly IMovementService _service;

        public MovementController(IMovementService service)
        {
            _service = service;
        }
        [Authorize]
        [HttpGet("GetAllMovements")]
        public async Task<IActionResult> GetAllMovements()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }
        [Authorize]
        [HttpGet("GetMovementById/{id}")]
        public async Task<IActionResult> GetMovementById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound("Movimento não encontrado");
            }
            return Ok(item);
        }
        [Authorize]
        [HttpPost("AddMovement")]
        public async Task<IActionResult> AddMovement(Movement movement)
        {
            if (movement == null)
            {
                return BadRequest("Movimento não está preenchido");
            }
            if (await _service.AddMovementAsync(movement))
            {
                return Ok("Movimento adicionado com sucesso");
            }
            return BadRequest("Erro ao adicionar o Movimento");
        }
        [Authorize]
        [HttpPut("UpdateMovement")]
        public async Task<IActionResult> UpdateMovement(Movement movement)
        {
            if (movement == null)
            {
                return BadRequest("Movimento não está preenchido");
            }
            return BadRequest("Atualização de movimento não é suportada");
        }
    }
}
