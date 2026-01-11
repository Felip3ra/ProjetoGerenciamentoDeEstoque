import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogIn, LucideAngularModule } from 'lucide-angular';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  readonly LogInIcon = LogIn;
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if(this.loginForm.invalid) return;

    this.isSubmitting = true;
    const { email, senha } = this.loginForm.value;

    this.userService.login({ email: email, passwordHash: senha }).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = 'Falha no login. Verifique suas credenciais e tente novamente.';
        this.isSubmitting = false;
      }
    });
  }
}
