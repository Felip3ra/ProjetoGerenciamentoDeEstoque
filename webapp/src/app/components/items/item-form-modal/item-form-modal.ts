import { Component } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-item-form-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './item-form-modal.html',
  styleUrls: ['./item-form-modal.css'],
})
export class ItemFormModal {
  readonly CloseIcon = X;
}
