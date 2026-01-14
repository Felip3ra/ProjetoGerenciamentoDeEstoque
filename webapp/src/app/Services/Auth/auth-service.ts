import { HttpClient } from '@angular/common/http';
import { buildApiUrl } from './api-base';
import { Injectable } from '@angular/core';
import { UserLogin, UserRegister } from '../../interfaces/user';
import { map, Observable, tap } from 'rxjs';
import { BearerTokenResponse } from '../../interfaces/BearerTokenResponse';
import { setSession } from './auth-session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl =  buildApiUrl('api/Auth');

  constructor(private http: HttpClient){}

  login(payload: UserLogin): Observable<BearerTokenResponse> {
    return this.http.post<BearerTokenResponse>(`${this.baseUrl}/Login`, payload).pipe(
      tap((res) => setSession(res.accessToken, res.expiresIn))
    );
  }
  register(payload: UserRegister): Observable<boolean>{
    return this.http.post(`${this.baseUrl}/Register`,payload).pipe(
      map (() => true)
    );
  }
}
