import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fattura } from '../models/fattura';
import { FattureService } from '../service/fatture.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  template: `
    <nz-progress *ngIf="loading2" class="progress" [nzPercent]="perc" nzType="circle" [nzWidth]="200" [nzFormat]="formatOne"></nz-progress>
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label class="label" [nzSm]="6" [nzXs]="24" nzRequired nzFor="sort">Ordina per</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il campo!">
          <nz-select class="choise-select" id="sort" formControlName="sort">
            <nz-option nzValue="id" nzLabel="ID Fattura"></nz-option>
            <nz-option nzValue="cliente" nzLabel="Nome Cliente"></nz-option>
            <nz-option nzValue="importo" nzLabel="Importo"></nz-option>
            <nz-option nzValue="anno" nzLabel="Anno"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary">Ordina</button>
        </nz-form-control>
      </nz-form-item>
    </form>

    <nz-table #nzTable nzNoResult=" ">
      <thead>
        <tr>
          <th>Numero Fattura</th>
          <th class="primacolonna" nzCustomFilter>
            Intestatario
            <nz-filter-trigger [(nzVisible)]="visible" [nzActive]="searchValue.length > 0" [nzDropdownMenu]="menu">
              <i nz-icon nzType="search"></i>
            </nz-filter-trigger>
          </th>
          <th>Importo</th>
          <th>Anno</th>
          <th>Stato</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of fattureDisplay">
          <td class="primacolonna">{{ data.id }}</td>
          <td>{{ data.cliente.nomeContatto }}</td>
          <td>{{ data.importo }}</td>
          <td>{{ data.anno }}</td>
          <td>{{ data.stato.nome }}</td>
          <td>
            <button nz-button nzType="primary" [routerLink]="['/fattura', data.id]">Dettagli</button>
            <button nz-button nzType="default" [routerLink]="['/fattura/modifica', data.id]">Modifica</button> <button nz-button nzDanger (click)="rimuoviFatt(data.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <nz-pagination [nzPageIndex]="1" [nzPageSize]="20" nzTotal="{{ totaleFatture }}" (nzPageIndexChange)="onPageIndexChange($event)" id="demo" nzShowQuickJumper></nz-pagination>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <div class="ant-table-filter-dropdown">
        <div class="search-box">
          <input type="text" nz-input placeholder="Search name" [(ngModel)]="searchValue" />
          <button nz-button nzSize="small" nzType="primary" (click)="search()" class="search-button">Ricerca</button>
          <button nz-button nzSize="small" (click)="reset()">Reset</button>
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  styles: [
    `
      .search-box {
        padding: 8px;
      }

      form {
        display: flex;
      }

      .label {
        margin-right: 1.5em;
      }

      .choise-select {
        width: 200px;
      }

      .search-box input {
        width: 188px;
        margin-bottom: 8px;
        display: block;
      }

      .search-box button {
        width: 90px;
      }

      .search-button {
        margin-right: 8px;
      }

      td button {
        margin-right: 5px;
      }
      .primacolonna {
        width: 15%;
      }
    `,
  ],
})
export class FattureComponent implements OnInit {
  loading: boolean = false;
  loading2: boolean = false;
  fraseLoading = "";
  formatOne = (): string => this.fraseLoading;
  perc: number = 0;
  fatture: Fattura[] = [];
  fattureDisplay!: Fattura[];
  searchValue = "";
  visible = false;
  totaleFatture!: any;
  validateForm!: FormGroup;
  ricarcaPer: string = "id";
  pagesView: number = 0;

  constructor(private srvFatt: FattureService, private fb: FormBuilder, private modal: NzModalService) { }

  onPageIndexChange($event: any) {
    this.srvFatt.getFattureSort($event - 1, this.ricarcaPer).subscribe((res) => {
      this.fatture = res.content;
      this.totaleFatture = res.totalElements;
      this.fattureDisplay = [...this.fatture];
    });
  }

  reset(): void {
    this.searchValue = "";
    this.search();
  }

  search(): void {
    this.visible = false;
    if (this.searchValue === "") {
      this.fattureDisplay = this.fatture;
    } else {
      this.fattureDisplay = this.fatture.filter((item) => item.cliente.nomeContatto === this.searchValue);
      if (this.fattureDisplay.length === 0) {
        this.errorTask();
        this.reset();
      }
    }
  }

  rimuoviFatt(id: number) {
    this.modal.warning({
      nzTitle: 'Sei sicuro di eliminare questa Fattura?',
      nzContent: 'Tale processo è irreversibile!',
      nzCancelText: 'Annulla',
      nzOnCancel: () => this.errorTask(),
      nzOnOk: () => this.rimozioneAccettata(id)
    });
  }

  rimozioneAccettata(id: number) {
    this.srvFatt.deleteFattura(id).subscribe(() => {
      this.srvFatt.getFattureSort(this.pagesView, this.ricarcaPer).subscribe((res) => {
        this.fatture = res.content;
        this.totaleFatture = res.totalElements;
        this.fattureDisplay = [...this.fatture];
        this.successTask()
      });
    });
  }

  submitForm() {
    this.ricarcaPer = this.validateForm.value.sort;
    this.getstart(this.pagesView, this.ricarcaPer);
  }

  getstart(page: number, sort: string) {
    this.srvFatt.getFattureSort(page, sort).subscribe((res) => {
      this.fatture = res.content;
      this.totaleFatture = res.totalElements;
      this.fattureDisplay = [...this.fatture];
      this.loading = false;
    });

    this.validateForm = this.fb.group({
      sort: [this.ricarcaPer, Validators.required],
    });
  }

  /* Modali */

  successTask(): void {
    this.modal.success({
      nzTitle: 'Comando eseguito correttamente',
      nzContent: 'Fattura eliminata con successo!'
    });
  }

  errorTask(): void {
    this.modal.error({
      nzTitle: 'Comando non eseguito',
      nzContent: 'Annullo operazione!'
    });
  }

  warningTask(): void {
    this.modal.warning({
      nzTitle: 'Sei sicuro di eliminare questa Fattura?',
      nzContent: 'Tale processo è irreversibile!'
    });
  }

  ngOnInit(): void {
    this.getstart(0, "id");
  }
}
