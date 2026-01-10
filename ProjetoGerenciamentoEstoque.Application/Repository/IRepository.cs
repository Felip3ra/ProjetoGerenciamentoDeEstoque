using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Repository
{
    public interface IRepository<T> where T : class
    {
        Task<bool> AddAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();

    }
}
