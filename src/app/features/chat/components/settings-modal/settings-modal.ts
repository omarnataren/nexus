import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [],
  templateUrl: './settings-modal.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsModal {
  private authService = inject(AuthService);
  private router = inject(Router);
  close = output<void>();

  onLogout() {
    this.authService.logout();
  }

  onClose() {
    this.close.emit();
  }
}
