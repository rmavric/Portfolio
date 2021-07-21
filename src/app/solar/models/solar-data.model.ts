import { Time } from '@angular/common';

export interface ISolarData {
  Id: number;
  Date: Date;
  Time: Time;
  GeneratedVoltage: number;
  GeneratedCurrent: number;
  GeneratedPower: number;
  GeneratedEnergy: number;
  ConsumedVoltage: number;
  ConsumedCurrent: number;
  ConsumedPower: number;
  ConsumedEnergy: number;
}