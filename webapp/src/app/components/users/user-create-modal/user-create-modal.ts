import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-user-create-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './user-create-modal.html',
  styleUrls: ['./user-create-modal.css'],
})
export class UserCreateModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
}
