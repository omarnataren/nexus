import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from '@angular/router';
import { ChatCard } from '../components/chat-card/chat-card';
import { SearchUser } from '../components/search-user/search-user';
import { Conversation, ConversationGet } from '@core/models';
import { ConversationsService } from '@core/services/conversations.service';
import { AuthService } from '@core/auth/auth.service';
@Component({
  selector: 'app-chat-container',
  imports: [RouterOutlet, ChatCard, RouterLink, RouterLinkActive, SearchUser],
  templateUrl: './chat-container.html',
  styles: `
    :host {
      display: block;
    }
    .active-chat-class .active-indicator {
      opacity: 1;
      height: 60%;
    }
    .active-chat-class {
      background-color: rgba(30, 41, 59, 0.5); /* bg-slate-800/50 */
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
  showSearchUser = signal(false);
  
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

  toggleSearchUser() {
    this.showSearchUser.update(v => !v);
  }
}
