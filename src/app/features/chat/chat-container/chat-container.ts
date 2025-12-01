import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ChatCard } from '../components/chat-card/chat-card';
import { Conversation, ConversationGet } from '@core/models';
import { ConversationsService } from '@core/services/conversations.service';
import { AuthService } from '@core/auth/auth.service';
@Component({
  selector: 'app-chat-container',
  imports: [RouterOutlet, ChatCard, RouterLink],
  templateUrl: './chat-container.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainer {
  private router = inject(Router);
  private conversationService = inject(ConversationsService);
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser();

  conversations = signal<ConversationGet[]>([]);
  
  constructor() {
    this.loadConversations();
  }

  loadConversations() {
    this.conversationService.getConversations().subscribe({
      next: (data) => {
        console.log(data);
        this.conversations.set(data.data);
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
      }
    });
  }
}
