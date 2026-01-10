using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public interface IMovementService
    {
        Task<IEnumerable<Movement>> GetAllAsync();
        Task<Movement> GetByIdAsync(int id);
        Task<bool> AddMovementAsync(Movement movement);
        Task<bool> UpdateAsync(Movement movement);
    }
}
