import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { ICoordinatesModel } from '../gps/models/coordinates-model.model';

@Injectable({
  providedIn: 'root'
})
export class GpsTrackerService {

  constructor(private _httpClient: HttpClient) { }

 
  baseUrl = '..............................';

  // get values from database
  getCoordinates(whichvoyage : string): Observable<ICoordinatesModel[]> {
    return this._httpClient.get<ICoordinatesModel[]>('..............................'+whichvoyage).pipe(delay(1000),catchError(this.handleError));
  }

  getAllCoordinates(): Observable<ICoordinatesModel[]> {
    return this._httpClient.get<ICoordinatesModel[]>(`${this.baseUrl}`).pipe(delay(1000),catchError(this.handleError));
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
