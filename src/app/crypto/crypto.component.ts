import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { ICryptoDataModel } from './models/crypto-data-model';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  interval: NodeJS.Timer;

  constructor(private _cryptoService: CryptoService) { }

  cryptoData: any;
  timeNow: Date;
  objectKeys = Object.keys;
  allCryptoData: ICryptoDataModel[] = null;
  errorData: string = "";
  model: ICryptoDataModel;
  currency: string = "BTCEUR"; // default diagram

  ngOnInit() {

    this.interval = setInterval(() => {

      this._cryptoService.getCrypto().subscribe(
        (data) => {
          this.allCryptoData = data;
        },
        (error) => {
          this.errorData = error;
          //console.log(this.errorData);
        }
      );

    }, 1000);
  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }



  setTo (curr: string){
    this.currency = curr;
    //console.log(this.currency);
  }
}