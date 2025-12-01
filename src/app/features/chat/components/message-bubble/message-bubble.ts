import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-bubble',
  imports: [CommonModule],
  templateUrl: './message-bubble.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBubble {
  @Input({ required: true }) content!: string;
  @Input() isMine: boolean = false;
  @Input() senderName: string = '';
  @Input() senderAvatar: string = 'avatars/avatar_default.svg';
  @Input() time: Date = new Date();
  @Input() isRead: boolean = false;

  isCodeBlock: boolean = false;
  cleanContent: string = '';
}
