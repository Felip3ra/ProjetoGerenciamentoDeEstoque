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
                if (user.Status != Status.Active)
                {
                    user.PasswordHash = null;
                }
                else if (!string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    user.PasswordHash = _passwordHasher.HashPassword(user.PasswordHash);
                }
                else
                {
                    return false;
                }

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
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
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    return false;
                }

                User? userExists = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
                if (userExists == null || userExists.Status != Status.Active || string.IsNullOrWhiteSpace(userExists.PasswordHash))
                {
                    return false;
                }

                bool passwordMatch = _passwordHasher.VerifyPassword(userExists.PasswordHash, password);
                if (!passwordMatch) return false;
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                {
                    return null;
                }

                return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> UpdateAsync(User user)
        {
            try
            {
                var existing = await _context.Users.FirstOrDefaultAsync(x => x.Id == user.Id);
                if (existing == null)
                {
                    return false;
                }

                existing.Name = user.Name;
                existing.Email = user.Email;
                existing.Department = user.Department;
                existing.Status = user.Status;
                existing.HasAccess = user.HasAccess;
                existing.Profile = user.Profile;
                existing.CreatedAt = user.CreatedAt;

                if (user.Status != Status.Active)
                {
                    existing.PasswordHash = null;
                }
                else if (!string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    existing.PasswordHash = _passwordHasher.HashPassword(user.PasswordHash);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            try
            {
                return await _context.Users.Include(x => x.Items).ToListAsync();
                
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}
