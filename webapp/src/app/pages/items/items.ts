import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { EllipsisVertical, Filter, History, LucideAngularModule,Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';
import { ItemDetailsModal } from '../../components/items/item-details-modal/item-details-modal';
import { ItemEditModal } from '../../components/items/item-edit-modal/item-edit-modal';
import { ItemFormModal } from '../../components/items/item-form-modal/item-form-modal';
import { MovementModal } from '../../components/items/movement-modal/movement-modal';
import { ItemFacade } from '../../Services/Item/item-facade';
import { Item } from '../../interfaces/item';

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
  readonly More = EllipsisVertical;
  readonly Edit = SquarePen;
  readonly Trash = Trash2;
  readonly Package = Package;

  constructor(private itemFacade: ItemFacade){}

  OpenItemForm = signal(false);
  OpenItemEdit = signal(false);
  OpenItemDetails = signal(false);
  OpenMovement = signal(false);

  TotalItems = signal(0);
  Data = signal<Item[]>([]);
  SelectedItem = signal<Item | null>(null);
  SearchTerm = signal('');
  StatusFilter = signal('');
  CategoryFilter = signal('');
  UserFilter = signal('');

  ngOnInit(): void {
    this.itemFacade.loadItems().subscribe({
      next: (Items: Item[]) => {
        this.TotalItems.set(Items.length);

        this.Data.set(Items);
      }
    });
  }

  showItemForm(){
    this.OpenItemForm.set(true);
  }
  showItemDetails(item: Item){
    this.SelectedItem.set(item);
    this.OpenItemDetails.set(true);
  }
  showItemEdit(item: Item){
    this.SelectedItem.set(item);
    this.OpenItemEdit.set(true);
  }
  showMovement(item: Item){
    this.SelectedItem.set(item);
    this.OpenMovement.set(true);
  }

  FilteredItems = computed(() => {
    const term = this.SearchTerm().trim().toLowerCase();
    const status = this.StatusFilter().trim().toLowerCase();
    const category = this.CategoryFilter().trim().toLowerCase();
    const user = this.UserFilter().trim().toLowerCase();

    return this.Data().filter((item) => {
      const name = item.name?.toLowerCase() ?? '';
      const brand = item.brand?.toLowerCase() ?? '';
      const model = item.model?.toLowerCase() ?? '';
      const serial = item.serialNumber?.toLowerCase() ?? '';
      const patrimony = item.patrimonyNumber?.toLowerCase() ?? '';
      const itemCategory = item.category?.toLowerCase() ?? '';
      const itemStatus = item.statusItem?.toLowerCase() ?? '';
      const currentUser = item.currentUser?.name?.toLowerCase() ?? '';

      const matchesTerm = !term ||
        name.includes(term) ||
        brand.includes(term) ||
        model.includes(term) ||
        serial.includes(term) ||
        patrimony.includes(term);

      const matchesStatus = !status || itemStatus === status;
      const matchesCategory = !category || itemCategory === category;
      const matchesUser = !user || currentUser.includes(user);

      return matchesTerm && matchesStatus && matchesCategory && matchesUser;
    });
  });

  clearFilters() {
    this.SearchTerm.set('');
    this.StatusFilter.set('');
    this.CategoryFilter.set('');
    this.UserFilter.set('');
  }
}
