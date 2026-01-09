using ProjetoGerenciamentoEstoque.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Repository
{
    public interface IUserRepository
    {
        Task<bool> VerifyLogin(string email, string password);
        Task<bool> AddUserAsync(User user);
    }
}
