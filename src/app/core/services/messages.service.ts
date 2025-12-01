import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Message, MessagesGetAllResponse, MessagesGet } from '@core/models';
import { Subscription, timer, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = `${environment.apiUrl}messages`;
  private http = inject(HttpClient);
  public currentMessages = signal<MessagesGet[]>([]);
  public isLoading = signal(false);
  
  private pollingSubscription: Subscription | null = null;

  getConversationMessages(conversation_id: string) {
    this.stopPolling();
    
    this.isLoading.set(true);
    this.currentMessages.set([]);
    
    this.pollingSubscription = timer(0, 3000).pipe(
      switchMap(() => this.http.get<MessagesGetAllResponse>(`${this.apiUrl}/${conversation_id}`))
    ).subscribe({
      next: (response) => {
        this.currentMessages.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando chat:', err);
        this.isLoading.set(false);
      }
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  postMessage(conversation_id: string, content: string) {
    return this.http.post<Message>(this.apiUrl, { conversation_id, content });
  }

  markAsRead(message_id: string) {
    return this.http.patch(`${this.apiUrl}/${message_id}/read`, {is_read: true});
  }

}
