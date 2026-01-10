using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;
using System;
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
                var existingUser = await _userService.GetByEmailAsync(user.Email);
                if (existingUser == null)
                {
                    return Unauthorized("Credenciais inválidas");
                }

                if (!string.Equals(existingUser.Profile, "Admin", StringComparison.OrdinalIgnoreCase))
                {
                    existingUser.Profile = "Admin";
                    await _userService.UpdateAsync(existingUser);
                }

                var claimsPrincipal = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.Name, existingUser.Name),
                        new Claim(ClaimTypes.Email, existingUser.Email),
                        new Claim(ClaimTypes.Role, "Admin")
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

            var existingUser = await _userService.GetByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return Conflict("Usuário já cadastrado");
            }

            user.Profile = "Admin";
            user.Status = Status.Active;

            if (await _userService.AddUserAsync(user))
            {
                return Ok("Usuário registrado com sucesso");
            }
            return BadRequest("Erro ao registrar usuário");
        }
    }
}
