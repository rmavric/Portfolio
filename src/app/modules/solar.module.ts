import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResultsComponent } from '../solar/results/results.component';
import { SolarComponent } from '../solar/solar.component';

import { GeneratedVoltageDiagramComponent } from '../solar/diagrams/generated-voltage-diagram/generated-voltage-diagram.component';
import { ConsumedVoltageDiagramComponent } from '../solar/diagrams/consumed-voltage-diagram/consumed-voltage-diagram.component';

import { GeneratedCurrentDiagramComponent } from '../solar/diagrams/generated-current-diagram/generated-current-diagram.component';
import { ConsumedCurrentDiagramComponent } from '../solar/diagrams/consumed-current-diagram/consumed-current-diagram.component';

import { GeneratedPowerDiagramComponent } from '../solar/diagrams/generated-power-diagram/generated-power-diagram.component';
import { ConsumedPowerDiagramComponent } from '../solar/diagrams/consumed-power-diagram/consumed-power-diagram.component';

import { GeneratedEnergyDiagramComponent } from '../solar/diagrams/generated-energy-diagram/generated-energy-diagram.component';
import { ConsumedEnergyDiagramComponent } from '../solar/diagrams/consumed-energy-diagram/consumed-energy-diagram.component';



const angularComponents = [
  ResultsComponent,
  SolarComponent,
  GeneratedVoltageDiagramComponent,
  ConsumedVoltageDiagramComponent,
  GeneratedCurrentDiagramComponent,
  ConsumedCurrentDiagramComponent,
  GeneratedPowerDiagramComponent,
  ConsumedPowerDiagramComponent,
  GeneratedEnergyDiagramComponent,
  ConsumedEnergyDiagramComponent
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
    SolarComponent
  ]
})
export class SolarModule { }