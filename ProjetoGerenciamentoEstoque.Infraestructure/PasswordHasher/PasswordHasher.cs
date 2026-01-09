using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using BCrypt.Net;
namespace ProjetoGerenciamentoEstoque.Infraestructure.PasswordHasher
{
    public class PasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);
        public bool VerifyPassword(string hashedPassword, string providedPassword) => BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword);
        
    }
}
