using ProjetoGerenciamentoEstoque.Application.Repository;
using ProjetoGerenciamentoEstoque.Domain.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<bool> AddUserAsync(User user) => await _userRepository.AddUserAsync(user);

        public async Task<bool> VerifyLogin(User user) => await _userRepository.VerifyLogin(user.Email, user.PasswordHash);

        public async Task<User?> GetByEmailAsync(string email) => await _userRepository.GetByEmailAsync(email);

        public async Task<bool> UpdateAsync(User user) => await _userRepository.UpdateAsync(user);

    }
}
