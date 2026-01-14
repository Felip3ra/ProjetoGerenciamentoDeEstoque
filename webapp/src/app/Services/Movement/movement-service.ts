import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { buildApiUrl } from '../Auth/api-base';
import { Movement } from '../../interfaces/movement';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private readonly baseUrl = buildApiUrl('api/Movement');

  constructor(private http: HttpClient) {}

  GetAllMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.baseUrl}/GetAllMovements`);
  }

  GetMovementById(id: number): Observable<Movement> {
    return this.http.get<Movement>(`${this.baseUrl}/GetMovementById/${id}`);
  }

  AddMovement(payload: Movement): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/AddMovement`, payload).pipe(map(() => true));
  }
}
