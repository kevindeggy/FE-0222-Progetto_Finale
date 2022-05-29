import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from '../models/authData';
import { RegistrazioneUser } from '../models/registrazioneUser';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  jwtService = new JwtHelperService();
  private authSub = new BehaviorSubject<null | AuthData>(null);
  user$ = this.authSub.asObservable();
  loggedIn$ = this.user$.pipe(map((user) => !!user));

  autoLogoutTime!: any;

  constructor(private http: HttpClient, private route: Router) { }

  login(data: { username: string, password: string }) {
    return this.http.post<AuthData>(`${environment.pathApi}/api/auth/login`, data).pipe(
      tap((data) => {
        this.authSub.next(data);
        this.route.navigate(['/']);
        localStorage.setItem('LoginUser', JSON.stringify(data))
        const exData = this.jwtService.getTokenExpirationDate(data.accessToken) as Date;
        this.autoLogout(exData)
      })
    )
  }

  restoreUser() {
    const userJson = localStorage.getItem('LoginUser')
    if (!userJson) {
      return
    }
    const user: AuthData = JSON.parse(userJson)
    if (this.jwtService.isTokenExpired(user.accessToken)) {
      return
    }
    this.authSub.next(user);
    const exData = this.jwtService.getTokenExpirationDate(user.accessToken) as Date;
    this.autoLogout(exData)
  }

  logout() {
    this.authSub.next(null);
    this.route.navigate(['/login']);
    localStorage.removeItem('LoginUser');
    if (this.autoLogoutTime) {
      clearTimeout(this.autoLogoutTime);
    }
  }

  autoLogout(scadenzaData: Date) {
    const scadenzaSec = scadenzaData.getTime() - new Date().getTime()
    this.autoLogoutTime = setTimeout(() => {
      this.logout()
    }, scadenzaSec);
  }

  register(userNew: RegistrazioneUser) {
    return this.http.post(`${environment.pathApi}/api/auth/signup`, userNew);
  }

}
