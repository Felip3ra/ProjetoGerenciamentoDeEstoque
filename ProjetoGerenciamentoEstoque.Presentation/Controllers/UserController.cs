using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IService<User> _service;
        private readonly IUserService _userService;
        public UserController(IService<User> service, IUserService userService)
        {
            _service = service;
            _userService = userService;
        }
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }
        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _service.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }
            return Ok(user);
        }
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(User user)
        {
            if (user == null)
            {
                return BadRequest("Usuário não está preenchido");
            }
            if (await _service.AddAsync(user))
            {
                return Ok("Usuário adicionado com sucesso");
            }
            return BadRequest("Erro ao adicionar o usuário");
        }
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(User user)
        {
            if (user == null)
            {
                return BadRequest("Usuário não está preenchido");
            }
            if (await _userService.UpdateAsync(user))
            {
                return Ok("Usuário atualizado com sucesso");
            }
            return BadRequest("Erro ao atualizar o usuário");
        }
    }
}
