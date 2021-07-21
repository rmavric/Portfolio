import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ISolarData } from '../solar/models/solar-data.model';
import { delay } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SolarService {

  constructor(private _httpClient: HttpClient) { }

  baseUrl = '..............................';


  getAllData(): Observable<ISolarData[]> {
    return this._httpClient.get<ISolarData[]>(`${this.baseUrl}`).pipe(catchError(this.handleError));
  }

  getDateTwoParam(startDate: Date, endDate: Date): Observable<ISolarData[]> {
    var startIsoDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString();
    var endIsoDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString();

      return this._httpClient.get<ISolarData[]>('..............................?startDate='
      + startIsoDate.slice(0, 10) + '&endDate=' + endIsoDate.slice(0, 10)).pipe(delay(1000), catchError(this.handleError));
  }


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
  }

}