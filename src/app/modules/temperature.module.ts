import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemperatureComponent } from '../temperature/temperature.component';
import { ResultsComponent } from '../temperature/results/results.component';
import { TempHumDiagramComponent } from '../temperature/diagrams/temp-hum-diagram/temp-hum-diagram.component';

const angularComponents = [
  TemperatureComponent,
  ResultsComponent,
  TempHumDiagramComponent
];

@NgModule({
  declarations: [
    angularComponents
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    TemperatureComponent
  ]
})
export class TemperatureModule { }
