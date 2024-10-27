import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/items/interfaces/item.interface';
import { Page } from 'src/app/items/interfaces/page.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private host : string = environment.apiUrl;
  private apiUrl : string = `${this.host}/category`;
  constructor(private http: HttpClient) { }

  public getCategory( idItem : number) : Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/${idItem}`);
  }

  public getCategories( ) : Observable<Page<Category>>{
    return this.http.get<Page<Category>>(`${this.apiUrl}/`);
  }

  public saveCategory( category : Category) : Observable<Category>{
    return this.http.post<Category>(`${this.apiUrl}/`,category);
  }

  public updateCategory( idItem : number , category : Category) : Observable<Category>{
    return this.http.put<Category>(`${this.apiUrl}/${idItem}` , category);
  }

  public deleteCategory( idCategory : number ) : Observable<Boolean> {
    return   this.http.delete<Boolean>(`${this.apiUrl}/${idCategory}` );
  }
}
