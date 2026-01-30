import { useState } from 'react';
import { UserPlus, RotateCcw, ArrowRightLeft, Wrench, Ban, MoreVertical } from 'lucide-react';
import { ItemStatus } from '../types';
import type { Item } from '../types';
import { hasPermission, PERMISSIONS } from '../services/auth';
import { MovementModal } from './MovementModal';

interface ItemActionsProps {
  item: Item;
  onUpdate: () => void | Promise<void>;
}

export function ItemActions({ item, onUpdate }: ItemActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  const canEdit = hasPermission(PERMISSIONS.CREATE_MOVEMENT);

  if (!canEdit) return null;

  const handleAction = (type: string) => {
    setActionType(type);
    setShowModal(true);
    setShowMenu(false);
  };

  const handleModalClose = (success: boolean) => {
    setShowModal(false);
    setActionType('');
    if (success) onUpdate();
  };

  // Define ações disponíveis baseado no status
  const actions = [];

  if (item.statusItem === ItemStatus.DISPONIVEL || item.statusItem === ItemStatus.EM_MANUTENCAO) {
    actions.push({
      id: 'assign',
      label: 'Atribuir',
      icon: UserPlus,
      color: 'text-accent'
    });
  }

  if (item.statusItem === ItemStatus.EM_USO) {
    actions.push(
      {
        id: 'return',
        label: 'Devolver',
        icon: RotateCcw,
        color: 'text-green-600'
      },
      {
        id: 'transfer',
        label: 'Transferir',
        icon: ArrowRightLeft,
        color: 'text-primary'
      }
    );
  }

  if (item.statusItem !== ItemStatus.BAIXADO && item.statusItem !== ItemStatus.EM_MANUTENCAO) {
    actions.push({
      id: 'maintenance',
      label: 'Manutenção',
      icon: Wrench,
      color: 'text-orange-600'
    });
  }

  if (item.statusItem !== ItemStatus.BAIXADO) {
    actions.push({
      id: 'discard',
      label: 'Dar Baixa',
      icon: Ban,
      color: 'text-red-600'
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 text-gray-600 hover:text-primary transition-colors"
        title="Ações"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${action.color}`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {showModal && (
        <MovementModal
          item={item}
          actionType={actionType}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
