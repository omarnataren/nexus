import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register { 
  registerForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  constructor() {
    this.registerForm = this.fb.group(
      {
        username: this.fb.control<string>('', { nonNullable: true, validators:[Validators.required]}),
        email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
        confirmPassword: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}
  onSubmit() {
    if (this.registerForm.invalid) return;
    const { username,email, password } = this.registerForm.value; 

    const payload = {
      username,
      email,
      password
    };
    this.userService.postUser(payload).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (err) => console.error('Error during registration:', err)
    });
    console.log(payload);
  }

  private handleSuccess(response: any) {
    console.log('Registration successful:', response);
    this.router.navigate(['']);
  }


}
