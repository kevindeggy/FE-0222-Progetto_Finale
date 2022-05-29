import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Fattura } from '../models/fattura';

interface NuovaFattura {
  data: string,
  numero: number,
  anno: number,
  importo: number,
  stato: {
    id: number,
    nome: string
  }
  , cliente: { id: number }
}

@Injectable({
  providedIn: 'root'
})
export class FattureService {

  constructor(private http: HttpClient) { }

  getFatture(page: number) {
    return this.http.get<any>(`${environment.pathApi}/api/fatture?page=${page}&size=20&sort=id,ASC`)
  }

  getAllFatture() {
    return this.http.get<any>(`${environment.pathApi}/api/fatture?sort=id,ASC`)
  }

  getFattureSort(id: number, sort: string) {
    return this.http.get<any>(`${environment.pathApi}/api/fatture?page=${id}&size=20&sort=${sort},ASC`)
  }

  getFatturaSingola(id: number) {
    return this.http.get<Fattura>(`${environment.pathApi}/api/fatture/${id}`)
  }

  findFattura(value: any) {
    return this.http.post<any>(`${environment.pathApi}/api/fatture/find`, value)
  }

  findFatturaByCliente(cliente: number) {
    return this.http.get<any>(`${environment.pathApi}/api/fatture/cliente/${cliente}?page=0&size=20&sort=id,ASC`)
  }

  updateFattura(fatturaUpdate: Fattura) {
    return this.http.put<Fattura>(`${environment.pathApi}/api/fatture/${fatturaUpdate.id}`, fatturaUpdate)
  }

  deleteFattura(id: number) {
    return this.http.delete<Number>(`${environment.pathApi}/api/fatture/${id}`)
  }

  newFattura(nuovaFattura: NuovaFattura) {
    return this.http.post<NuovaFattura>(`${environment.pathApi}/api/fatture`, nuovaFattura)
  }
}
