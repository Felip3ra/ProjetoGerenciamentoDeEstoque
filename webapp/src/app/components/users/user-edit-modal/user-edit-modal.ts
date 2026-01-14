import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { User } from '../../../interfaces/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../../interfaces/department';
import { Status } from '../../../interfaces/status';
import { ToastService } from '../../../Services/Toast/toast-service';
import { UserMapper } from '../../../Services/User/user-mapper';
import { UserFacade } from '../../../Services/User/user-facade';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './user-edit-modal.html',
  styleUrls: ['./user-edit-modal.css'],
})
export class UserEditModal {
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private userMapper: UserMapper,
    private userFacade: UserFacade
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      department: [Department.Development, [Validators.required]],
      hasAccess: [true],
      profile: ['Admin'],
      status: [Status.Active, [Validators.required]],
      passwordHash: [''],
    });
  }

  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Input() user: User | null = null;
  form: FormGroup;
  hasAccess = true;
  departments = Object.values(Department);
  statuses = Object.values(Status);
  isSubmitting = false;
  errorMessage: string | null = null;

  setAccess(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    this.hasAccess = target?.value === 'com';
    this.form.patchValue({ hasAccess: this.hasAccess });
    if (!this.hasAccess) {
      this.form.patchValue({ passwordHash: '' });
    }
  }

  ngOnChanges(): void {
    this.hasAccess = this.user?.hasAccess ?? true;
    if (!this.user) {
      return;
    }
    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
      department: this.userMapper.fromApiDepartment(this.user.department),
      hasAccess: this.user.hasAccess,
      profile: this.user.profile,
      status: this.userMapper.fromApiStatus(this.user.status),
    });
  }


  onSubmit() {
    if (this.form.invalid || !this.user) {
      this.errorMessage = 'Preencha os campos obrigatórios.';
      return;
    }

    const value = this.form.value;
    this.isSubmitting = true;
    this.errorMessage = null;
    this.userFacade.updateUser(this.user, value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Usuário atualizado com sucesso.');
        this.saved.emit();
        this.close.emit();
      },
      error: () => {
        this.errorMessage = 'Erro ao atualizar usuário. Tente novamente.';
        this.toastService.error('Erro ao atualizar usuário.');
        this.isSubmitting = false;
      }
    });
  }
}
