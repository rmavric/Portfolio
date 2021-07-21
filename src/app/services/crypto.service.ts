import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ICryptoDataModel } from '../crypto/models/crypto-data-model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  constructor(private _httpClient: HttpClient) { }

 
  baseUrl = '..............................';

  // get values from database
  getCrypto(): Observable<ICryptoDataModel[]> {
    return this._httpClient.get<ICryptoDataModel[]>(`${this.baseUrl}`).pipe(catchError(this.handleError));;
  }

  // handle error
  private handleError(errorResponse: HttpErrorResponse) {
    //we need to distinguish between server error response and client side error event
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client side error: ', errorResponse.error.message);      // client side or network error
    }
    else {
      console.error('Server side error: ', errorResponse);
    }
    // we need to return user friendly error from the service -> every component that consumes that service should display that error message
    return throwError('There is a problem with the service. Please try again later.');
  };
  
}
