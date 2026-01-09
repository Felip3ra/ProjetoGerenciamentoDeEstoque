import { Component, EventEmitter, Output } from '@angular/core';
import { Calendar, FileText, Hash, History, LucideAngularModule, Package, User, X } from 'lucide-angular';

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
  @Output() close = new EventEmitter<void>();
}
