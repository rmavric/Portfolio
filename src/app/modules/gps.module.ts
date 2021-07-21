import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpsComponent } from '../gps/gps.component';
import { ResultsComponent } from '../gps/results/results.component';
import { AgmCoreModule } from '@agm/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../gps/map/map.component';
import { FlexLayoutModule } from '@angular/flex-layout';



const angularComponents = [
  GpsComponent,
  ResultsComponent,
  MapComponent
];

@NgModule({
  declarations: [angularComponents],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAI2wrhkSBWDhpJHOfLUk7dFlwlok0R9h8'
    }), 
    FlexLayoutModule
  ],
  exports: [
    GpsComponent
  ]
})
export class GpsModule { }
