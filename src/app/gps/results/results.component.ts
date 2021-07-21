import { Component, OnInit } from '@angular/core';
import { ICoordinatesModel } from '../models/coordinates-model.model';
import { Coordinate } from '../models/coordinate';
import { HttpClient } from '@angular/common/http';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Time } from '@angular/common';
import { GpsTrackerService } from 'src/app/services/gps-tracker.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  errorData: string = "";

  ride: string = "";

  interval: NodeJS.Timer;

  constructor(private _gpsTrackerServiceService: GpsTrackerService) { }

  //this is only one coordinate
  coordinate : Coordinate = new Coordinate;

  //here are stored all coordinates, with their latitude, longitude, and date
  coordinates : ICoordinatesModel[] = new Array<ICoordinatesModel>();  

  ngOnInit() {
    setTimeout(()=>{
      //getCoordinates("first")
      //getAllCoordinates()
      this.ride = "";
      //console.log("ng on init: " + this.ride)
      if(this.ride.length!=0){
        this._gpsTrackerServiceService.getCoordinates(this.ride).subscribe(
          (data) => {
            this.coordinates = data;
            //console.log("No of data:" + this.coordinates.length); 
          },
          (error) => { this.errorData = error; }
        );
      }
    
    }, 1000);

  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  setTo (ride: string){
    setTimeout(()=>{
    this.ride = ride;
    //console.log("setTo: " + this.ride);
    if(this.ride.length!=0){
      this._gpsTrackerServiceService.getCoordinates(this.ride).subscribe(
        (data) => {
          this.coordinates = data;
          //console.log("No of data:" + this.coordinates.length); 
        },
        (error) => { this.errorData = error; }
      );
    }
  
  }, 1000);
  }

  
}
             