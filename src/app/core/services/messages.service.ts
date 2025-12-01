import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Message, MessagesGetAllResponse, MessagesGet } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = `${environment.apiUrl}messages`;
  private http = inject(HttpClient);
  public currentMessages = signal<MessagesGet[]>([]);
  
  getConversationMessages(conversation_id: string) {
    this.currentMessages.set([]);
    this.http.get<MessagesGetAllResponse>(`${this.apiUrl}/${conversation_id}`)
      .subscribe({
        next: (response) => {
          this.currentMessages.set(response.data);
          console.log('Mensajes cargados:', response.data);
        },
        error: (err) => console.error('Error cargando chat:', err)
      });
  }

  postMessage(conversation_id: string, content: string) {
    return this.http.post<Message>(this.apiUrl, { conversation_id, content });
  }
}
