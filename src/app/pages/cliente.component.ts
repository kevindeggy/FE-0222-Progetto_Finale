import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';

@Component({
  template: `
    <div *ngIf="!loading" class="cliente">
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
            Indirizzo Sede Operativa:
            <br />
            <br />
            {{ cliente.indirizzoSedeOperativa.via }}, {{ cliente.indirizzoSedeOperativa.civico }}
            <br />
            CAP: {{ cliente.indirizzoSedeOperativa?.cap }}, {{ cliente.indirizzoSedeOperativa.localita }}
            <br />
            Comune: {{ cliente.indirizzoSedeOperativa.comune?.nome }}, Provincia: {{ cliente.indirizzoSedeOperativa.comune.provincia?.nome }} ({{
              cliente.indirizzoSedeOperativa.comune.provincia?.sigla
            }})
          </nz-descriptions-item>
        </nz-descriptions>
      </div>
    </div>
  `,
  styles: [
    `
      .cliente {
        display: flex;
        gap: 2em;
      }
    `,
  ],
})
export class ClienteComponent implements OnInit {
  ClienteSelectedID!: number;
  dataOggi = new Date();
  cliente!: Cliente;
  loading: boolean = false;

  constructor(private router: ActivatedRoute, private srvClienti: ClientiService) { }

  ngOnInit(): void {
    this.loading = true;
    this.ClienteSelectedID = this.router.snapshot.params["id"];

    this.srvClienti.getClienteSingolo(this.ClienteSelectedID).subscribe((res) => {
      this.cliente = res;
      this.loading = false;
    });
  }
}
