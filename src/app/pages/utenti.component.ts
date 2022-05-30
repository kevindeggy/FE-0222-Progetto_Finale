import { Component, OnInit } from '@angular/core';
import { Utente } from '../models/utente';
import { UtentiService } from '../service/utenti.service';

@Component({
  template: `
   <div style="margin-bottom: 8px;"><button nz-button (click)="change()">Switch ~ {{utentiSwitch}}</button></div>
    <nz-list nzItemLayout="horizontal" [nzLoading]="loading">
      <nz-list-item *ngFor="let item of utenti">
        <nz-list-item-meta
          nzAvatar="https://iconarchive.com/download/i104802/papirus-team/papirus-status/avatar-default.ico"
          nzDescription="ID: {{item.id}} - {{item.cognome}} con Email: {{item.email}}"
        >
          <nz-list-item-meta-title>
            <p>Username: {{item.username}}</p>
          </nz-list-item-meta-title>
        </nz-list-item-meta>
      </nz-list-item>
      <nz-list-empty *ngIf="utenti.length === 0"></nz-list-empty>
    </nz-list>
  `,
  styles: [
  ]
})
export class UtentiComponent implements OnInit {
  utenti: Utente[] = []
  displayUtenti: Utente[] = []
  loading = false;
  utentiSwitch: string = 'Utenti non Amministratori'

  constructor(private srvUtenti: UtentiService) { }

  change(): void {
    this.loading = true;
    if (this.utenti.length !== this.displayUtenti.filter(item => item.roles[0].roleName === 'ROLE_USER').length) {
      console.log(this.utenti.length)
      setTimeout(() => {
        this.utentiSwitch = 'Amministratori'
        this.utenti = this.displayUtenti.filter(item => item.roles[0].roleName === 'ROLE_USER');
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.utentiSwitch = 'Utenti non Amministratori'
        this.utenti = this.displayUtenti.filter((item) => item.roles[0].roleName === 'ROLE_ADMIN' || item.roles[1]?.roleName === 'ROLE_ADMIN');
        this.loading = false;
      }, 1000);
    }
  }

  filtra() {
    this.utenti = this.displayUtenti.filter((item) => item.roles[0].roleName === 'ROLE_ADMIN' || item.roles[1]?.roleName === 'ROLE_ADMIN')
  }

  ngOnInit(): void {
    this.srvUtenti.getUtenti().subscribe((res) => {
      this.displayUtenti = res.content
      this.utenti = [...this.displayUtenti]
      this.filtra()
    })
  }

}
