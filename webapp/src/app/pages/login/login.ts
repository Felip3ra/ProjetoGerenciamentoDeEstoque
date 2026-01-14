import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogIn, LucideAngularModule } from 'lucide-angular';
import { AuthService} from '../../Services/Auth/auth-service';
import { Router } from '@angular/router';
import { ToastService } from '../../Services/Toast/toast-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage: string | null = null;
  readonly LogInIcon = LogIn;
  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if(this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    const { email, senha } = this.loginForm.value;

    this.userService.login({ email: email, passwordHash: senha }).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.isSubmitting.set(false);
        this.toastService.success('Login realizado com sucesso.');
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = 'Falha no login. Verifique suas credenciais e tente novamente.';
        this.toastService.error('Falha no login.');
        this.isSubmitting.set(false);
      }
    });
  }
}
