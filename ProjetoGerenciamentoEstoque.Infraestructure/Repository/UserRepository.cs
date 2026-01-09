using Microsoft.EntityFrameworkCore;
using ProjetoGerenciamentoEstoque.Application.Repository;
using ProjetoGerenciamentoEstoque.Domain.Models;
using ProjetoGerenciamentoEstoque.Infraestructure.Context;
using ProjetoGerenciamentoEstoque.Infraestructure.PasswordHasher;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Infraestructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        public UserRepository(AppDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<bool> AddUserAsync(User user)
        {
            try
            {
                _passwordHasher.HashPassword(user.PasswordHash);
                await _context.Users.AddAsync(user);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> VerifyLogin(string email, string password)
        {
            try
            {
                User? userExists = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
                if(userExists == null) return false;
                bool passwordMatch = _passwordHasher.VerifyPassword(password, userExists.PasswordHash);
                if (!passwordMatch) return false;
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
