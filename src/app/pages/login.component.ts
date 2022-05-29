import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  template: `
    <div class="cont">
      <h2>Effettua il Login</h2>
      <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="submitForm()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username!">
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="username" placeholder="Username" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your Password!">
            <input type="password" nz-input formControlName="password" placeholder="Password" value="" />
          </nz-form-control>
        </nz-form-item>
        <div nz-row class="login-form-margin">
          <button nz-button [disabled]="validateForm.invalid" class="login-form-button login-form-margin" [nzType]="'primary'">Login</button>
          <a routerLink="/registrati">Registrati adesso!</a>
          <nz-spin class="spin" *ngIf="loading" nzSimple [nzSize]="'large'"></nz-spin>
        </div>
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

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }

      .spin {
        font-size: 4em;
        text-align: center;
        margin: auto 0;
        text-shadow: 2px 2px 2px #007fff;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  validateForm!: FormGroup;

  async submitForm() {
    if (this.validateForm.valid) {
      this.loading = true;
      try {
        await this.srvAuth.login(this.validateForm.value).toPromise();
        this.successTask(this.validateForm.value.username);
        this.validateForm.reset();
        setTimeout(() => {
          this.loading = false;
        }, 1500);
        this.route.navigate(["/clienti"]);
      } catch (error) {
        setTimeout(() => {
          this.loading = false;
          this.errorTask()
        }, 1500);
      }
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

  /* Modali */

  successTask(nome: string): void {
    this.modal.success({
      nzTitle: `Benvenuto ${nome}`,
      nzContent: 'Naviga usando la SideNav sulla tua sinistra!'
    });
  }

  errorTask(): void {
    this.modal.error({
      nzTitle: 'Errore nei campi inseriti',
      nzContent: 'Controlla i campi inseriti!'
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }
}
