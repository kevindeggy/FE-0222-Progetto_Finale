import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  template: `
    <nz-progress *ngIf="loading2" class="progress" [nzPercent]="perc" nzType="circle" [nzWidth]="200" [nzFormat]="formatOne"></nz-progress>
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label class="label" [nzSm]="6" [nzXs]="24" nzRequired nzFor="sort">Ordina per</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il campo!">
          <nz-select class="choise-select" id="sort" formControlName="sort">
            <nz-option nzValue="id" nzLabel="ID Cliente"></nz-option>
            <nz-option nzValue="nomeContatto" nzLabel="Nome Cliente"></nz-option>
            <nz-option nzValue="ragioneSociale" nzLabel="Ragione Sociale Cliente"></nz-option>
            <nz-option nzValue="email" nzLabel="Email Cliente"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary">Ordina</button>
        </nz-form-control>
      </nz-form-item>
    </form>

    <nz-table #nzTable nzNoResult=" " [nzLoading]="loading">
      <thead>
        <tr>
          <th class="primacolonna" nzCustomFilter>
            Nome
            <nz-filter-trigger [(nzVisible)]="visible" [nzActive]="searchValue.length > 0" [nzDropdownMenu]="menu">
              <i nz-icon nzType="search"></i>
            </nz-filter-trigger>
          </th>
          <th>Ragione Sociale</th>
          <th>Email Cliente</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of clientiDisplay">
          <td>{{ data.nomeContatto }}</td>
          <td>{{ data.ragioneSociale }}</td>
          <td>{{ data.email }}</td>
          <td>
            <button nz-button nzType="primary" [routerLink]="['/cliente', data.id]">Dettagli</button>
            <button nz-button nzType="default" [routerLink]="['/cliente/modifica', data.id]">Modifica</button> <button nz-button nzDanger (click)="rimuoviCliente(data.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <nz-pagination [nzPageIndex]="1" [nzPageSize]="20" nzTotal="{{ totaleClienti }}" (nzPageIndexChange)="onPageIndexChange($event)" id="demo" nzShowQuickJumper></nz-pagination>
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
      .progress {
        position: absolute;
        z-index: 10;
        top: 50%;
        left: 50%;
        background-color: white;
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
export class ClientiComponent implements OnInit {
  loading: boolean = false;
  loading2: boolean = false;
  fraseLoading = "";
  formatOne = (): string => this.fraseLoading;
  perc: number = 0;
  totaleClienti!: any;
  clienti: Cliente[] = [];
  clientiDisplay!: Cliente[];
  searchValue = "";
  visible = false;
  validateForm!: FormGroup;
  ricarcaPer: string = "id";
  pagesView: number = 0;

  constructor(private srvClienti: ClientiService, private fb: FormBuilder, private modal: NzModalService) { }

  onPageIndexChange($event: any) {
    this.pagesView = $event;
    this.srvClienti.getClientiSort($event - 1, this.ricarcaPer).subscribe((res) => {
      this.clienti = res.content;
      this.totaleClienti = res.totalElements;
      this.clientiDisplay = [...this.clienti];
    });
  }

  reset(): void {
    this.searchValue = "";
    this.search();
  }

  search(): void {
    this.loading = true;
    this.loading2 = true;
    this.fraseLoading = "ricerca...";
    this.perc = 75;
    this.visible = false;
    if (this.searchValue === "") {
      this.clientiDisplay = this.clienti;
      this.loading = false;
      this.fraseLoading = "fatto!";
      this.perc = 100;
      this.loading2 = false;
    } else {
      this.clientiDisplay = this.clienti.filter((item) => item.nomeContatto === this.searchValue);
      this.loading = false;
      this.fraseLoading = "fatto!";
      this.perc = 100;
      this.loading2 = false;
    }
  }

  rimuoviCliente(id: number) {
    this.modal.warning({
      nzTitle: 'Sei sicuro di eliminare questo Cliente?',
      nzContent: 'Tale processo è irreversibile, e cancellerai tutte le fatture collegato ad esso!',
      nzCancelText: 'Annulla',
      nzOnCancel: () => this.errorTask(),
      nzOnOk: () => this.rimozioneClienteAccettata(id)
    });
  }

  rimozioneClienteAccettata(id: number) {
    this.loading2 = true;
    this.perc = 0;
    this.loading = true;
    this.fraseLoading = "elimino...";
    this.perc = 55;
    this.srvClienti.deleteCliente(id).subscribe(() => {
      this.fraseLoading = "aggiorno...";
      this.perc = 85;
      this.srvClienti.getClientiSort(this.pagesView, this.ricarcaPer).subscribe((res) => {
        this.clienti = res.content;
        this.clientiDisplay = [...this.clienti];
        this.loading = false;
        this.fraseLoading = "fatto!";
        this.perc = 100;
        this.loading2 = false;
      });
    });
  }

  submitForm() {
    this.ricarcaPer = this.validateForm.value.sort;
    this.getstart(this.pagesView, this.ricarcaPer);
  }

  getstart(page: number, sort: string) {
    this.srvClienti.getClientiSort(page, sort).subscribe((res) => {
      this.clienti = res.content;
      this.totaleClienti = res.totalElements;
      this.clientiDisplay = [...this.clienti];
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
      nzContent: 'Cliente eliminato con successo!'
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
