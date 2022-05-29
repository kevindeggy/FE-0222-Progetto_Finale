import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fattura } from '../models/fattura';
import { FattureService } from '../service/fatture.service';

@Component({
  template: `
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <h3>Dettaglio Fattura n. {{ fattura.id }}</h3>
      <p>Data Fattura: <b>{{fattura.data | date:'dd/MM/YYYY'}}</b></p>
      <p>Importo Fattura: <b>{{fattura.importo | currency:'EUR'}}</b></p>
      <br />
      <p>Intestatario Fattura: <b>{{fattura.cliente.nomeContatto}} {{fattura.cliente.cognomeContatto}}</b></p>
      <p>Numero Fattura del Cliente: <b>{{fattura.numero}}</b></p>
      <p>Stato Fattura: {{fattura.stato.nome}}</p>
      <br />
      <p>Cambia Stato Fattura:</p>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="statoFatt" nzRequired>Stato Fattura</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Scelgi stato Fattura!">
          <nz-select class="choise.select" id="statoFatt" formControlName="statoFatt">
            <nz-option nzValue="PAGATA" nzLabel="Pagata"></nz-option>
            <nz-option nzValue="NON PAGATA" nzLabel="Non Pagata"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary">Salva</button>
        </nz-form-control>
      </nz-form-item>

    </form>
  `,
  styles: [
    `
      form {
        text-align: center;
        margin: 0 auto;
      }
      [nz-form] {
        max-width: 600px;
      }

      .choise-select {
        width: 300px;
      }

      .register-are {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class ModificaFatturaComponent implements OnInit {
  fatturaSelectedID!: number;
  loading: boolean = false;
  fattura: any | Fattura = {};
  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.fattura.stato.nome = this.validateForm.value.statoFatt;
      if (this.validateForm.value.statoFatt === 'PAGATA') {
        this.fattura.stato.id = 1;
      } else {
        this.fattura.stato.id = 2;
      }
      this.srvFatture.updateFattura(this.fattura).subscribe(() => alert('Fattura Modificata'));
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else {
      return { confirm: true, error: true };
    }
  };


  constructor(private fb: FormBuilder, private router: ActivatedRoute, private srvFatture: FattureService) { }

  ngOnInit(): void {
    this.loading = true;
    this.fatturaSelectedID = this.router.snapshot.params["id"];

    this.srvFatture.getFatturaSingola(this.fatturaSelectedID).subscribe((res) => {
      this.fattura = res;
      this.validateForm = this.fb.group({
        statoFatt: [res.stato.nome, Validators.required],
        agree: [false],
      });
      this.loading = false;
    });
  }
}
