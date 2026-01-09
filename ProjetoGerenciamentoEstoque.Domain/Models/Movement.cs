using System;
using System.Collections.Generic;
using System.Text;

namespace ProjetoGerenciamentoEstoque.Domain.Models
{
    public class Movement
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int? FromUserId { get; set; }
        public int? ToUserId { get; set; }
        public string MovementType { get; set; }
        public DateTime MovementDateTime { get; set; }
        public string Observation { get; set; }
        public string PreviousStatus { get; set; }
        public string NewStatus { get; set; }
        public DateTime CreatedAt { get; set; }

        public Item Item { get; set; }
        public User FromUser { get; set; }
        public User ToUser { get; set; }
    }
}
