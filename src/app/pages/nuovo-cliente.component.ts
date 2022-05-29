import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';
import { ComProvService } from '../service/com-prov.service';

interface NuovoCliente {
  ragioneSociale: string,
  partitaIva: number,
  tipoCliente: string,
  email: string,
  pec: string,
  telefono: string,
  nomeContatto: string,
  cognomeContatto: string,
  telefonoContatto: string,
  emailContatto: string,
  indirizzoSedeOperativa: {
    via: string,
    civico: string,
    cap: string,
    localita: string,
    comune: {
      id: 1,
      nome: string,
      provincia: {
        id: 1,
        nome: string,
        sigla: string
      }
    }
  },
  indirizzoSedeLegale: {
    via: string,
    civico: string,
    cap: string,
    localita: string,
    comune: {
      id: 1,
      nome: string,
      provincia: {
        id: 1,
        nome: string,
        sigla: string
      }
    }
  },
  dataInserimento: string,
  dataUltimoContatto: string
}

@Component({
  template: `
    <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <h3>Inserimento Nuovo Cliente:</h3>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="ragioneSociale">Ragione Sociale</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero valido!">
          <input nz-input type="text" formControlName="ragioneSociale" id="ragioneSociale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="partitaIVA" nzTooltipTitle="Inserisci almeno 5 numeri" >Partita IVA</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una partita IVA valida!">
          <input nz-input pattern="^[0-9]+$" minlength="3" maxlength="11" formControlName="partitaIVA" id="partitaIVA" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="tipoCliente" >Tipo Cliente</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un tipo cliente!">
        <nz-select class="choise.select" id="tipoCliente" formControlName="tipoCliente">
            <nz-option nzValue="SRL" nzLabel="SRL"></nz-option>
            <nz-option nzValue="SPA" nzLabel="SPA"></nz-option>
            <nz-option nzValue="SAS" nzLabel="SAS"></nz-option>
            <nz-option nzValue="PA" nzLabel="PA"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="email">Email</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una email valida!">
          <input nz-input pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" formControlName="email" id="email" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="pec">Pec</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una pec valida!">
          <input nz-input pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" formControlName="pec" id="pec" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="numeroTel" nzTooltipTitle="Inserisci almeno 8 numeri" >Telefono</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero di telefono valido!">
          <input nz-input pattern="^((\+91-?)|0)?[0-9]{10}" minlength="8" formControlName="numeroTel" id="numeroTel" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="nomeContatto">Nome Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un nome valido!">
          <input nz-input type="text" pattern="^[A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžÅÆÉØåæéøÉËÏÓÖÜéëïóöüÄÅÖäåöÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸàâæçéèêëïîôœùûüÿÄÖÜẞäöüßÁÉÍÖÓŐÜÚŰáéíöóőüúűÁÆÐÉÍÓÖÞÚÝáæðéíóöþúýÀÈÉÌÒÓÙàèéìòóùÅÆÂÉÈÊØÓÒÔåæâéèêøóòôĄĆĘŁŃÓŚŹŻąćęłńóśźżÃÁÀÂÇÉÊÍÕÓÔÚÜãáàâçéêíõóôúüĂÂÎŞȘŢȚăâîşșţțÁÉÍÑÓÚÜáéíñóúüÄÅÉÖäåéöÂÇĞIİÎÖŞÜÛâçğİîöşüû]+(?: [A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžÅÆÉØåæéøÉËÏÓÖÜéëïóöüÄÅÖäåöÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸàâæçéèêëïîôœùûüÿÄÖÜẞäöüßÁÉÍÖÓŐÜÚŰáéíöóőüúűÁÆÐÉÍÓÖÞÚÝáæðéíóöþúýÀÈÉÌÒÓÙàèéìòóùÅÆÂÉÈÊØÓÒÔåæâéèêøóòôĄĆĘŁŃÓŚŹŻąćęłńóśźżÃÁÀÂÇÉÊÍÕÓÔÚÜãáàâçéêíõóôúüĂÂÎŞȘŢȚăâîşșţțÁÉÍÑÓÚÜáéíñóúüÄÅÉÖäåéöÂÇĞIİÎÖŞÜÛâçğİîöşüû]+)*$" formControlName="nomeContatto" id="nomeContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="cognomeContatto">Cognome Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un cognome valido!">
          <input nz-input type="text" pattern="^[A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžÅÆÉØåæéøÉËÏÓÖÜéëïóöüÄÅÖäåöÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸàâæçéèêëïîôœùûüÿÄÖÜẞäöüßÁÉÍÖÓŐÜÚŰáéíöóőüúűÁÆÐÉÍÓÖÞÚÝáæðéíóöþúýÀÈÉÌÒÓÙàèéìòóùÅÆÂÉÈÊØÓÒÔåæâéèêøóòôĄĆĘŁŃÓŚŹŻąćęłńóśźżÃÁÀÂÇÉÊÍÕÓÔÚÜãáàâçéêíõóôúüĂÂÎŞȘŢȚăâîşșţțÁÉÍÑÓÚÜáéíñóúüÄÅÉÖäåéöÂÇĞIİÎÖŞÜÛâçğİîöşüû]+(?: [A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžÅÆÉØåæéøÉËÏÓÖÜéëïóöüÄÅÖäåöÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸàâæçéèêëïîôœùûüÿÄÖÜẞäöüßÁÉÍÖÓŐÜÚŰáéíöóőüúűÁÆÐÉÍÓÖÞÚÝáæðéíóöþúýÀÈÉÌÒÓÙàèéìòóùÅÆÂÉÈÊØÓÒÔåæâéèêøóòôĄĆĘŁŃÓŚŹŻąćęłńóśźżÃÁÀÂÇÉÊÍÕÓÔÚÜãáàâçéêíõóôúüĂÂÎŞȘŢȚăâîşșţțÁÉÍÑÓÚÜáéíñóúüÄÅÉÖäåéöÂÇĞIİÎÖŞÜÛâçğİîöşüû]+)*$" formControlName="cognomeContatto" id="cognomeContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="numeroTelContatto" nzTooltipTitle="Inserisci almeno 8 numeri" >Telefono Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero di telefono valido!">
          <input nz-input pattern="^((\+91-?)|0)?[0-9]{10}" minlength="8" formControlName="numeroTelContatto" id="numeroTelContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="emailContatto">Email Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una email valida!">
          <input nz-input pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" formControlName="emailContatto" id="emailContatto" />
        </nz-form-control>
      </nz-form-item>

        <p>Indirizzo Sede Operativa</p>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="viaSedeOper">Via</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire la via!">
          <input nz-input type="text" formControlName="viaSedeOper" id="viaSedeOper" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="civicoSedeOper">Civico</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il civico!">
          <input nz-input pattern="^[0-9]+" formControlName="civicoSedeOper" id="civicoSedeOper" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="capSedeOper">CAP</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il CAP!">
          <input nz-input pattern="^[0-9]+" minlength="5" maxlength="5" formControlName="capSedeOper" id="capSedeOper" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="localitaSedeOper">Località</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire la località!">
          <input nz-input type="text" formControlName="localitaSedeOper" id="localitaSedeOper" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="comuneNomeSedeOper" >Comune</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il nome del Comune!">
        <nz-select class="choise.select" id="comuneNomeSedeOper" formControlName="comuneNomeSedeOper">
            <nz-option *ngFor="let item of comuniDisp" [nzValue]="item.id" [nzLabel]="item.nome"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <p>Indirizzo Sede Legale</p>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="viaSedeLegale">Via</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire la via!">
          <input nz-input type="text" formControlName="viaSedeLegale" id="viaSedeLegale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="civicoSedeLegale">Civico</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il civico!">
          <input nz-input pattern="^[0-9]+" formControlName="civicoSedeLegale" id="civicoSedeLegale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="capSedeLegale">CAP</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il CAP!">
          <input nz-input pattern="^[0-9]+" minlength="5" maxlength="5" formControlName="capSedeLegale" id="capSedeLegale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="localitaSedeLegale">Località</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire la località!">
          <input nz-input type="text" formControlName="localitaSedeLegale" id="localitaSedeLegale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="comuneNomeSedeLegale" >Comune</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire il nome del Comune!">
        <nz-select class="choise.select" id="comuneNomeSedeLegale" formControlName="comuneNomeSedeLegale">
          <nz-option *ngFor="let item of comuniDisp" [nzValue]="item.id" [nzLabel]="item.nome"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="dataIns" nzRequired nzTooltipTitle="Inserimento automatico, data odierna">
          <span>Data inserimento Cliente</span>
        </nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Data non valida!">
          <input nz-input id="dataIns" formControlName="dataIns" value="{{dataOggi}}" readonly/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="dataUlt" nzRequired nzTooltipTitle="Inserimento automatico, data odierna">
          <span>Data inserimento Cliente</span>
        </nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Data non valida!">
          <input nz-input id="dataUlt" formControlName="dataUlt" value="{{dataOggi}}" readonly/>
        </nz-form-control>
      </nz-form-item>

      <!-- --- -->

      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button nz-button nzType="primary">Inserisci Nuovo CLiente</button>
        </nz-form-control>
      </nz-form-item>

    </form>
  `,
  styles: [`
h3, p {
  text-align: center;
}
  `]
})
export class NuovoClienteComponent implements OnInit {
  loading = false
  validateForm!: FormGroup;
  dataOggi = new Date().toISOString();
  cliente!: Cliente;
  comuniDisp!: any;
  nuovoCliente: NuovoCliente = {
    ragioneSociale: '',
    partitaIva: 0,
    tipoCliente: '',
    email: '',
    pec: '',
    telefono: '',
    nomeContatto: '',
    cognomeContatto: '',
    telefonoContatto: '',
    emailContatto: '',
    indirizzoSedeOperativa: {
      via: '',
      civico: '',
      cap: '',
      localita: '',
      comune: {
        id: 1,
        nome: '',
        provincia: {
          id: 1,
          nome: '',
          sigla: '',
        }
      }
    },
    indirizzoSedeLegale: {
      via: '',
      civico: '',
      cap: '',
      localita: '',
      comune: {
        id: 1,
        nome: '',
        provincia: {
          id: 1,
          nome: '',
          sigla: '',
        }
      }
    },
    dataInserimento: '',
    dataUltimoContatto: ''
  }

  constructor(private fb: FormBuilder, private srvClienti: ClientiService, private srvComuni: ComProvService) { }

  submitForm() {

    this.nuovoCliente.ragioneSociale = this.validateForm.value.ragioneSociale;
    this.nuovoCliente.partitaIva = this.validateForm.value.partitaIVA;
    this.nuovoCliente.tipoCliente = this.validateForm.value.tipoCliente;
    this.nuovoCliente.email = this.validateForm.value.email;
    this.nuovoCliente.pec = this.validateForm.value.pec;
    this.nuovoCliente.telefono = this.validateForm.value.numeroTel;
    this.nuovoCliente.nomeContatto = this.validateForm.value.nomeContatto;
    this.nuovoCliente.cognomeContatto = this.validateForm.value.cognomeContatto;
    this.nuovoCliente.telefonoContatto = this.validateForm.value.numeroTelContatto;
    this.nuovoCliente.emailContatto = this.validateForm.value.emailContatto;
    this.nuovoCliente.indirizzoSedeOperativa.via = this.validateForm.value.viaSedeOper;
    this.nuovoCliente.indirizzoSedeOperativa.civico = this.validateForm.value.civicoSedeOper;
    this.nuovoCliente.indirizzoSedeOperativa.cap = this.validateForm.value.capSedeOper;
    this.nuovoCliente.indirizzoSedeOperativa.localita = this.validateForm.value.localitaSedeOper;
    this.nuovoCliente.indirizzoSedeOperativa.comune.id = this.validateForm.value.comuneNomeSedeOper;
    this.nuovoCliente.indirizzoSedeLegale.via = this.validateForm.value.viaSedeLegale;
    this.nuovoCliente.indirizzoSedeLegale.civico = this.validateForm.value.civicoSedeLegale;
    this.nuovoCliente.indirizzoSedeLegale.cap = this.validateForm.value.capSedeLegale;
    this.nuovoCliente.indirizzoSedeLegale.localita = this.validateForm.value.localitaSedeLegale;
    this.nuovoCliente.indirizzoSedeLegale.comune.id = this.validateForm.value.comuneNomeSedeLegale;
    this.nuovoCliente.dataInserimento = this.validateForm.value.dataIns;
    this.nuovoCliente.dataUltimoContatto = this.validateForm.value.dataUlt;

    this.srvClienti.newCliente(this.nuovoCliente).subscribe(() => {
      console.log('Nuovo Cliente inserito correttamente!')
      this.validateForm.reset();
    })
  }

  ngOnInit(): void {
    this.srvComuni.getComuni(0).subscribe((res) => {
      this.comuniDisp = res.content;
    })

    this.validateForm = this.fb.group({
      ragioneSociale: ['', Validators.required],
      partitaIVA: ['', Validators.required],
      tipoCliente: ['SRL', Validators.required],
      email: ['', Validators.required],
      pec: ['', Validators.required],
      numeroTel: ['', Validators.required],
      nomeContatto: ['', Validators.required],
      cognomeContatto: ['', Validators.required],
      numeroTelContatto: ['', Validators.required],
      emailContatto: ['', Validators.required],
      viaSedeOper: ['', Validators.required],
      civicoSedeOper: ['', Validators.required],
      capSedeOper: ['', Validators.required],
      localitaSedeOper: ['', Validators.required],
      comuneNomeSedeOper: ['', Validators.required],
      viaSedeLegale: ['', Validators.required],
      civicoSedeLegale: ['', Validators.required],
      capSedeLegale: ['', Validators.required],
      localitaSedeLegale: ['', Validators.required],
      comuneNomeSedeLegale: ['', Validators.required],
      dataIns: [this.dataOggi, Validators.required],
      dataUlt: [this.dataOggi, Validators.required]
    });
  }

}
