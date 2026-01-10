using Microsoft.AspNetCore.Mvc;
using ProjetoGerenciamentoEstoque.Application.Services;
using ProjetoGerenciamentoEstoque.Domain.Models;

namespace ProjetoGerenciamentoEstoque.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : Controller
    {
        private readonly IService<Item> _itemService;
        public ItemController(IService<Item> itemService)
        {
            _itemService = itemService;
        }
        [HttpGet("GetAllItems")]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemService.GetAllAsync();
            return Ok(items);
        }
        [HttpGet("GetItemById/{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _itemService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound("Item não encontrado");
            }
            return Ok(item);
        }
        [HttpPost("AddItem")]
        public async Task<IActionResult> AddItem(Item item)
        {
            if (item == null)
            {
                return BadRequest("Item não está preenchido");
            }
            if (await _itemService.AddAsync(item))
            {
                return Ok("Item adicionado com sucesso");
            }
            return BadRequest("Erro ao adicionar o item");
        }
        [HttpPut("UpdateItem")]
        public async Task<IActionResult> UpdateItem(Item item)
        {
            if (item == null)
            {
                return BadRequest("Item não está preenchido");
            }
            if (await _itemService.UpdateAsync(item))
            {
                return Ok("Item atualizado com sucesso");
            }
            return BadRequest("Erro ao atualizar o item");
        }
    }
}
