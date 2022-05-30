import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';

@Component({
  template: `
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label class="label" [nzSm]="6" [nzXs]="24" nzRequired nzFor="sort">Scegli cosa ricercare</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il campo!">
          <nz-select class="choise-select" id="sort" formControlName="sort">
            <nz-option nzValue="id" nzLabel="ID Cliente"></nz-option>
            <nz-option nzValue="nomeContatto" nzLabel="Nome Cliente"></nz-option>
            <nz-option nzValue="ragioneSociale" nzLabel="Ragione Sociale Cliente"></nz-option>
            <nz-option nzValue="email" nzLabel="Email Cliente"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="contenuto">Contenuto ricerca (case sensitive)</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un nome valido!">
          <input nz-input type="text" formControlName="contenuto" id="contenuto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary">Cerca</button>
        </nz-form-control>
      </nz-form-item>
    </form>

    <nz-spin class="titleCard" *ngIf="loadingRicerca" nzSimple [nzSize]="'large'"></nz-spin>
    <nz-empty *ngIf="!loading && clienteRes.length === 0 && !loadingRicerca">Nessun Risultato</nz-empty>

    <div *ngIf="!loading && clienteRes.length > 0">
      <div *ngFor="let cliente of clienteRes" class="cliente">
        <nz-card style="width:270px;" *ngIf="cliente.nomeContatto && cliente.cognomeContatto && cliente.partitaIva" [nzCover]="coverTemplate" [nzLoading]="loading">
          <nz-card-meta nzTitle="{{ cliente.nomeContatto }} {{ cliente.cognomeContatto }}" nzDescription="partita IVA: {{ cliente.partitaIva }}"></nz-card-meta>
        </nz-card>
        <ng-template #coverTemplate>
          <img alt="example" src="https://iconarchive.com/download/i104802/papirus-team/papirus-status/avatar-default.ico" />
        </ng-template>

        <div *ngIf="cliente.id && cliente.tipoCliente && cliente.ragioneSociale && cliente.telefono && cliente.pec">
          <nz-descriptions nzTitle="Descrizione Cliente" nzBordered [nzColumn]="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
            <nz-descriptions-item nzTitle="ID Cliente">Tipo Cliente </nz-descriptions-item>
            <nz-descriptions-item nzTitle="Ragione Sociale">Telefono</nz-descriptions-item>
            <nz-descriptions-item nzTitle="Pec">Data Inserimento</nz-descriptions-item>
            <nz-descriptions-item nzTitle="{{ cliente.id }}">{{ cliente.tipoCliente }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="{{ cliente.ragioneSociale }}">{{ cliente.telefono }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="{{ cliente.pec }}">{{ cliente.dataInserimento }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="Cliente Info" *ngIf="cliente.indirizzoSedeOperativa">
              Indirizzo Sede Legale:
              <br />
              <br />
              {{ cliente.indirizzoSedeLegale.via }}, {{ cliente.indirizzoSedeLegale.civico }}
              <br />
              CAP: {{ cliente.indirizzoSedeLegale.cap }}, {{ cliente.indirizzoSedeLegale.localita }}
              <br />
              Comune: {{ cliente.indirizzoSedeLegale.comune.nome }}, Provincia: {{ cliente.indirizzoSedeLegale.comune.provincia.nome }} ({{ cliente.indirizzoSedeLegale.comune.provincia.sigla }})
            </nz-descriptions-item>
          </nz-descriptions>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cliente {
        display: flex;
        gap: 2em;
        margin: 50px 0;
      }
      .titleCard {
        font-size: 4em;
        text-align: center;
        margin: auto 0;
        text-shadow: 2px 2px 2px #007fff;
      }
    `,
  ],
})
export class RicercaClienteComponent implements OnInit {
  loading: boolean = false;
  validateForm!: FormGroup;
  loadingRicerca: boolean = false;
  ricerca = {
    conditionList: [
      {
        key: "email",
        value: "miamail@gmail.com",
        operation: "EQUAL",
      },
    ],
  };
  clienteRes: Cliente[] = [];

  constructor(private fb: FormBuilder, private srvClienti: ClientiService) { }

  submitForm() {
    this.loadingRicerca = true;
    this.ricerca.conditionList[0].key = this.validateForm.value.sort;
    this.ricerca.conditionList[0].value = this.validateForm.value.contenuto;

    this.srvClienti.findCliente(this.ricerca).subscribe((res) => {
      this.clienteRes = res.content;

      this.loadingRicerca = false;
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      sort: ["", Validators.required],
      contenuto: ["", Validators.required],
    });
  }
}
