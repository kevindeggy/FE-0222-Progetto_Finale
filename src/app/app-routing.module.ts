import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { LoggedGuard } from './auth/logged.guard';
import { ClienteComponent } from './pages/cliente.component';
import { ClientiComponent } from './pages/clienti.component';
import { FatturaComponent } from './pages/fattura.component';
import { FattureComponent } from './pages/fatture.component';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { ModificaClienteComponent } from './pages/modifica-cliente.component';
import { ModificaFatturaComponent } from './pages/modifica-fattura.component';
import { NuovaFatturaComponent } from './pages/nuova-fattura.component';
import { NuovoClienteComponent } from './pages/nuovo-cliente.component';
import { RegistratiComponent } from './pages/registrati.component';
import { RicercaClienteComponent } from './pages/ricerca-cliente.component';
import { RicercaFatturaComponent } from './pages/ricerca-fattura.component';
import { UtentiComponent } from './pages/utenti.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'registrati',
    component: RegistratiComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'utenti',
    component: UtentiComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'clienti',
    component: ClientiComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cliente/:id',
    component: ClienteComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cliente/modifica/:id',
    component: ModificaClienteComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'ricerca-cliente',
    component: RicercaClienteComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'nuovo-cliente',
    component: NuovoClienteComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'fatture',
    component: FattureComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'fattura/:id',
    component: FatturaComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'fattura/modifica/:id',
    component: ModificaFatturaComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'ricerca-fattura',
    component: RicercaFatturaComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'nuova-fattura',
    component: NuovaFatturaComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
