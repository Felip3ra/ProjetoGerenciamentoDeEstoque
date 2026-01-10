import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-item-edit-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './item-edit-modal.html',
  styleUrls: ['./item-edit-modal.css'],
})
export class ItemEditModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
}
