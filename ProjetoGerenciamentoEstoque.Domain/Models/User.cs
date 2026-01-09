using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Department Department { get; set; }
        public Status Status { get; set; }
        public string PasswordHash { get; set; }
        public string Profile { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Item> Items { get; set; }
        public ICollection<Movement> MovementsFrom { get; set; }
        public ICollection<Movement> MovementsTo { get; set; }
    }
}
