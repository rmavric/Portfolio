import { Component, AfterViewInit, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { ICoordinatesModel } from '../models/coordinates-model.model';
import { DatePipe } from '@angular/common';
import { Coordinate } from '../models/coordinate';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [15, 31],
  iconAnchor: [6, 31],
  popupAnchor: [1, -34],
  tooltipAnchor: [10, -20],
  shadowSize: [31, 31]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [DatePipe]
})
export class MapComponent implements AfterViewInit, OnInit, OnChanges {
  private map;

  @Input() coords: ICoordinatesModel[] = new Array<ICoordinatesModel>();

  coordinates : ICoordinatesModel[] = new Array<ICoordinatesModel>();

  time: String;
  date: String;
  c: Coordinate;
  polylinePoints: any = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    
  }

   private initMap(): void{
     this.map = L.map('map').setView([46.3057, 16.3366], 11);
     const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
  }

  ngOnInit(){
    setTimeout(()=>{

      
      this.c = new Coordinate();

      if(this.coords.length!=0){
        for(let i = 0; i < this.coords.length; i++){
          const lat = this.coords[i].coordinate.latitude;
          const lng = this.coords[i].coordinate.longitude;
          this.time = this.coords[i].time.toString();
          this.date = this.coords[i].date.toString(); 
 
          this.polylinePoints.push([lat, lng]);
        }
  
        var polyline = L.polyline(this.polylinePoints, {color: 'red'});
        polyline.addTo(this.map); 
        this.map.fitBounds(polyline.getBounds());

      }
      
    }, 2000);
    
    
  }


  ngOnChanges(changes: SimpleChanges) {

    var currentData = new Array<ICoordinatesModel>();
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      currentData = change.currentValue;
    }
    setTimeout(()=>{


      this.map.remove();
      this.polylinePoints = [];
      this.initMap(); //reload the map function
      
      this.c = new Coordinate();

      if(currentData.length!=0){
        for(let i = 0; i < currentData.length; i++){
          const lat = currentData[i].coordinate.latitude;
          const lng = currentData[i].coordinate.longitude;
          this.time = currentData[i].time.toString();
          this.date = currentData[i].date.toString(); 

          this.polylinePoints.push([lat, lng]);
        }
  
        var polyline = L.polyline(this.polylinePoints, {color: 'red'});
        polyline.addTo(this.map); 
        this.map.fitBounds(polyline.getBounds());

      }
      
    }, 2000);
    
      
  }

}
