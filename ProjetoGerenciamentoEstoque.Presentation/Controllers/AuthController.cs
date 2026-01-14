using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;
using ProjetoGerenciamentoEstoque.Presentation.Contracts;
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
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("Usuário não está preenchido");
            }

            var loginUser = new User
            {
                Email = request.Email,
                PasswordHash = request.PasswordHash
            };

            if (await _userService.VerifyLogin(loginUser))
            {
                var existingUser = await _userService.GetByEmailAsync(request.Email);
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
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (request == null)
            {
                return BadRequest("Usuário não está preenchido");
            }

            var existingUser = await _userService.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return Conflict("Usuário já cadastrado");
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = request.PasswordHash,
                Department = request.Department,
                HasAccess = request.HasAccess,
                Profile = "Admin",
                Status = Status.Active,
                CreatedAt = DateTime.UtcNow
            };

            if (await _userService.AddUserAsync(user))
            {
                return Ok("Usuário registrado com sucesso");
            }
            return BadRequest("Erro ao registrar usuário");
        }
    }
}
