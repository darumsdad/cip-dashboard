import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NbAuthService } from '@nebular/auth';
import { switchMap, tap } from 'rxjs/operators';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: NbAuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return this.auth.getToken().pipe(
        //tap(), // side effect to set token property on auth service
        switchMap(token => { // use transformation operator that maps to an Observable<T>
          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
  
          return next.handle(newRequest);
        })
      );
    
  }
}