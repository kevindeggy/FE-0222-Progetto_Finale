import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';
import { FattureService } from '../service/fatture.service';

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

@Component({
  template: `
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <h3>Inserimento Nuova Fattura:</h3>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="selezCliente" nzRequired>Cliente</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Scelgi l'intestatario della Fattura!">
          <nz-select class="choise.select" id="selezCliente" formControlName="selezCliente">
            <nz-option *ngFor="let item of utenti" nzValue="{{ item.id }}" nzLabel="{{ item.cognomeContatto }} {{ item.nomeContatto }}"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="numeroFattura">Numero Fattura</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero valido!">
          <input nz-input pattern="^[0-9]+" formControlName="numeroFattura" id="numeroFattura" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="data" nzRequired nzTooltipTitle="Inserimento automatico, data odierna">
          <span>Data inserimento Fattura</span>
        </nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Data non valida!">
          <input nz-input id="data" formControlName="data" value="{{ dataOggi | date: 'dd/MM/YYYY' }}" readonly />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="anno" nzRequired nzTooltipTitle="Inserimento automatico, anno attuale">
          <span>Anno Fattura</span>
        </nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Data non valida!">
          <input nz-input id="anno" pattern="^[12][0-9]{3}$" minlength="4" maxlength="4" formControlName="anno" value="{{ annoOggi }}" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="statoFatt" nzRequired>Stato nuova Fattura</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Scelgi stato Fattura!">
          <nz-select class="choise.select" id="statoFatt" formControlName="statoFatt">
            <nz-option nzValue="PAGATA" nzLabel="Pagata"></nz-option>
            <nz-option nzValue="NON PAGATA" nzLabel="Non Pagata"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="importo">Importo</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un importo valido!">
          <input nz-input pattern="^[0-9]{1,16}([,.][0-9]{1,2})?$" formControlName="importo" id="importo" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button [disabled]="validateForm.invalid" nz-button nzType="primary">Inserisci Nuova Fattura</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [],
})
export class NuovaFatturaComponent implements OnInit {
  loading = false;
  validateForm!: FormGroup;
  dataOggi = new Date().toISOString();
  annoOggi = new Date().getFullYear();
  utenti!: Cliente[];
  nuovaFattura: NuovaFattura = {
    data: "",
    numero: 0,
    anno: 0,
    importo: 0,
    stato: {
      id: 0,
      nome: "",
    },
    cliente: { id: 0 },
  };

  constructor(private fb: FormBuilder, private srvClienti: ClientiService, private srvFatt: FattureService, private modal: NzModalService) { }

  submitForm() {
    this.nuovaFattura.anno = +this.validateForm.value.anno;
    this.nuovaFattura.importo = +this.validateForm.value.importo;
    this.nuovaFattura.data = this.validateForm.value.data;
    this.nuovaFattura.numero = this.validateForm.value.numeroFattura;
    if (this.validateForm.value.statoFatt === "PAGATA") {
      this.nuovaFattura.stato = { id: 1, nome: "PAGATA" };
    } else {
      this.nuovaFattura.stato = { id: 2, nome: "NON PAGATA" };
    }
    this.nuovaFattura.cliente = { id: this.validateForm.value.selezCliente };

    this.srvFatt.newFattura(this.nuovaFattura).subscribe(() => {
      this.successTask();
    });
  }

  successTask(): void {
    this.modal.success({
      nzTitle: "Comando eseguito correttamente",
      nzContent: "Fattura creata con successo!",
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.srvClienti.getAllClienti().subscribe((res) => {
      this.utenti = res.content;
      this.loading = false;
    });

    this.validateForm = this.fb.group({
      selezCliente: [null, Validators.required],
      numeroFattura: [null, Validators.required],
      data: [this.dataOggi, Validators.required],
      anno: [this.annoOggi, Validators.required],
      statoFatt: [null, Validators.required],
      importo: [null, Validators.required],
      agree: [false],
    });
  }
}
