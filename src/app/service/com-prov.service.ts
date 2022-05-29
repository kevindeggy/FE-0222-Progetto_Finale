import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComProvService {

  constructor(private http: HttpClient) { }

  getComuni(page: number) {
    return this.http.get<any>(`${environment.pathApi}/api/comuni?page=${page}&size=20&sort=id,ASC`)
  }
}
