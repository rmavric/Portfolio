import { Time } from '@angular/common';

export interface ITemperatureData {
  Id: number;
  Date: Date;
  Time: Time;
  Humidity: number;
  Temperature: number;
}
