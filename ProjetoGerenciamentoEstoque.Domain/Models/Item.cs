using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ProjetoGerenciamentoEstoque.Domain.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Category { get; set; } 
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public string PatrimonyNumber { get; set; }
        public string Description { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string StatusItem { get; set; }
        public int? CurrentUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public User? CurrentUser { get; set; }
        [JsonIgnore]
        public ICollection<Movement>? Movements { get; set; }
    }
}
