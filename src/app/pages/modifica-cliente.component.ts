import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../models/cliente';
import { ClientiService } from '../service/clienti.service';
import { ComProvService } from '../service/com-prov.service';

@Component({
  template: `
   <form *ngIf="!loading" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <h3>Inserimento Nuovo Cliente:</h3>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="id">ID Cliente</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero valido!">
          <input nz-input type="number" formControlName="id" id="id" readonly/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="ragioneSociale">Ragione Sociale</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero valido!">
          <input nz-input type="text" formControlName="ragioneSociale" id="ragioneSociale" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="partitaIVA" nzTooltipTitle="Inserisci almeno 5 numeri" >Partita IVA</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una partita IVA valida!">
          <input nz-input pattern="^[0-9]+" minlength="3" formControlName="partitaIVA" id="partitaIVA" />
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
          <input nz-input pattern="[a-zA-Z0-9]+@[a-zA-Z]+.(com|edu|net|it|es|uk|gov)" formControlName="email" id="email" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="pec">Pec</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una pec valida!">
          <input nz-input pattern="[a-zA-Z0-9]+@[a-zA-Z]+.(com|edu|net|it|es|uk|gov)" formControlName="pec" id="pec" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="numeroTel" nzTooltipTitle="Inserisci almeno 8 numeri" >Telefono</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero di telefono valido!">
          <input nz-input pattern="^[0-9]+" minlength="8" formControlName="numeroTel" id="numeroTel" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="nomeContatto">Nome Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un nome valido!">
          <input nz-input type="text" formControlName="nomeContatto" id="nomeContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="cognomeContatto">Cognome Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un cognome valido!">
          <input nz-input type="text" formControlName="cognomeContatto" id="cognomeContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="numeroTelContatto" nzTooltipTitle="Inserisci almeno 8 numeri" >Telefono Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire un numero di telefono valido!">
          <input nz-input pattern="^[0-9]+" minlength="8" formControlName="numeroTelContatto" id="numeroTelContatto" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="emailContatto">Email Contatto</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Inserire una email valida!">
          <input nz-input pattern="[a-zA-Z0-9]+@[a-zA-Z]+.(com|edu|net|it|es|uk|gov)" formControlName="emailContatto" id="emailContatto" />
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
          <input nz-input pattern="^[0-9]+" formControlName="capSedeOper" id="capSedeOper" />
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
          <input nz-input pattern="^[0-9]+" formControlName="capSedeLegale" id="capSedeLegale" />
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
          <input nz-input id="dataIns" formControlName="dataIns" readonly/>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="dataUlt" nzRequired nzTooltipTitle="Inserimento automatico, data odierna">
          <span>Data inserimento Cliente</span>
        </nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Data non valida!">
          <input nz-input id="dataUlt" formControlName="dataUlt" readonly/>
        </nz-form-control>
      </nz-form-item>

      <!-- --- -->

      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="6">
          <button [disabled]="validateForm.invalid"] nz-button nzType="primary">Salva Modifiche CLiente</button>
        </nz-form-control>
      </nz-form-item>

    </form>
  `,
  styles: [
  ]
})
export class ModificaClienteComponent implements OnInit {
  clienteSelectedID!: number;
  loading: boolean = false;
  cliente: any | Cliente;
  validateForm!: FormGroup;
  comuniDisp!: any;

  constructor(private router: ActivatedRoute, private srvClienti: ClientiService, private fb: FormBuilder, private srvComuni: ComProvService) { }

  submitForm(): void {
    this.cliente.ragioneSociale = this.validateForm.value.ragioneSociale;
    this.cliente.partitaIva = this.validateForm.value.partitaIVA;
    this.cliente.tipoCliente = this.validateForm.value.tipoCliente;
    this.cliente.email = this.validateForm.value.email;
    this.cliente.pec = this.validateForm.value.pec;
    this.cliente.telefono = this.validateForm.value.numeroTel;
    this.cliente.nomeContatto = this.validateForm.value.nomeContatto;
    this.cliente.cognomeContatto = this.validateForm.value.cognomeContatto;
    this.cliente.telefonoContatto = this.validateForm.value.numeroTelContatto;
    this.cliente.emailContatto = this.validateForm.value.emailContatto;
    this.cliente.indirizzoSedeOperativa.via = this.validateForm.value.viaSedeOper;
    this.cliente.indirizzoSedeOperativa.civico = this.validateForm.value.civicoSedeOper;
    this.cliente.indirizzoSedeOperativa.cap = this.validateForm.value.capSedeOper;
    this.cliente.indirizzoSedeOperativa.localita = this.validateForm.value.localitaSedeOper;
    this.cliente.indirizzoSedeOperativa.comune.id = this.validateForm.value.comuneNomeSedeOper;
    this.cliente.indirizzoSedeLegale.via = this.validateForm.value.viaSedeLegale;
    this.cliente.indirizzoSedeLegale.civico = this.validateForm.value.civicoSedeLegale;
    this.cliente.indirizzoSedeLegale.cap = this.validateForm.value.capSedeLegale;
    this.cliente.indirizzoSedeLegale.localita = this.validateForm.value.localitaSedeLegale;
    this.cliente.indirizzoSedeLegale.comune.id = this.validateForm.value.comuneNomeSedeLegale;

    this.srvClienti.updateCliente(this.cliente).subscribe(() => {
      alert("Cliente modificato!")
    })
  }

  ngOnInit(): void {
    this.srvComuni.getComuni(0).subscribe((res) => {
      this.comuniDisp = res.content;
    })

    this.loading = true;
    this.clienteSelectedID = this.router.snapshot.params["id"];

    this.srvClienti.getClienteSingolo(this.clienteSelectedID).subscribe((res) => {
      this.cliente = res;
      if (res.indirizzoSedeLegale && res.indirizzoSedeOperativa) {
        this.validateForm = this.fb.group({
          id: [this.cliente.id, Validators.required],
          ragioneSociale: [this.cliente.ragioneSociale, Validators.required],
          partitaIVA: [this.cliente.partitaIva, Validators.required],
          tipoCliente: [this.cliente.tipoCliente, Validators.required],
          email: [this.cliente.email, Validators.required],
          pec: [this.cliente.pec, Validators.required],
          numeroTel: [this.cliente.telefono, Validators.required],
          nomeContatto: [this.cliente.nomeContatto, Validators.required],
          cognomeContatto: [this.cliente.cognomeContatto, Validators.required],
          numeroTelContatto: [this.cliente.telefonoContatto, Validators.required],
          emailContatto: [this.cliente.emailContatto, Validators.required],
          viaSedeOper: [this.cliente.indirizzoSedeOperativa.via, Validators.required],
          civicoSedeOper: [this.cliente.indirizzoSedeOperativa.civico, Validators.required],
          capSedeOper: [this.cliente.indirizzoSedeOperativa.cap, Validators.required],
          localitaSedeOper: [this.cliente.indirizzoSedeOperativa.localita, Validators.required],
          comuneNomeSedeOper: [this.cliente.indirizzoSedeOperativa.comune.id, Validators.required],
          viaSedeLegale: [this.cliente.indirizzoSedeLegale.via!, Validators.required],
          civicoSedeLegale: [this.cliente.indirizzoSedeLegale.civico!, Validators.required],
          capSedeLegale: [this.cliente.indirizzoSedeLegale.cap!, Validators.required],
          localitaSedeLegale: [this.cliente.indirizzoSedeLegale.localita!, Validators.required],
          comuneNomeSedeLegale: [this.cliente.indirizzoSedeLegale.comune.id!, Validators.required],
          dataIns: [this.cliente.dataInserimento, Validators.required],
          dataUlt: [this.cliente.dataUltimoContatto, Validators.required]
        })
      } else if (!res.indirizzoSedeLegale && res.indirizzoSedeOperativa) {
        this.validateForm = this.fb.group({
          id: [this.cliente.id, Validators.required],
          ragioneSociale: [this.cliente.ragioneSociale, Validators.required],
          partitaIVA: [this.cliente.partitaIva, Validators.required],
          tipoCliente: [this.cliente.tipoCliente, Validators.required],
          email: [this.cliente.email, Validators.required],
          pec: [this.cliente.pec, Validators.required],
          numeroTel: [this.cliente.telefono, Validators.required],
          nomeContatto: [this.cliente.nomeContatto, Validators.required],
          cognomeContatto: [this.cliente.cognomeContatto, Validators.required],
          numeroTelContatto: [this.cliente.telefonoContatto, Validators.required],
          emailContatto: [this.cliente.emailContatto, Validators.required],
          viaSedeOper: [this.cliente.indirizzoSedeOperativa.via, Validators.required],
          civicoSedeOper: [this.cliente.indirizzoSedeOperativa.civico, Validators.required],
          capSedeOper: [this.cliente.indirizzoSedeOperativa.cap, Validators.required],
          localitaSedeOper: [this.cliente.indirizzoSedeOperativa.localita, Validators.required],
          comuneNomeSedeOper: [this.cliente.indirizzoSedeOperativa.comune.id, Validators.required],
          viaSedeLegale: ['', Validators.required],
          civicoSedeLegale: ['', Validators.required],
          capSedeLegale: ['', Validators.required],
          localitaSedeLegale: ['', Validators.required],
          comuneNomeSedeLegale: ['', Validators.required],
          dataIns: [this.cliente.dataInserimento, Validators.required],
          dataUlt: [this.cliente.dataUltimoContatto, Validators.required]
        })
      } else if (res.indirizzoSedeLegale && !res.indirizzoSedeOperativa) {
        this.validateForm = this.fb.group({
          id: [this.cliente.id, Validators.required],
          ragioneSociale: [this.cliente.ragioneSociale, Validators.required],
          partitaIVA: [this.cliente.partitaIva, Validators.required],
          tipoCliente: [this.cliente.tipoCliente, Validators.required],
          email: [this.cliente.email, Validators.required],
          pec: [this.cliente.pec, Validators.required],
          numeroTel: [this.cliente.telefono, Validators.required],
          nomeContatto: [this.cliente.nomeContatto, Validators.required],
          cognomeContatto: [this.cliente.cognomeContatto, Validators.required],
          numeroTelContatto: [this.cliente.telefonoContatto, Validators.required],
          emailContatto: [this.cliente.emailContatto, Validators.required],
          viaSedeOper: [this.cliente.indirizzoSedeOperativa.via, Validators.required],
          civicoSedeOper: [this.cliente.indirizzoSedeOperativa.civico, Validators.required],
          capSedeOper: [this.cliente.indirizzoSedeOperativa.cap, Validators.required],
          localitaSedeOper: [this.cliente.indirizzoSedeOperativa.localita, Validators.required],
          comuneNomeSedeOper: [this.cliente.indirizzoSedeOperativa.comune.id, Validators.required],
          viaSedeLegale: [this.cliente.indirizzoSedeLegale.via, Validators.required],
          civicoSedeLegale: [this.cliente.indirizzoSedeLegale.civico, Validators.required],
          capSedeLegale: [this.cliente.indirizzoSedeLegale.cap, Validators.required],
          localitaSedeLegale: [this.cliente.indirizzoSedeLegale.localita, Validators.required],
          comuneNomeSedeLegale: [this.cliente.indirizzoSedeLegale.comune.id, Validators.required],
          dataIns: [this.cliente.dataInserimento, Validators.required],
          dataUlt: [this.cliente.dataUltimoContatto, Validators.required]
        })
      } else {
        this.validateForm = this.fb.group({
          id: [this.cliente.id, Validators.required],
          ragioneSociale: [this.cliente.ragioneSociale, Validators.required],
          partitaIVA: [this.cliente.partitaIva, Validators.required],
          tipoCliente: [this.cliente.tipoCliente, Validators.required],
          email: [this.cliente.email, Validators.required],
          pec: [this.cliente.pec, Validators.required],
          numeroTel: [this.cliente.telefono, Validators.required],
          nomeContatto: [this.cliente.nomeContatto, Validators.required],
          cognomeContatto: [this.cliente.cognomeContatto, Validators.required],
          numeroTelContatto: [this.cliente.telefonoContatto, Validators.required],
          emailContatto: [this.cliente.emailContatto, Validators.required],
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
          dataIns: [this.cliente.dataInserimento, Validators.required],
          dataUlt: [this.cliente.dataUltimoContatto, Validators.required]
        })
      }
      this.loading = false;
    })
  }

}
