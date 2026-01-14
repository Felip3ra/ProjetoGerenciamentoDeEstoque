import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Activity, Filter, LucideAngularModule } from 'lucide-angular';
import { MovementFacade } from '../../Services/Movement/movement-facade';
import { Movement } from '../../interfaces/movement';
import { StatusUiService } from '../../Services/Shared/status-ui.service';

@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './movements.html',
  styleUrls: ['./movements.css'],
})
export class MovementsPage {
  readonly Activity = Activity;
  readonly Filter = Filter;

  constructor(
    private movementFacade: MovementFacade,
    public statusUi: StatusUiService
  ) {}

  dataMovements = signal<Movement[]>([]);
  typeFilter = signal('');
  startDate = signal('');
  endDate = signal('');

  ngOnInit(): void {
    this.movementFacade.loadMovements().subscribe({
      next: (movements: Movement[]) => {
        this.dataMovements.set(movements);
      },
    });
  }

  filteredMovements = computed(() => {
    const type = this.statusUi.normalizeKey(this.typeFilter());
    const start = this.parseDate(this.startDate());
    const end = this.parseDate(this.endDate(), true);

    return this.dataMovements().filter((movement) => {
      const movementType = this.statusUi.normalizeKey(movement.movementType);
      const dateValue = this.parseDateValue(movement.movementDateTime || movement.createdAt);

      const typeMatch = !type || movementType === type;
      const startMatch = !start || dateValue >= start;
      const endMatch = !end || dateValue <= end;

      return typeMatch && startMatch && endMatch;
    });
  });

  private parseDate(value: string, endOfDay = false): number | null {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    if (endOfDay) {
      parsed.setHours(23, 59, 59, 999);
    }
    return parsed.getTime();
  }

  private parseDateValue(value?: string): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  }
}
