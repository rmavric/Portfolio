import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CryptoComponent } from '../crypto/crypto.component';
import { CryptoDiagramComponent } from '../crypto/crypto-diagram/crypto-diagram.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

const angularComponents = [
   CryptoComponent,
   CryptoDiagramComponent
];

@NgModule({
  declarations: [angularComponents],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    FlexLayoutModule
  ]
})
export class CryptoModule { }
