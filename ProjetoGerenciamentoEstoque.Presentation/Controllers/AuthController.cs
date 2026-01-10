using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;
using System.Security.Claims;

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
                var claimsPrincipal = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.Profile)
                    },
                    BearerTokenDefaults.AuthenticationScheme
                ));
                return SignIn(claimsPrincipal);
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
