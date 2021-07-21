import { TemperatureData } from '../models/temperature-data';
import { Time } from '@angular/common';
import { ITemperatureData } from '../models/temperature-data.model';

export class TemperatureClass {

    private temperatureArray: number[] = [];

    private temperature: number[] = [];
  
    private temperatureDataArray: TemperatureData[];
  
    private dateArray: Date[] = [];
    private timeArray: Time[] = [];
  
    private date: Date[] = [];
    private time: Time[] = [];
  
    private getTemperatureArray(temperatureData: ITemperatureData[]): number[] {
      for (var i = 0; i < temperatureData.length; i++) {
        this.temperatureArray[i] = temperatureData[i].Temperature;
      }
      return this.temperatureArray;
    }
  
    private getTimeArray(temperatureData: ITemperatureData[]): Time[] {
      for (var i = 0; i < temperatureData.length; i++) {
        this.timeArray[i] = temperatureData[i].Time;
      }
      return this.timeArray;
    }
  
    private getDateArray(temperatureData: ITemperatureData[]): Date[] {
      for (let i = 0; i < temperatureData.length; i++) {
        this.dateArray[i] = temperatureData[i].Date;
      }
      return this.dateArray;
    }
  
    public getTemperatureDiagramData(temperatureData: ITemperatureData[]): TemperatureData[] {
      this.temperatureDataArray = new Array<TemperatureData>();
      this.temperature = this.getTemperatureArray(temperatureData);
      this.date = this.getDateArray(temperatureData);
      this.time = this.getTimeArray(temperatureData);
      for (let i = 0; i < this.temperature.length; i++) {
        let newItem: TemperatureData = new TemperatureData();
        newItem = { Temperature: this.temperature[i], Date: this.date[i], Time: this.time[i] };
        this.temperatureDataArray.push(newItem);
      }
      //console.log("Current array has " + this.generatedCurrentDataArray.length + " elements");
      return this.temperatureDataArray;
    }

}
