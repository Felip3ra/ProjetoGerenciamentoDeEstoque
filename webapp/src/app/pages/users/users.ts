import { Component } from '@angular/core';
import { LucideAngularModule, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersPage {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Package = Package;
  readonly Edit = SquarePen;
  readonly Trash = Trash2;
}
