import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtentiService {

  constructor(private http: HttpClient) { }

  getUtenti() {
    return this.http.get<any>(`${environment.pathApi}/api/users`)
  }
}
