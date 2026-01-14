namespace ProjetoGerenciamentoEstoque.Application.Repository
{
    public interface IRepository<T> where T : class 
    {
        Task<bool> AddAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);

    }
}
