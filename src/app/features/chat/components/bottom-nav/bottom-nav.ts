import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  template: `
    <div class="p-4 border-t border-slate-800/50 flex justify-around text-slate-400 bg-slate-900/95 backdrop-blur-xl relative z-50">
      <button (click)="onTab('chats')" class="flex flex-col items-center gap-1 hover:text-blue-400 transition" [class.text-blue-500]="activeTab() === 'chats'" [class.text-slate-400]="activeTab() !== 'chats'">
        <span class="material-icons text-xl">chat_bubble</span>
        <span class="text-[10px] font-medium">Chats</span>
      </button>
      <button (click)="onTab('contacts')" class="flex flex-col items-center gap-1 hover:text-white transition" [class.text-blue-400]="activeTab() === 'contacts'">
        <span class="material-icons text-xl">people</span>
        <span class="text-[10px] font-medium">Contacts</span>
      </button>
      <button (click)="onTab('settings')" class="flex flex-col items-center gap-1 hover:text-white transition" [class.text-blue-400]="activeTab() === 'settings'">
        <span class="material-icons text-xl">settings</span>
        <span class="text-[10px] font-medium">Settings</span>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNav {
  activeTab = input<'chats' | 'contacts' | 'settings'>('chats');
  tabSelected = output<'chats' | 'contacts' | 'settings'>();

  onTab(tab: 'chats' | 'contacts' | 'settings') {
    this.tabSelected.emit(tab);
  }
}
