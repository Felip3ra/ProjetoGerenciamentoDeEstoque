import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { Item } from '../../../interfaces/item';
import { User } from '../../../interfaces/user';
import { MovementFacade } from '../../../Services/Movement/movement-facade';
import { UserFacade } from '../../../Services/User/user-facade';
import { ToastService } from '../../../Services/Toast/toast-service';

@Component({
  selector: 'app-movement-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './movement-modal.html',
  styleUrls: ['./movement-modal.css'],
})
export class MovementModal {
  constructor(
    private fb: FormBuilder,
    private movementFacade: MovementFacade,
    private userFacade: UserFacade,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      toUserId: [null, [Validators.required]],
      observation: [''],
    });
  }

  readonly CloseIcon = X;
  @Input() item: Item | null = null;
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  users: User[] = [];
  isSubmitting = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.userFacade.loadUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar usuários.';
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.item) {
      this.errorMessage = 'Selecione uma pessoa válida.';
      return;
    }

    const value = this.form.value;
    this.isSubmitting = true;
    this.errorMessage = null;
    this.movementFacade.addMovement(this.item, value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Movimentação registrada com sucesso.');
        this.close.emit();
      },
      error: () => {
        this.errorMessage = 'Erro ao atribuir item. Tente novamente.';
        this.toastService.error('Erro ao registrar movimentação.');
        this.isSubmitting = false;
      }
    });
  }
}
