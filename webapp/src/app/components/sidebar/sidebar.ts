import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Activity, ChartColumn, LayoutDashboard, LucideAngularModule, Package, Users } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly Users = Users;
  readonly Movements = Activity;
  readonly Reports = ChartColumn;
}
