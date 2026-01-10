using Microsoft.EntityFrameworkCore;
using ProjetoGerenciamentoEstoque.Application.Repository;
using ProjetoGerenciamentoEstoque.Infraestructure.Context;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Infraestructure.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        public Repository(AppDbContext context) 
        {
            _context = context;
        }
        public async Task<bool> AddAsync(T entity)
        {
            try
            {
                await _context.Set<T>().AddAsync(entity);
                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            try
            {
                return await _context.Set<T>().ToListAsync();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> UpdateAsync(T entity)
        {
            try
            {
                _context.Set<T>().Update(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
