import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RegistrazioneUser } from '../models/registrazioneUser';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  template: `
    <div class="cont">
      <h2>Registrazione nuovo Utente</h2>
      <form class="login-form" nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="username" nzRequired nzTooltipTitle="What do you want other to call you">
            <span>Username</span>
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input your nickname!">
            <input nz-input id="username" formControlName="username" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="email">E-mail</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="The input is not valid E-mail!">
            <input nz-input formControlName="email" id="email" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="password" nzRequired>Password</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input your password!">
            <input nz-input type="password" id="password" formControlName="password" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="role" nzRequired>Ruolo Utente</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Scelgi il ruolo!">
            <nz-select class="choise.select" id="role" formControlName="role">
              <nz-option nzValue="user" nzLabel="Utente"></nz-option>
              <nz-option nzValue="admin" nzLabel="Amministratore"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item nz-row class="register-area">
          <nz-form-control [nzSpan]="14" [nzOffset]="6">
            <button [disabled]="validateForm.invalid" nz-button nzType="primary">Registrati</button> <br />
            <a routerLink="/login">Se sei già registrato fai il Login adesso!</a>
            <nz-spin class="spin" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
  styles: [
    `
      .cont {
        height: 70vh;
        padding-top: 10em;
        text-align: center;
      }

      .login-form {
        max-width: 400px;
        margin: 0 auto;
      }

      [nz-form] {
        max-width: 600px;
      }

      .phone-select {
        width: 70px;
      }

      .register-are {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class RegistratiComponent implements OnInit {
  loading: boolean = false;
  validateForm!: FormGroup;
  registrazione: RegistrazioneUser = {
    username: "",
    email: "",
    password: "",
    role: [
      {
        roleName: "user",
      },
    ],
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.registrazione.username = this.validateForm.value.username;
      this.registrazione.email = this.validateForm.value.email;
      this.registrazione.password = this.validateForm.value.password;
      this.registrazione.role[0] = this.validateForm.value.role;

      this.srvAuth.register(this.registrazione).subscribe(() => {
        this.loading = false;
        this.successTask(this.validateForm.value.username);
        this.route.navigate(["/login"]);
      },
        (error) => this.errorTask(error))
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: FormBuilder, private srvAuth: AuthService, private route: Router, private modal: NzModalService) { }

  successTask(nome: string): void {
    this.modal.success({
      nzTitle: `${nome} registrato correttamente`,
      nzContent: 'Effettua il Login'
    });
  }

  errorTask(error: any) {
    this.modal.error({
      nzTitle: 'Errore nei campi inseriti oppure Utente già registrato',
      nzContent: 'Controlla i campi inseriti'
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      role: [null, [Validators.required]],
    });
  }
}
