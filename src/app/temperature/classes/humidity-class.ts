import { HumidityData } from '../models/humidity-data';
import { Time } from '@angular/common';
import { ITemperatureData } from '../models/temperature-data.model';

export class HumidityClass {

  private humidityArray: number[] = [];

  private humidity: number[] = [];

  private humidityDataArray: HumidityData[];

  private dateArray: Date[] = [];
  private timeArray: Time[] = [];

  private date: Date[] = [];
  private time: Time[] = [];

  private getHumidityArray(temperatureData: ITemperatureData[]): number[] {
    for (var i = 0; i < temperatureData.length; i++) {
      this.humidityArray[i] = temperatureData[i].Humidity;
    }
    return this.humidityArray;
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

  public getHumidityDiagramData(temperatureData: ITemperatureData[]): HumidityData[] {
    this.humidityDataArray = new Array<HumidityData>();
    this.humidity = this.getHumidityArray(temperatureData);
    this.date = this.getDateArray(temperatureData);
    this.time = this.getTimeArray(temperatureData);
    for (let i = 0; i < this.humidity.length; i++) {
      let newItem: HumidityData = new HumidityData();
      newItem = { Humidity: this.humidity[i], Date: this.date[i], Time: this.time[i] };
      this.humidityDataArray.push(newItem);
    }
    //console.log("Current array has " + this.generatedCurrentDataArray.length + " elements");
    return this.humidityDataArray;
  }

}



