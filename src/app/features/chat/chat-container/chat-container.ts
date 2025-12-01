import { ChangeDetectionStrategy, Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from '@angular/router';
import { ChatCard } from '../components/chat-card/chat-card';
import { SearchUser } from '../components/search-user/search-user';
import { SettingsModal } from '../components/settings-modal/settings-modal';
import { BottomNav } from '../components/bottom-nav/bottom-nav';
import { Conversation, ConversationGet } from '@core/models';
import { ConversationsService } from '@core/services/conversations.service';
import { AuthService } from '@core/auth/auth.service';
import { Subscription, timer, switchMap } from 'rxjs';

@Component({
  selector: 'app-chat-container',
  imports: [RouterOutlet, ChatCard, RouterLink, RouterLinkActive, SearchUser, SettingsModal, BottomNav],
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
export class ChatContainer implements OnDestroy {
  private router = inject(Router);
  private conversationService = inject(ConversationsService);
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser();

  conversations = signal<ConversationGet[]>([]);
  isLoading = signal(true);
  showSearchUser = signal(false);
  showSettings = signal(false);
  
  private pollingSubscription: Subscription | null = null;

  activeTab = computed(() => {
    if (this.showSearchUser()) return 'contacts';
    if (this.showSettings()) return 'settings';
    return 'chats';
  });
  
  constructor() {
    this.loadConversations();
  }

  loadConversations() {
    this.isLoading.set(true);
    
    this.pollingSubscription = timer(0, 5000).pipe(
      switchMap(() => this.conversationService.getConversations())
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.conversations.set(data.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  toggleSearchUser() {
    this.showSearchUser.update(v => !v);
    if (this.showSearchUser()) this.showSettings.set(false);
  }

  toggleSettings() {
    this.showSettings.update(v => !v);
    if (this.showSettings()) this.showSearchUser.set(false);
  }

  onTabSelected(tab: string) {
    if (tab === 'chats') {
      this.showSearchUser.set(false);
      this.showSettings.set(false);
    } else if (tab === 'contacts') {
      if (!this.showSearchUser()) {
        this.toggleSearchUser();
      }
    } else if (tab === 'settings') {
      if (!this.showSettings()) {
        this.toggleSettings();
      }
    }
  }
}
