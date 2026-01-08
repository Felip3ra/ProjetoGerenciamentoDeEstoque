import { Component } from '@angular/core';
import { Filter, History, LucideAngularModule, MoreVertical, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-items-page',
  standalone: true,
  imports: [LucideAngularModule],
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
}
