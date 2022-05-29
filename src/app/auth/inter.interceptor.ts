import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class InterInterceptor implements HttpInterceptor {
  token: string;
  tenant: string;

  constructor() {
    this.token = environment.adminToken;
    this.tenant = environment.adminTenant;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let newReq = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${this.token}`)
        .set('X-TENANT-ID', this.tenant)
    });
    return next.handle(newReq);
  }
}
