using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public interface IService<T> where T : class
    {
        Task<bool> AddAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
    }
}
