import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Filter, History, LucideAngularModule, MoreVertical, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';
import { ItemDetailsModal } from '../../components/items/item-details-modal/item-details-modal';
import { ItemEditModal } from '../../components/items/item-edit-modal/item-edit-modal';
import { ItemFormModal } from '../../components/items/item-form-modal/item-form-modal';
import { MovementModal } from '../../components/items/movement-modal/movement-modal';

@Component({
  selector: 'app-items-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ItemFormModal, ItemEditModal, ItemDetailsModal, MovementModal],
  templateUrl: './items.html',
  styleUrls: ['./items.css'],
})
export class ItemsPage {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly History = History;
  readonly More = MoreVertical;
  readonly Edit = SquarePen;
  readonly Trash = Trash2;
  readonly Package = Package;

  OpenItemForm = signal(false);
  OpenItemEdit = signal(false);
  OpenItemDetails = signal(false);
  OpenMovement = signal(false);

  showItemForm(){
    this.OpenItemForm.set(true);
  }
  showItemDetails(){
    this.OpenItemDetails.set(true);
  }
  showItemEdit(){
    this.OpenItemEdit.set(true);
  }
  showMovement(){
    this.OpenMovement.set(true);
  }
}
