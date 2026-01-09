using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(User user)
        {
            if (user == null)
            {
                return BadRequest("Usuário não está preenchido");
            }

            if (await _userService.VerifyLogin(user))
            {
                return Ok("Login realizado com sucesso");
            }

            return Unauthorized("Credenciais inválidas");
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(User user)
        {
            if (user == null)
            {
                return BadRequest("Usuário não está preenchido");
            }
            
            if (!await _userService.VerifyLogin(user) && await _userService.AddUserAsync(user))
            {
                return Ok("Usuário registrado com sucesso");
            }
            return Unauthorized("Usuário já cadastrado");
        }
    }
}
