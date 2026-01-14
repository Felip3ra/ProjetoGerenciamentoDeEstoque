import { Injectable } from '@angular/core';
import { buildApiUrl } from '../Auth/api-base';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Item } from '../../interfaces/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly baseUrl = buildApiUrl('api/Item');
  constructor(private http: HttpClient) {}

  GetAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/GetAllItems`);
  }
  GetItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/GetItemById/${id}`);
  }
  AddItem(payload: Item): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/AddItem`, payload).pipe(map(() => true));
  }
  UpdateItem(payload: Item): Observable<boolean> {
    return this.http.put(`${this.baseUrl}/UpdateItem`, payload).pipe(map(() => true));
  }
}
