import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../interfaces/item';
import { ItemService } from './item-service';

@Injectable({
  providedIn: 'root',
})
export class ItemFacade {
  constructor(private itemService: ItemService) {}

  loadItems(): Observable<Item[]> {
    return this.itemService.GetAllItems();
  }

  createItem(formValue: {
    category: string;
    name: string;
    brand?: string;
    model?: string;
    serialNumber: string;
    patrimonyNumber?: string;
    description?: string;
    purchaseDate?: string;
  }): Observable<boolean> {
    const payload: Item = {
      id: 0,
      category: formValue.category,
      name: formValue.name,
      brand: formValue.brand || '',
      model: formValue.model || '',
      serialNumber: formValue.serialNumber,
      patrimonyNumber: formValue.patrimonyNumber || '',
      description: formValue.description || '',
      purchaseDate: formValue.purchaseDate || new Date().toISOString(),
      statusItem: 'Disponivel',
      currentUserId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.itemService.AddItem(payload);
  }

  updateItem(
    item: Item,
    formValue: {
      category: string;
      name: string;
      brand?: string;
      model?: string;
      serialNumber: string;
      patrimonyNumber?: string;
      description?: string;
      purchaseDate?: string;
    }
  ): Observable<boolean> {
    const payload: Item = {
      ...item,
      category: formValue.category,
      name: formValue.name,
      brand: formValue.brand || '',
      model: formValue.model || '',
      serialNumber: formValue.serialNumber,
      patrimonyNumber: formValue.patrimonyNumber || '',
      description: formValue.description || '',
      purchaseDate: formValue.purchaseDate || item.purchaseDate,
    };
    return this.itemService.UpdateItem(payload);
  }
}
