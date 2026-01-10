using ProjetoGerenciamentoEstoque.Domain.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public interface IUserService
    {
        Task<bool> AddUserAsync(User user);
        Task<bool> VerifyLogin(User user);
    }
}
