import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movement } from '../../interfaces/movement';
import { Item } from '../../interfaces/item';
import { MovementService } from './movement-service';

@Injectable({
  providedIn: 'root',
})
export class MovementFacade {
  constructor(private movementService: MovementService) {}

  loadMovements(): Observable<Movement[]> {
    return this.movementService.GetAllMovements();
  }

  addMovement(
    item: Item,
    formValue: { toUserId: number; observation?: string }
  ): Observable<boolean> {
    const payload: Movement = {
      id: 0,
      itemId: item.id,
      fromUserId: item.currentUserId ?? null,
      toUserId: formValue.toUserId,
      movementType: 'Atribuicao',
      movementDateTime: new Date().toISOString(),
      observation: formValue.observation || '',
      previousStatus: item.statusItem || '',
      newStatus: 'Em Uso',
      createdAt: new Date().toISOString(),
    };
    return this.movementService.AddMovement(payload);
  }
}
