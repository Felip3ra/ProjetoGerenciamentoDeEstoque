import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-movement-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './movement-modal.html',
  styleUrls: ['./movement-modal.css'],
})
export class MovementModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
}
