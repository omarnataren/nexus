import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '@core/models/user-model';
@Component({
  selector: 'app-chat-card',
  imports: [CommonModule, RouterModule],
  template: `
  <div 
      class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border-l-4"
      [ngClass]="isActive 
        ? 'bg-gradient-to-r from-blue-900/20 to-transparent border-blue-500' 
        : 'hover:bg-slate-800/40 border-transparent'">
      
      <div class="relative">
        <img [src]="avatarUrl" class="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800" [alt]="username">
        @if(isOnline){
          <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
        }
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-baseline">
          <h3 class="font-semibold text-sm truncate" 
              [ngClass]="isActive ? 'text-white' : 'text-slate-300'">
              {{ username }}
          </h3>
          <span class="text-xs" [ngClass]="isActive ? 'text-blue-400' : 'text-slate-500'">
            {{ time }}
          </span>
        </div>
        <p class="text-xs truncate" [ngClass]="isActive ? 'text-slate-400' : 'text-slate-500'">
          {{ lastMessage }}
        </p>
      </div>
      
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatCard { 

  @Input({ required: true }) username!: string;
  @Input({ required: true }) lastMessage!: string;
  @Input() avatarUrl: string = '/assets/avatars/default.jpg';
  @Input() time: Date = new Date();
  @Input() isOnline: boolean = false;
  @Input() isActive: boolean = false;


}
