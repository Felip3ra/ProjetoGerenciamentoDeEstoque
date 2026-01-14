import { Injectable } from '@angular/core';
import { buildApiUrl } from '../Auth/api-base';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = buildApiUrl('api/User');
  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/GetAllUsers`);
  }
  GetUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/GetUserById/${id}`);
  }
  AddUser(payload: User): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/AddUser`, payload, { responseType: 'text' }).pipe(map(() => true));
  }
  UpdateUser(payload: User): Observable<boolean> {
    return this.http.put(`${this.baseUrl}/UpdateUser`, payload, { responseType: 'text' }).pipe(map(() => true));
  }
}
