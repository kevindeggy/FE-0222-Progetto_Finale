import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fattura } from '../models/fattura';
import { ClientiService } from '../service/clienti.service';
import { FattureService } from '../service/fatture.service';

@Component({
  template: `
  <button class="btn" (click)="switchFunc()" nz-button>{{button}}</button>
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">

<nz-form-item *ngIf="!switch">
  <nz-form-label class="label" [nzSm]="6" [nzXs]="24" nzRequired nzFor="sort">Scegli cosa ricercare</nz-form-label>
  <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il campo!">
    <nz-select class="choise-select" id="sort" formControlName="sort">
      <nz-option nzValue="id" nzLabel="ID Fattura"></nz-option>
      <nz-option nzValue="anno" nzLabel="Anno Fattura"></nz-option>
      <nz-option nzValue="importo" nzLabel="Importo Fattura"></nz-option>
    </nz-select>
  </nz-form-control>
</nz-form-item>

<nz-form-item *ngIf="switch">
  <nz-form-label class="label" [nzSm]="6" [nzXs]="24" nzRequired nzFor="sort">Scegli il Cliente</nz-form-label>
  <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il campo!">
    <nz-select class="choise-select" id="sort" formControlName="sort">
      <nz-option *ngFor="let item of clienti" [nzValue]="item.id" [nzLabel]="item.nomeContatto"></nz-option>
    </nz-select>
  </nz-form-control>
</nz-form-item>

<nz-form-item *ngIf="!switch">
  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="contenuto">Contenuto ricerca</nz-form-label>
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
<div *ngIf="!loading">
<div *ngFor="let fattura of fatturaRes" class="fattura">
    <nz-card style="width:270px;" *ngIf="fattura.cliente.nomeContatto && fattura.cliente.cognomeContatto && fattura.cliente.partitaIva" [nzCover]="coverTemplate">
      <nz-card-meta
        nzTitle="{{fattura.cliente.nomeContatto}} {{fattura.cliente.cognomeContatto}}"
        nzDescription="partita IVA: {{fattura.cliente.partitaIva}}"
      ></nz-card-meta>
    </nz-card>
    <ng-template #coverTemplate>
      <img alt="example" src="https://it.seaicons.com/wp-content/uploads/2015/10/Filetype-Docs-icon.png" />
    </ng-template>

    <div *ngIf="fattura.id && fattura.importo && fattura.anno && fattura.cliente.tipoCliente && fattura.data">
    <nz-descriptions
      nzTitle="Descrizione Fattura"
      nzBordered
      [nzColumn]="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
    >
      <nz-descriptions-item nzTitle="ID Fattura">Tipo Cliente </nz-descriptions-item>
      <nz-descriptions-item nzTitle="Importo">Stato Fattura</nz-descriptions-item>
      <nz-descriptions-item nzTitle="Anno Fattura">Data Inserimento</nz-descriptions-item>
      <nz-descriptions-item nzTitle="{{fattura.id}}">{{fattura.cliente.tipoCliente}}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="{{fattura.importo}}">{{fattura.stato.nome}}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="{{fattura.anno}}">{{fattura.data}}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="Cliente Info" *ngIf="fattura.cliente.indirizzoSedeOperativa">
        Indirizzo Sede Legale:
        <br />
        <br />
        {{fattura.cliente.indirizzoSedeOperativa.via}}, {{fattura.cliente.indirizzoSedeOperativa.civico}}
        <br />
        CAP: {{fattura.cliente.indirizzoSedeOperativa.cap}}, {{fattura.cliente.indirizzoSedeOperativa.localita}}
        <br />
        Comune: {{fattura.cliente.indirizzoSedeOperativa.comune.nome}}, Provincia: {{fattura.cliente.indirizzoSedeOperativa.comune.provincia.nome}} ({{fattura.cliente.indirizzoSedeOperativa.comune.provincia.sigla}})

      </nz-descriptions-item>
    </nz-descriptions>
    </div>
    </div>
    </div>
  `,
  styles: [` .fattura {
    display: flex;
    gap: 2em;
    margin: 50px 0;
  }
  .titleCard {
      font-size: 4em;
      text-align: center;
      margin: auto 0;
      text-shadow: 2px 2px 2px #007FFF;
    }
    .btn {
      margin: 0 auto 2em;
    }
    `
  ]
})
export class RicercaFatturaComponent implements OnInit {
  loading: boolean = false;
  button: string = "Ricerca Fatture per Cliente";
  switch: boolean = false;
  validateForm!: FormGroup;
  loadingRicerca: boolean = false;
  ricerca = {
    conditionList: [
      {
        key: "anno",
        value: "2021",
        operation: "EQUAL"
      }
    ]
  }
  fatturaRes: Fattura[] = [];
  clienti!: any;

  switchFunc() {
    this.switch = !this.switch
    if (this.switch) {
      this.button = "Ricerca Fatture per Dati";
    } else {
      this.button = "Ricerca Fatture per Cliente";
    }
  }

  constructor(private fb: FormBuilder, private srvFatt: FattureService, private srvClienti: ClientiService) { }

  submitForm() {
    this.loadingRicerca = true;

    if (!this.switch) {
      this.ricerca.conditionList[0].key = this.validateForm.value.sort;
      this.ricerca.conditionList[0].value = this.validateForm.value.contenuto;

      this.srvFatt.findFattura(this.ricerca).subscribe((res) => {
        this.fatturaRes = res.content
        this.loadingRicerca = false;
      })
    } else {
      this.srvFatt.findFatturaByCliente(this.validateForm.value.sort).subscribe((res) => {
        this.fatturaRes = res.content
        this.loadingRicerca = false;
      })
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      sort: ['', Validators.required],
      contenuto: ['', Validators.required]
    });

    this.srvClienti.getAllClienti().subscribe((res) => {
      this.clienti = res.content
    })
  }
}
