using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ProjetoGerenciamentoEstoque.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Department Department { get; set; }
        public Status Status { get; set; }
        public bool HasAccess { get; set; }
        public string? PasswordHash { get; set; }
        public string Profile { get; set; }
        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public ICollection<Item>? Items { get; set; }
        [JsonIgnore]
        public ICollection<Movement>? MovementsFrom { get; set; }
        [JsonIgnore]
        public ICollection<Movement>? MovementsTo { get; set; }
    }
}
