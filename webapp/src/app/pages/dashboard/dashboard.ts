import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { CircleCheckBig, LucideAngularModule, Package, TrendingUp, Users, Wrench } from 'lucide-angular';
import { ItemFacade } from '../../Services/Item/item-facade';
import { Item } from '../../interfaces/item';
import { Movement } from '../../interfaces/movement';
import { MovementFacade } from '../../Services/Movement/movement-facade';
import { StatusUiService } from '../../Services/Shared/status-ui.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardPage {
  readonly Package = Package;
  readonly CheckCircle = CircleCheckBig;
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly TrendingUp = TrendingUp;

  constructor(
    private itemFacade: ItemFacade,
    private movementFacade: MovementFacade,
    public statusUi: StatusUiService
  ) {}

  dataItems = signal<Item[]>([]);
  dataMovements = signal<Movement[]>([]);
  totalItems = computed(() => this.dataItems().length);
  availableItems = computed(() => this.countByStatus('disponivel'));
  inUseItems = computed(() => this.countByStatus('emuso'));
  maintenanceItems = computed(() => this.countByStatus('manutencao'));
  activeItems = computed(() =>
    this.dataItems().filter((item) => this.statusUi.normalizeKey(item.statusItem) !== 'baixado')
      .length
  );
  utilizationPercent = computed(() => {
    const active = this.activeItems();
    if (active === 0) {
      return 0;
    }
    return Math.round((this.inUseItems() / active) * 100);
  });

  recentItems = computed(() => {
    return [...this.dataItems()]
      .sort((a, b) => this.sortDate(b) - this.sortDate(a))
      .slice(0, 3);
  });

  recentMovements = computed(() => {
    return [...this.dataMovements()]
      .sort((a, b) => this.sortMovementDate(b) - this.sortMovementDate(a))
      .slice(0, 3);
  });

  ngOnInit(): void {
    this.itemFacade.loadItems().subscribe({
      next: (Items: Item[]) => {
        this.dataItems.set(Items);
      },
    });
    this.movementFacade.loadMovements().subscribe({
      next: (movements: Movement[]) => {
        this.dataMovements.set(movements);
      },
    });
  }

  private countByStatus(statusKey: string): number {
    return this.dataItems().filter((item) => this.statusUi.normalizeKey(item.statusItem) === statusKey)
      .length;
  }

  private sortDate(item: Item): number {
    return this.safeDateValue(item.updatedAt) || this.safeDateValue(item.createdAt);
  }

  private sortMovementDate(movement: Movement): number {
    return this.safeDateValue(movement.movementDateTime) || this.safeDateValue(movement.createdAt);
  }

  private safeDateValue(value?: string): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  }
}
