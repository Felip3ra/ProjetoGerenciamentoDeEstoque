import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { ToastService } from '../../Services/Toast/toast-service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.css'],
})
export class ToastContainer {
  readonly CloseIcon = X;

  constructor(public toastService: ToastService) {}
}
