import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
  <nz-layout>
  <nz-header>
      <div class="logo"><img src="https://cdn.ciroapp.com/wp-content/uploads/2021/06/Agile-CRM-logo.png?strip=all&lossy=1&fit=480%2C150&ssl=1" alt="logo-crm"></div>
      <ul nz-menu nzTheme="dark" nzMode="horizontal" class="header-menu" [nzSelectable]>
          <li nz-menu-item routerLink="/">Home <i nz-icon nzType="home" nzTheme="outline"></i></li>
          <li *ngIf="!login" nz-menu-item routerLink="/login">Login <i nz-icon nzType="login" nzTheme="outline"></i></li>
          <li *ngIf="!login" nz-menu-item routerLink="/registrati">Registrati <i nz-icon nzType="profile" nzTheme="outline"></i></li>
          <li *ngIf="login" (click)="logout()" nz-menu-item>Logout <i nz-icon nzType="logout" nzTheme="outline"></i></li>
      </ul>
  </nz-header>
  <nz-layout>
      <nz-sider *ngIf="login" nzWidth="200px" nzTheme="light">
          <ul nz-menu nzMode="inline" class="sider-menu">
              <li nz-submenu nzOpen nzIcon="team" nzTitle="Utenti">
                  <ul>
                      <li nz-menu-item routerLink="/utenti"><i nz-icon nzType="user" nzTheme="outline"></i>Tutti gli Utenti</li>
                  </ul>
              </li>
              <li nz-submenu nzOpen nzIcon="contacts" nzTitle="Clienti">
                  <ul>
                      <li nz-menu-item routerLink="/clienti"><i nz-icon nzType="user-switch" nzTheme="outline"></i> Tutti i Clienti</li>
                      <li nz-menu-item routerLink="/ricerca-cliente"><i nz-icon nzType="search" nzTheme="outline"></i> Ricerca Cliente</li>
                      <li nz-menu-item routerLink="/nuovo-cliente"><i nz-icon nzType="user-add" nzTheme="outline"></i> Nuovo Cliente</li>
                  </ul>
              </li>
              <li nz-submenu nzOpen nzIcon="file" nzTitle="Fatture">
                  <ul>
                      <li nz-menu-item routerLink="/fatture"><i nz-icon nzType="snippets" nzTheme="outline"></i> Tutte le Fatture</li>
                      <li nz-menu-item routerLink="/ricerca-fattura" nzIcon="file"><i nz-icon nzType="search" nzTheme="outline"></i> Ricerca Fattura</li>
                      <li nz-menu-item routerLink="/nuova-fattura"><i nz-icon nzType="file-add" nzTheme="outline"></i> Nuova Fattura</li>
                  </ul>
              </li>
          </ul>
      </nz-sider>
      <nz-layout class="inner-layout">
          <nz-content>
              <router-outlet></router-outlet>
          </nz-content>
      </nz-layout>
  </nz-layout>
</nz-layout>`,

  styles: [`
  .logo {
    width: 120px;
    height: 21px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 30px 16px 0;
    float: left;
    border-radius: 10px;
}

.logo img {
    max-width: 120px;
    height: auto;
    margin-bottom: 35px;
    border-radius: 10px;
}

.header-menu {
    line-height: 64px;
}

.sider-menu {
    height: 100%;
    border-right: 0;
}

.inner-layout {
    padding: 0 24px 24px;
}

nz-content {
    background: #fff;
    padding: 24px;
    min-height: 280px;
    margin-top: 16px;
}
`]
})
export class AppComponent {
  login: boolean = false;

  constructor(private srvAuth: AuthService) { }

  isCollapsed = false;

  logout() {
    this.srvAuth.logout();
  }

  ngOnInit(): void {
    this.srvAuth.restoreUser();
    this.srvAuth.loggedIn$.subscribe((log) => {
      this.login = log;
    })
  }
}
