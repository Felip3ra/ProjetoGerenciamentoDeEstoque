using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Presentation.Contracts
{
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Department Department { get; set; }
        public bool HasAccess { get; set; }
    }
}
