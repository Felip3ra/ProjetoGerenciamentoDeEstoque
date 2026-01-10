using ProjetoGerenciamentoEstoque.Application.Repository;
using ProjetoGerenciamentoEstoque.Domain.Models;
using System.Transactions;

namespace ProjetoGerenciamentoEstoque.Application.Services
{
    public class MovementService : IMovementService
    {
        private readonly IRepository<Movement> _movementRepository;
        private readonly IRepository<Item> _itemRepository;
        private readonly IRepository<User> _userRepository;

        public MovementService(IRepository<Movement> movementRepository, IRepository<Item> itemRepository, IRepository<User> userRepository)
        {
            _movementRepository = movementRepository;
            _itemRepository = itemRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<Movement>> GetAllAsync() => await _movementRepository.GetAllAsync();

        public async Task<Movement> GetByIdAsync(int id) => await _movementRepository.GetByIdAsync(id);

        public async Task<bool> UpdateAsync(Movement movement) => await _movementRepository.UpdateAsync(movement);

        public async Task<bool> AddMovementAsync(Movement movement)
        {
            if (movement == null)
            {
                return false;
            }
            if (movement.ItemId <= 0)
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(movement.MovementType))
            {
                return false;
            }

            if (movement.FromUserId.HasValue)
            {
                var fromUser = await _userRepository.GetByIdAsync(movement.FromUserId.Value);
                if (fromUser == null)
                {
                    return false;
                }
            }

            if (movement.ToUserId.HasValue)
            {
                var toUser = await _userRepository.GetByIdAsync(movement.ToUserId.Value);
                if (toUser == null)
                {
                    return false;
                }
            }

            var item = await _itemRepository.GetByIdAsync(movement.ItemId);
            if (item == null)
            {
                return false;
            }

            if (movement.FromUserId.HasValue && item.CurrentUserId != movement.FromUserId)
            {
                return false;
            }

            movement.PreviousStatus = item.StatusItem;
            if (string.IsNullOrWhiteSpace(movement.NewStatus))
            {
                movement.NewStatus = item.StatusItem;
            }

            if (movement.MovementDateTime == default)
            {
                movement.MovementDateTime = DateTime.UtcNow;
            }

            if (movement.CreatedAt == default)
            {
                movement.CreatedAt = movement.MovementDateTime;
            }

            item.StatusItem = movement.NewStatus;
            item.CurrentUserId = movement.ToUserId;
            item.UpdatedAt = DateTime.UtcNow;

            using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

            var itemUpdated = await _itemRepository.UpdateAsync(item);
            if (!itemUpdated)
            {
                return false;
            }

            var movementAdded = await _movementRepository.AddAsync(movement);
            if (!movementAdded)
            {
                return false;
            }

            transaction.Complete();
            return true;
        }
    }
}
