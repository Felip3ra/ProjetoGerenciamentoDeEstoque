import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(type: ToastType, message: string, durationMs = 3000): void {
    const id = ++this.counter;
    this.toasts.update((items) => [...items, { id, type, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string, durationMs?: number): void {
    this.show('success', message, durationMs);
  }

  error(message: string, durationMs?: number): void {
    this.show('error', message, durationMs);
  }

  info(message: string, durationMs?: number): void {
    this.show('info', message, durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }
}
