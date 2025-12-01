import { ChangeDetectionStrategy, Component, OnInit, inject, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageBubble } from '../components/message-bubble/message-bubble';
import { MessagesService } from '@core/services/messages.service';
import { AuthService } from '@core/auth/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-message-view',
  imports: [MessageBubble, ReactiveFormsModule],
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
  private fb = inject(FormBuilder);

  protected messageForm = this.fb.group({
    conversation_id: [this.route.snapshot.paramMap.get('conversationId')],  
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  myUserId = this.authService.currentUser()?.id;
  myUserName = this.authService.currentUser()?.username;

  chatPartnerName = computed(() => {
    const messages = this.messagesService.currentMessages();
    if (messages.length === 0) return 'Chat';
    const firstMsg = messages[0];
    return firstMsg.sender_username === this.myUserName ? firstMsg.receiver_username : firstMsg.sender_username;
  });

  constructor() {
    effect(() => {
      const messages = this.messagesService.currentMessages();
      messages.forEach(msg => {
        if (msg.sender_username !== this.myUserName && !msg.is_read) {
          this.messagesService.markAsRead(msg.id).subscribe({
            next: () => {
              msg.is_read = true;
            }
          });
        }
      });
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const conversationId = params.get('conversationId');
      
      if (conversationId) {
        this.messagesService.getConversationMessages(conversationId);
        this.messageForm.patchValue({ conversation_id: conversationId });
      }
    });
  }
  
  onSubmit() {
    if (this.messageForm.invalid) return;

    const { conversation_id, content } = this.messageForm.value;
    if (!conversation_id || !content) return;

    this.messagesService.postMessage(conversation_id, content).subscribe({
      next: (response) => {
        console.log('Message sent:', response);
        this.messageForm.reset({ conversation_id });
        this.messagesService.getConversationMessages(conversation_id);
      },
      error: (err) => console.error('Error sending message:', err)
    });
  }
}
