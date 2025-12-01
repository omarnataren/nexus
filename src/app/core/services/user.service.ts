import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User, UserPost } from '@core/models';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiURL = `${environment.apiUrl}users`;
  constructor() { }

  postUser(credentials: UserPost) {
    return this.http.post<UserPost>(`${this.apiURL}`, credentials);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(`${this.apiURL}/${email}`);
  }
}
