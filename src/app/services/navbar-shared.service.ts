import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarSharedService {

  constructor() { }

  private pageName = new BehaviorSubject<string>("home");
  currentPage = this.pageName.asObservable();

  changePage(page : string){
    this.pageName.next(page);
    //console.log("Service: " + this.pageName.value);
  }

}
 