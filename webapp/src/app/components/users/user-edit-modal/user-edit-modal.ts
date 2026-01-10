import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './user-edit-modal.html',
  styleUrls: ['./user-edit-modal.css'],
})
export class UserEditModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
  hasAccess = true;

  setAccess(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    this.hasAccess = target?.value === 'com';
  }
}
