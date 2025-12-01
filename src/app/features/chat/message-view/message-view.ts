import { ChangeDetectionStrategy, Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageBubble } from '../components/message-bubble/message-bubble';
import { MessagesService } from '@core/services/messages.service';
import { AuthService } from '@core/auth/auth.service';
@Component({
  selector: 'app-message-view',
  imports: [MessageBubble],
  templateUrl: './message-view.html',
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageView implements OnInit { 
  private route = inject(ActivatedRoute);
  public messagesService = inject(MessagesService);
  private authService = inject(AuthService);

  myUserId = this.authService.currentUser()?.id;
  myUserName = this.authService.currentUser()?.username;

  chatPartnerName = computed(() => {
    const messages = this.messagesService.currentMessages();
    if (messages.length === 0) return 'Chat';
    const firstMsg = messages[0];
    return firstMsg.sender_username === this.myUserName ? firstMsg.receiver_username : firstMsg.sender_username;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const conversationId = params.get('conversationId');
      
      if (conversationId) {
        this.messagesService.getConversationMessages(conversationId);
      }
    });
  }
  
}
