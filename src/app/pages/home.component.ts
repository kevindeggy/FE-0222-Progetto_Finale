import { Component, OnInit } from '@angular/core';
import { ClientiService } from '../service/clienti.service';
import { FattureService } from '../service/fatture.service';
import { UtentiService } from '../service/utenti.service';

@Component({
  template: `
    <nz-page-header class="site-page-header">
      <nz-page-header-title>Benvenuti nel CRM di Kevin De Girolamo</nz-page-header-title>

      <nz-page-header-subtitle>Agile CRM</nz-page-header-subtitle>

      <nz-page-header-content>
        <div nz-row>
          <div class="content">
            <p nz-paragraph>Diamo uno sguardo ai nostri numeri. Ricordo che bisogna essere loggati per visualizzare tutti i dettagli dei dati!</p>
            <p nz-paragraph>Tutte le informazioni qui presenti sono consultabili nella sidebar a sinistra solo se è stato effettuato l'accesso!</p>
          </div>
          <div class="content-image">
            <img src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg" alt="content" />
          </div>
        </div>

        <div class="cardNum">
          <nz-card style="width:250px;" [nzCover]="coverTemplate" [nzActions]="[actionSetting]" [nzLoading]="loading">
            <nz-card-meta nzTitle="Numero Clienti" nzDescription="This is the description"></nz-card-meta>
          </nz-card>
          <ng-template #coverTemplate>
            <nz-spin class="titleCard" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
            <h2 *ngIf="!loading" class="titleCard">{{ numClienti }}</h2>
          </ng-template>
          <ng-template #actionSetting>
            <i nz-icon nzType="fund-view"></i>
            <label routerLink="/clienti">Apri</label>
          </ng-template>

          <nz-card style="width:250px;" [nzCover]="coverTemplate2" [nzActions]="[actionSetting2]" [nzLoading]="loading">
            <nz-card-meta nzTitle="Numero Fatture" nzDescription="This is the description"></nz-card-meta>
          </nz-card>
          <ng-template #coverTemplate2>
            <nz-spin class="titleCard" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
            <h2 *ngIf="!loading" class="titleCard">{{ numFatture }}</h2>
          </ng-template>
          <ng-template #actionSetting2>
            <i nz-icon nzType="fund-view"></i>
            <label routerLink="/fatture">Apri</label>
          </ng-template>

          <nz-card style="width:250px;" [nzCover]="coverTemplate3" [nzActions]="[actionSetting3]" [nzLoading]="loading">
            <nz-card-meta nzTitle="Numero Utenti registrati" nzDescription="This is the description"></nz-card-meta>
          </nz-card>
          <ng-template #coverTemplate3>
            <nz-spin class="titleCard" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
            <h2 *ngIf="!loading" class="titleCard">{{ numUtenti }}</h2>
          </ng-template>
          <ng-template #actionSetting3>
            <i nz-icon nzType="fund-view"></i>
            <label routerLink="/utenti">Apri</label>
          </ng-template>

          <nz-card style="width:250px;" [nzCover]="coverTemplate4" [nzLoading]="loading">
            <nz-card-meta nzTitle="Fatturato Annuo" nzDescription="This is the description"></nz-card-meta>
          </nz-card>
          <ng-template #coverTemplate4>
            <nz-spin class="titleCard" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
            <h2 *ngIf="!loading" class="titleCard">{{ fatturato }}</h2>
          </ng-template>
        </div>
      </nz-page-header-content>
    </nz-page-header>
  `,
  styles: [
    `
      .site-page-header {
        height: 70vh;
      }

      .cardNum {
        display: flex;
        gap: 1em;
        margin-top: 1em;
        justify-content: center;
      }

      [nz-button] {
        margin-right: 8px;
        margin-bottom: 12px;
      }

      .titleCard {
        font-size: 4em;
        text-align: center;
        margin: auto 0;
        text-shadow: 2px 2px 2px #007fff;
      }

      .content {
        flex: 1;
      }

      .content p {
        margin-bottom: 1em;
      }

      .content-link a {
        margin-right: 16px;
      }

      .content-link a img {
        margin-right: 8px;
      }

      .content-image {
        margin: 0 0 0 60px;
        display: flex;
        align-items: center;
      }

      .content-image img {
        width: 100%;
      }

      @media (max-width: 768px) {
        .content-image {
          flex: 100%;
          margin: 24px 0 0;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  numClienti: number = 200;
  numFatture: number = 300;
  numUtenti: number = 20;
  fatturato = "3Milioni€";

  constructor(private srvClienti: ClientiService, private srvFatture: FattureService, private srvUtenti: UtentiService) { }

  ngOnInit(): void {
    this.loading = true;

    this.srvClienti.getAllClienti().subscribe((res) => {
      this.numClienti = res.totalElements;
      this.srvFatture.getFatture(0).subscribe((res) => {
        this.numFatture = res.totalElements;
        this.srvUtenti.getUtenti().subscribe((res) => {
          this.numUtenti = res.totalElements;
          this.loading = false;
        });
      });
    });
  }
}
