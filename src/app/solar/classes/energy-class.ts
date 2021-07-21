import { EnergyData } from '../models/energy-data';
import { Time } from '@angular/common';
import { ISolarData } from '../models/solar-data.model';

export class EnergyClass {

  private generatedEnergyArray: number[] = [];
  private consumedEnergyArray: number[] = [];


  private generatedEnergy: number[] = [];
  private consumedEnergy: number[] = [];


  private generatedEnergyDataArray: EnergyData[];
  private consumedEnergyDataArray: EnergyData[];


  private dateArray: Date[] = [];
  private timeArray: Time[] = [];


  private date: Date[] = [];
  private time: Time[] = [];



  getGeneratedEnergyArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.generatedEnergyArray[i] = solarData[i].GeneratedEnergy;
    }
    return this.generatedEnergyArray;
  }

  getConsumedEnergyArray(solarData: ISolarData[]): number[] {
    for (var i = 0; i < solarData.length; i++) {
      this.consumedEnergyArray[i] = solarData[i].ConsumedEnergy;
    }
    return this.consumedEnergyArray;
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



  public getGeneratedEnergyDiagramData(solarData: ISolarData[]): EnergyData[] {
    this.generatedEnergyDataArray = new Array<EnergyData>();
    this.generatedEnergy = this.getGeneratedEnergyArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.generatedEnergy.length; i++) {
      let newItem: EnergyData = new EnergyData();
      newItem = { Energy: this.generatedEnergy[i], Date: this.date[i], Time: this.time[i] };
      this.generatedEnergyDataArray.push(newItem);
    }
    //console.log("Consumption array has " + this.generatedEnergyDataArray.length + " elements");
    return this.generatedEnergyDataArray;
  }

  public getConsumedEnergyDiagramData(solarData: ISolarData[]): EnergyData[] {
    this.consumedEnergyDataArray = new Array<EnergyData>();
    this.consumedEnergy = this.getConsumedEnergyArray(solarData);
    this.date = this.getDateArray(solarData);
    this.time = this.getTimeArray(solarData);
    for (let i = 0; i < this.consumedEnergy.length; i++) {
      let newItem: EnergyData = new EnergyData();
      newItem = { Energy: this.consumedEnergy[i], Date: this.date[i], Time: this.time[i] };
      this.consumedEnergyDataArray.push(newItem);
    }
    //console.log("Consumption array has " + this.consumedEnergyDataArray.length + " elements");
    return this.consumedEnergyDataArray;
  }

}
