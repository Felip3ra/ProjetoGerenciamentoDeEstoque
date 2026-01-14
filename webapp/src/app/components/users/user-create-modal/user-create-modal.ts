import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { Department } from '../../../interfaces/department';
import { ToastService } from '../../../Services/Toast/toast-service';
import { UserFacade } from '../../../Services/User/user-facade';

@Component({
  selector: 'app-user-create-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './user-create-modal.html',
  styleUrls: ['./user-create-modal.css'],
})
export class UserCreateModal {
  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  hasAccess = true;
  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  departments = Object.values(Department);

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private userFacade: UserFacade
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      department: [Department.Development, [Validators.required]],
      hasAccess: [true],
      profile: ['Operador'],
      passwordHash: [''],
    });
  }

  setAccess(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    this.hasAccess = target?.value === 'com';
    this.form.patchValue({ hasAccess: this.hasAccess });
    if (!this.hasAccess) {
      this.form.patchValue({ passwordHash: '' });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha os campos obrigatórios.';
      return;
    }

    const value = this.form.value;
    this.isSubmitting = true;
    this.errorMessage = null;
    this.userFacade.registerUser({
      name: value.name,
      email: value.email,
      passwordHash: value.passwordHash || '',
      department: value.department,
      hasAccess: value.hasAccess,
      profile: value.profile,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Usuário cadastrado com sucesso.');
        this.saved.emit();
        this.close.emit();
      },
      error: () => {
        this.errorMessage = 'Erro ao criar usuário. Tente novamente.';
        this.toastService.error('Erro ao cadastrar usuário.');
        this.isSubmitting = false;
      }
    });
  }
}
