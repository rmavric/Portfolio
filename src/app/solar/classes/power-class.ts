import { PowerData } from '../models/power-data';
import { Time } from '@angular/common';
import { ISolarData } from '../models/solar-data.model';

export class PowerClass {

  private generatedPowerArray: number[] = [];
  private consumedPowerArray: number[] = [];


  private generatedPower: number[] = [];
  private consumedPower: number[] = [];


  private generatedPowerDataArray: PowerData[];
  private consumedPowerDataArray: PowerData[];


  private dateArray: Date[] = [];
  private timeArray: Time[] = [];


  private date: Date[] = [];
  private time: Time[] = [];



  private getGeneratedPowerArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.generatedPowerArray[i] = solarData[i].GeneratedPower;
    }
    return this.generatedPowerArray;
  }

  private getConsumedPowerArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.consumedPowerArray[i] = solarData[i].ConsumedPower;
    }
    return this.consumedPowerArray;
  }



  private getTimeArray(solarData: ISolarData[]): Time[] {
    for (var i = 0; i < solarData.length; i++) {
      this.timeArray[i] = solarData[i].Time;
    }
    return this.timeArray;
  }

  private getDateArray(solarData: ISolarData[]): Date[] {
    for (let i = 0; i < solarData.length; i++) {
      this.dateArray[i] = solarData[i].Date;
    }
    return this.dateArray;
  }



  public getGeneratedPowerDiagramData(solarData: ISolarData[]): PowerData[] {
    this.generatedPowerDataArray = new Array<PowerData>();
    this.generatedPower = this.getGeneratedPowerArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.generatedPower.length; i++) {
      let newItem: PowerData = new PowerData();
      newItem = { Power: this.generatedPower[i], Date: this.date[i], Time: this.time[i] };
      this.generatedPowerDataArray.push(newItem);
    }
    //console.log("Power array has " + this.generatedPowerDataArray.length + " elements");
    return this.generatedPowerDataArray;
  }

  public getConsumedPowerDiagramData(solarData: ISolarData[]): PowerData[] {
    this.consumedPowerDataArray = new Array<PowerData>();
    this.consumedPower = this.getConsumedPowerArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.consumedPower.length; i++) {
      let newItem: PowerData = new PowerData();
      newItem = { Power: this.consumedPower[i], Date: this.date[i], Time: this.time[i] };
      this.consumedPowerDataArray.push(newItem);
    }
    //console.log("Power array has " + this.consumedPowerDataArray.length + " elements");
    return this.consumedPowerDataArray;
  }
}
