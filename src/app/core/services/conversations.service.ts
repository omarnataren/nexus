import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Conversation, ConversationPost , ConversationGet, ConversationGetAllResponse} from '@models/index';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private apiUrl = `${environment.apiUrl}conversations`;
  private http = inject(HttpClient);
  constructor() { }

  postConversations(participant_two_id: string){
    return this.http.post<ConversationPost>(this.apiUrl, { participant_two_id });
  }
  
  getConversations(){
    return this.http.get<ConversationGetAllResponse>(`${this.apiUrl}/me`);
  }

  getConversationById(id: string){
    return this.http.get<ConversationPost>(`${this.apiUrl}/${id}`);
  }

  deleteConversation(id: string){
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateConversation(id: string, conversation: ConversationPost){
    return this.http.put<ConversationPost>(`${this.apiUrl}/${id}`, conversation);
  }
}