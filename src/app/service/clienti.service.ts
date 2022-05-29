import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientiService {

  constructor(private http: HttpClient) { }

  getClienti(id: number) {
    return this.http.get<any>(`${environment.pathApi}/api/clienti?page=${id}&size=20&sort=id,ASC`)
  }

  getAllClienti() {
    return this.http.get<any>(`${environment.pathApi}/api/clienti?sort=id,ASC`)
  }

  getClientiSort(id: number, sort: string) {
    return this.http.get<any>(`${environment.pathApi}/api/clienti?page=${id}&size=20&sort=${sort},ASC`)
  }

  getClienteSingolo(id: number) {
    return this.http.get<Cliente>(`${environment.pathApi}/api/clienti/${id}`)
  }

  findCliente(value: any) {
    return this.http.post<any>(`${environment.pathApi}/api/clienti/find`, value)
  }

  newCliente(nuovoCliente: any) {
    return this.http.post<any>(`${environment.pathApi}/api/clienti`, nuovoCliente)
  }

  updateCliente(ClienteUpdate: any) {
    return this.http.put<any>(`${environment.pathApi}/api/clienti/${ClienteUpdate.id}`, ClienteUpdate)
  }

  deleteCliente(id: number) {
    return this.http.delete(`${environment.pathApi}/api/clienti/${id}`)
  }

  newProvincia(provinciaNuova: any) {
    return this.http.post<any>(`${environment.pathApi}/api/province`, provinciaNuova)
  }

  newComune(comuneNuovo: any) {
    return this.http.post<any>(`${environment.pathApi}/api/comuni`, comuneNuovo)
  }
}
