import { ChangeDetectionStrategy, Component, inject, signal, output, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@core/services/user.service';
import { ConversationsService } from '@core/services/conversations.service';
import { AuthService } from '@core/auth/auth.service';
import { User, ConversationGet } from '@core/models';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-user.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchUser {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private conversationsService = inject(ConversationsService);
  private authService = inject(AuthService);

  conversations = input<ConversationGet[]>([]);
  close = output<void>();
  conversationCreated = output<void>();

  searchForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  foundUser = signal<User | null>(null);
  errorMessage = signal<string>('');

  isAlreadyContact = computed(() => {
    const user = this.foundUser();
    const currentConversations = this.conversations();
    if (!user || !currentConversations) return false;
    
    return currentConversations.some(c => c.participant_two_username === user.username);
  });

  isSelf = computed(() => {
    const user = this.foundUser();
    const currentUser = this.authService.currentUser();
    if (!user || !currentUser) return false;
    return user.username === currentUser.username;
  });

  onSearch() {
    if (this.searchForm.invalid) return;
    
    const email = this.searchForm.value.email!;
    this.errorMessage.set('');
    this.foundUser.set(null);

    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.foundUser.set(user);
      },
      error: (err) => {
        this.errorMessage.set('User not found');
        console.error(err);
      }
    });
  }

  onAddUser() {
    const user = this.foundUser();
    if (!user) return;

    this.conversationsService.postConversations(user.id).subscribe({
      next: () => {
        this.conversationCreated.emit();
        this.close.emit();
      },
      error: (err) => {
        console.error('Error creating conversation:', err);
        this.errorMessage.set('Error creating conversation');
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
