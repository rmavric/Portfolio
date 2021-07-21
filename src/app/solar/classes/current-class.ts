import { CurrentData } from '../models/current-data';
import { Time } from '@angular/common';
import { ISolarData } from '../models/solar-data.model';

export class CurrentClass {

  private generatedCurrentArray: number[] = [];
  private consumedCurrentArray: number[] = [];


  private generatedCurrent: number[] = [];
  private consumedCurrent: number[] = [];


  private generatedCurrentDataArray: CurrentData[];
  private consumedCurrentDataArray: CurrentData[];


  private dateArray: Date[] = [];
  private timeArray: Time[] = [];


  private date: Date[] = [];
  private time: Time[] = [];



  private getGeneratedCurrentArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.generatedCurrentArray[i] = solarData[i].GeneratedCurrent;
    }
    return this.generatedCurrentArray;
  }

  private getConsumedCurrentArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.consumedCurrentArray[i] = solarData[i].ConsumedCurrent;
    }
    return this.consumedCurrentArray;
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



  public getGeneratedCurrentDiagramData(solarData: ISolarData[]): CurrentData[] {
    this.generatedCurrentDataArray = new Array<CurrentData>();
    this.generatedCurrent = this.getGeneratedCurrentArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.generatedCurrent.length; i++) {
      let newItem: CurrentData = new CurrentData();
      newItem = { Current: this.generatedCurrent[i], Date: this.date[i], Time: this.time[i] };
      this.generatedCurrentDataArray.push(newItem);
    }
    //console.log("Current array has " + this.generatedCurrentDataArray.length + " elements");
    return this.generatedCurrentDataArray;
  }

  public getConsumedCurrentDiagramData(solarData: ISolarData[]): CurrentData[] {
    this.consumedCurrentDataArray = new Array<CurrentData>();
    this.consumedCurrent = this.getConsumedCurrentArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.consumedCurrent.length; i++) {
      let newItem: CurrentData = new CurrentData();
      newItem = { Current: this.consumedCurrent[i], Date: this.date[i], Time: this.time[i] };
      this.consumedCurrentDataArray.push(newItem);
    }
    //console.log("Current array has " + this.consumedCurrentDataArray.length + " elements");
    return this.consumedCurrentDataArray;
  }

}