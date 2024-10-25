import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/items/interfaces/item.interface';
import { Page } from 'src/app/items/interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl : string = 'http://localhost:9091/items';
  constructor(private http: HttpClient) { }

  public getItem( idItem : number) : Observable<Item>{
    return this.http.get<Item>(`${this.apiUrl}/${idItem}`);
  }

  public getListItem( ) : Observable<Page<Item>>{
    return this.http.get<Page<Item>>(`${this.apiUrl}/`);
  }

  public saveItem( item : Item) : Observable<Item>{
    return this.http.post<Item>(`${this.apiUrl}/` , item );
  }

  public updateItem( idItem : number , item : Item) : Observable<Item>{
    return this.http.put<Item>(`${this.apiUrl}/${idItem}` , item);
  }

  public deleteItem( idItem : number ) : Observable<Boolean> {
    return   this.http.delete<Boolean>(`${this.apiUrl}/${idItem}` );
  }

  public updateStatus( items : Item[]) : Observable<Boolean> {
    return this.http.patch<Boolean>(`${this.apiUrl}/status` , items);
  }
}


