import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Calendar, FileText, Hash, History, LucideAngularModule, Package, User, X } from 'lucide-angular';
import { Item } from '../../../interfaces/item';

@Component({
  selector: 'app-item-details-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './item-details-modal.html',
  styleUrls: ['./item-details-modal.css'],
})
export class ItemDetailsModal {
  readonly CloseIcon = X;
  readonly PackageIcon = Package;
  readonly HashIcon = Hash;
  readonly FileTextIcon = FileText;
  readonly CalendarIcon = Calendar;
  readonly UserIcon = User;
  readonly HistoryIcon = History;
  @Input() item: Item | null = null;
  @Output() close = new EventEmitter<void>();
}
