import { Component, OnInit } from '@angular/core';
import { Fattura } from '../models/fattura';
import { ActivatedRoute } from '@angular/router';
import { FattureService } from '../service/fatture.service';

@Component({
  template: `
    <div *ngIf="!loading" class="fattura">
      <nz-card *ngIf="fattura.cliente.nomeContatto && fattura.cliente.cognomeContatto && fattura.cliente.partitaIva" style="width:270px;" [nzCover]="coverTemplate">
        <nz-card-meta nzTitle="{{ fattura.cliente.nomeContatto }} {{ fattura.cliente.cognomeContatto }}" nzDescription="partita IVA: {{ fattura.cliente.partitaIva }}"></nz-card-meta>
      </nz-card>
      <ng-template #coverTemplate>
        <img alt="example" src="https://it.seaicons.com/wp-content/uploads/2015/10/Filetype-Docs-icon.png" />
      </ng-template>

      <div *ngIf="fattura.id && fattura.importo && fattura.anno && fattura.cliente.tipoCliente && fattura.data">
        <nz-descriptions nzTitle="Descrizione Fattura" nzBordered [nzColumn]="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
          <nz-descriptions-item nzTitle="ID Fattura">Tipo Cliente </nz-descriptions-item>
          <nz-descriptions-item nzTitle="Importo">Stato Fattura</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Anno Fattura">Data Inserimento</nz-descriptions-item>
          <nz-descriptions-item nzTitle="{{ fattura.id }}">{{ fattura.cliente.tipoCliente }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="{{ fattura.importo }}">{{ fattura.stato.nome }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="{{ fattura.anno }}">{{ fattura.data }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Cliente Info" *ngIf="fattura.cliente.indirizzoSedeOperativa">
            Indirizzo Sede Legale:
            <br />
            <br />
            {{ fattura.cliente.indirizzoSedeOperativa.via }}, {{ fattura.cliente.indirizzoSedeOperativa.civico }}
            <br />
            CAP: {{ fattura.cliente.indirizzoSedeOperativa.cap }}, {{ fattura.cliente.indirizzoSedeOperativa.localita }}
            <br />
            Comune: {{ fattura.cliente.indirizzoSedeOperativa.comune.nome }}, Provincia: {{ fattura.cliente.indirizzoSedeOperativa.comune.provincia.nome }} ({{
              fattura.cliente.indirizzoSedeOperativa.comune.provincia.sigla
            }})
          </nz-descriptions-item>
        </nz-descriptions>
      </div>
    </div>
  `,
  styles: [
    `
      .fattura {
        display: flex;
        gap: 2em;
      }
    `,
  ],
})
export class FatturaComponent implements OnInit {
  loading: boolean = false;
  fatturaSelectedID!: number;
  fattura!: Fattura;

  constructor(private router: ActivatedRoute, private srvFatture: FattureService) { }

  getStart() {
    this.loading = true;
    this.fatturaSelectedID = this.router.snapshot.params["id"];

    this.srvFatture.getFatturaSingola(this.fatturaSelectedID).subscribe((res) => {
      this.fattura = res;
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.getStart();
  }
}
