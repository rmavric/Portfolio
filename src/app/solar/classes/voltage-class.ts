import { VoltageData } from '../models/voltage-data';
import { ISolarData } from '../models/solar-data.model';
import { Time } from '@angular/common';

export class VoltageClass {

  private generatedVoltageArray: number[] = [];
  private consumedVoltageArray: number[] = [];


  private generatedVoltage: number[] = [];
  private consumedVoltage: number[] = [];


  private generatedVoltageDataArray: VoltageData[];
  private consumedVoltageDataArray: VoltageData[];


  private dateArray: Date[] = [];
  private timeArray: Time[] = [];


  private date: Date[] = [];
  private time: Time[] = [];



  private getGeneratedVoltageArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.generatedVoltageArray[i] = solarData[i].GeneratedVoltage;
    }
    return this.generatedVoltageArray;
  }

  private getConsumedVoltageArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.consumedVoltageArray[i] = solarData[i].ConsumedVoltage;
    }
    return this.consumedVoltageArray;
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



  public getGeneratedVoltageDiagramData(solarData: ISolarData[]): VoltageData[] {
    this.generatedVoltageDataArray = new Array<VoltageData>();
    this.generatedVoltage = this.getGeneratedVoltageArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.generatedVoltage.length; i++) {
      let newItem: VoltageData = new VoltageData();
      newItem = { Voltage: this.generatedVoltage[i], Date: this.date[i], Time: this.time[i] };
      this.generatedVoltageDataArray.push(newItem);
    }
    //console.log("Voltage array has " + this.generatedVoltageDataArray.length + " elements");
    return this.generatedVoltageDataArray;
  }

  public getConsumedVoltageDiagramData(solarData: ISolarData[]): VoltageData[] {
    this.consumedVoltageDataArray = new Array<VoltageData>();
    this.consumedVoltage = this.getConsumedVoltageArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.consumedVoltage.length; i++) {
      let newItem: VoltageData = new VoltageData();
      newItem = { Voltage: this.consumedVoltage[i], Date: this.date[i], Time: this.time[i] };
      this.consumedVoltageDataArray.push(newItem);
    }
    //console.log("Voltage array has " + this.consumedVoltageDataArray.length + " elements");
    return this.consumedVoltageDataArray;
  }

}
