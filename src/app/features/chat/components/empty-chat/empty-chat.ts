import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-chat',
  standalone: true,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  template: `
    <div class="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
      <span class="material-icons text-6xl mb-4">forum</span>
      <h2 class="text-xl font-bold mb-2">Select a Conversation</h2>
      <p class="text-sm">Choose a chat from the list to view messages</p>
    </div>
  `
})
export class EmptyChat {}
