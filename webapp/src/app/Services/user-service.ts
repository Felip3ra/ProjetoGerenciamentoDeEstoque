import { HttpClient } from '@angular/common/http';
import { buildApiUrl } from './api-base';
import { Injectable } from '@angular/core';
import { UserLogin } from '../interfaces/user';
import { Observable, tap } from 'rxjs';
import { BearerTokenResponse } from '../interfaces/BearerTokenResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl =  buildApiUrl('api/auth');

  constructor(private http: HttpClient){}

  login(payload: UserLogin): Observable<BearerTokenResponse> {
    return this.http.post<BearerTokenResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => localStorage.setItem('accessToken', res.accessToken))
    );
  }
}
