import { Injectable } from '@angular/core';
import { Movement } from '../../interfaces/movement';

@Injectable({
  providedIn: 'root',
})
export class StatusUiService {
  normalizeKey(value?: string): string {
    if (!value) {
      return '';
    }
    return value
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s_-]+/g, '');
  }

  itemStatusClass(status?: string): string {
    switch (this.normalizeKey(status)) {
      case 'disponivel':
        return 'badge-green';
      case 'emuso':
        return 'badge-blue';
      case 'manutencao':
        return 'badge-orange';
      case 'baixado':
        return 'badge-gray';
      default:
        return 'badge-blue';
    }
  }

  movementTypeClass(type?: string): string {
    switch (this.normalizeKey(type)) {
      case 'atribuicao':
        return 'badge-blue';
      case 'devolucao':
        return 'badge-green';
      case 'manutencao':
        return 'badge-orange';
      case 'transferencia':
        return 'badge-blue';
      case 'baixa':
        return 'badge-gray';
      default:
        return 'badge-blue';
    }
  }

  movementTypeLabel(type?: string): string {
    switch (this.normalizeKey(type)) {
      case 'atribuicao':
        return 'Atribuição';
      case 'devolucao':
        return 'Devolução';
      case 'transferencia':
        return 'Transferência';
      case 'manutencao':
        return 'Manutenção';
      case 'baixa':
        return 'Baixa';
      default:
        return type || '-';
    }
  }

  movementItemLabel(movement: Movement): string {
    if (movement.item?.name) {
      return movement.item.name;
    }
    if (movement.itemId != null) {
      return `Item #${movement.itemId}`;
    }
    return 'Item';
  }

  movementSerialLabel(movement: Movement): string {
    return movement.item?.serialNumber ?? '-';
  }

  formatDate(value?: string): string {
    if (!value) {
      return '-';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('pt-BR');
  }

  formatDateTime(value?: string): string {
    if (!value) {
      return '-';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
}
