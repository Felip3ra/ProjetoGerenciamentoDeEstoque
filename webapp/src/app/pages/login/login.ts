import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogIn, LucideAngularModule } from 'lucide-angular';

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
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit() {
    
  }
}
