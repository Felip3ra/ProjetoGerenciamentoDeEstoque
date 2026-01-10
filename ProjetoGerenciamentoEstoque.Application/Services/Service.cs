using ProjetoGerenciamentoEstoque.Application.Repository;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public class Service<T> : IService<T> where T : class
    {
        private readonly IRepository<T> _repository;
        public Service(IRepository<T> repository)
        {
            _repository = repository;
        }
        public async Task<bool> AddAsync(T entity) => await _repository.AddAsync(entity);

        public async Task<IEnumerable<T>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<T> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);


        public async Task<bool> UpdateAsync(T entity) => await _repository.UpdateAsync(entity);

    }
}
