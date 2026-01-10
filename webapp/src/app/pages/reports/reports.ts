import { Component } from '@angular/core';
import { BarChart3, CheckCircle, LucideAngularModule, Package, PieChart, Users, Wrench } from 'lucide-angular';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class ReportsPage {
  readonly Package = Package;
  readonly CheckCircle = CheckCircle;
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly BarChart = BarChart3;
  readonly PieChart = PieChart;
}
