import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Zorro Module */
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, UserOutline, ContactsOutline, UserAddOutline, FileFill, TeamOutline, FileAddOutline, SearchOutline, LoginOutline, LogoutOutline, ProfileOutline, HomeOutline, SafetyCertificateOutline, SnippetsOutline, UserSwitchOutline } from '@ant-design/icons-angular/icons';

/* Componenti */

import { LoginComponent } from './pages/login.component';
import { RegistratiComponent } from './pages/registrati.component';
import { UtentiComponent } from './pages/utenti.component';
import { ClientiComponent } from './pages/clienti.component';
import { FattureComponent } from './pages/fatture.component';
import { ClienteComponent } from './pages/cliente.component';
import { FatturaComponent } from './pages/fattura.component';
import { NuovaFatturaComponent } from './pages/nuova-fattura.component';
import { HomeComponent } from './pages/home.component';
import { InterInterceptor } from './auth/inter.interceptor';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ModificaFatturaComponent } from './pages/modifica-fattura.component';
import { NuovoClienteComponent } from './pages/nuovo-cliente.component';
import { ModificaClienteComponent } from './pages/modifica-cliente.component';
import { RicercaClienteComponent } from './pages/ricerca-cliente.component';
import { RicercaFatturaComponent } from './pages/ricerca-fattura.component';

registerLocaleData(en);

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, UserOutline, ContactsOutline, UserAddOutline, FileFill, TeamOutline, FileAddOutline, SearchOutline, LoginOutline, LogoutOutline, ProfileOutline, HomeOutline, SafetyCertificateOutline, SnippetsOutline, UserSwitchOutline]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistratiComponent,
    UtentiComponent,
    ClientiComponent,
    FattureComponent,
    ClienteComponent,
    FatturaComponent,
    NuovaFatturaComponent,
    HomeComponent,
    ModificaFatturaComponent,
    NuovoClienteComponent,
    ModificaClienteComponent,
    RicercaClienteComponent,
    RicercaFatturaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzTableModule,
    NzDropDownModule,
    NzCardModule,
    NzAvatarModule,
    NzDescriptionsModule,
    NzPaginationModule,
    NzListModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzProgressModule,
    NzPageHeaderModule,
    NzSpinModule,
    NzEmptyModule,
    NzModalModule
  ],
  providers: [{
    provide: NZ_ICONS, useValue: icons
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterInterceptor,
    multi: true
  }, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
