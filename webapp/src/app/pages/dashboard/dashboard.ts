import { Component } from '@angular/core';
import { CircleCheckBig, LucideAngularModule, Package, TrendingUp, Users, Wrench } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardPage {
  readonly Package = Package;
  readonly CheckCircle = CircleCheckBig;
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly TrendingUp = TrendingUp;

}
