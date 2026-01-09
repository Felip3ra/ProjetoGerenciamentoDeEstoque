import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './user-edit-modal.html',
  styleUrls: ['./user-edit-modal.css'],
})
export class UserEditModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
}
