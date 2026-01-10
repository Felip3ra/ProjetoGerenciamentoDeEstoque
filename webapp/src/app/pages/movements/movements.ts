import { Component } from '@angular/core';
import { Activity, Filter, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './movements.html',
  styleUrls: ['./movements.css'],
})
export class MovementsPage {
  readonly Activity = Activity;
  readonly Filter = Filter;
}
