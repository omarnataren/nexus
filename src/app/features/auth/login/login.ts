import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router} from '@angular/router';
import {AuthService} from '@core/auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  loginForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  showPassword = signal(false);

  constructor() {
    this.loginForm = this.fb.group(
      {
        email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const payload = this.loginForm.value;
    this.authService.login(payload).subscribe({
      next: (response) =>{
        this.handleSuccess(response);
      },
      error: (err) =>{
        
      } 
    });
    
  }

  private handleSuccess(response: any){
    
    this.router.navigate(['']);
  }
}
