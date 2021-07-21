import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TemperatureService } from 'src/app/services/temperature.service';
import { ITemperatureData } from '../models/temperature-data.model';
import { isNullOrUndefined } from 'util';
import { HumidityData } from '../models/humidity-data';
import { TemperatureData } from '../models/temperature-data';
import { HumidityClass } from '../classes/humidity-class';
import { TemperatureClass } from '../classes/temperature-class';
import { trigger, state, style, animate, transition } from '@angular/animations';



@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [TemperatureService],
  encapsulation: ViewEncapsulation.None,

  animations: [
    trigger('btnAnimation', [
      state('void', style({ opacity: 0 })),

      transition(':enter, :leave', [
        animate(2000)
      ])
    ])
  ]

})


export class ResultsComponent implements OnInit {

  constructor(private _temperatureService : TemperatureService) { }

  temperatureData: ITemperatureData[];
  errorData: string = "";

  // variables used as possible starting date for datepickers, when application start working
  //firstStartingDate = new Date(2020, 2, 16);  // months start with 0
  //secondStartingDate = new Date(2020, 2, 16);

  // variables in which datepicker values are stored
  startDatePicker: Date;    // date picked in datepicker
  endDatePicker: Date;      // date picked in datepicker

  // varaibales used for methods that are limiting possible starting and ending datepicker dates
  startDateSubmitted: Date; // date submitted with click on the button
  endDateSubmitted: Date;   // date submitted with click on the button

  minDate = new Date(2020, 6, 12);
  maxDate = new Date(2020, 6, 25);

  


  humData: HumidityData[] = new Array<HumidityData>();
  tempData: TemperatureData[] = new Array<TemperatureData>();
  
  humClass: HumidityClass;
  tempClass: TemperatureClass;


  ngOnInit() {
    this.initialization();
    this._temperatureService.getAllData().subscribe(
      (data) => {
        this.temperatureData = data;
        this.humData = this.humClass.getHumidityDiagramData(this.temperatureData);
        this.tempData = this.tempClass.getTemperatureDiagramData(this.temperatureData);
      },
      (error) => { this.errorData = error; }        //ako ne bude radilo onda ovo samo obrisati i krenuti ispočetka, tutorijali 66 i 67 od Venkata, Angular CRUD
    );
  }

  
  // this method filters which dates can be picked on left datePicker
  // if endDate is not yet defined (if date on the right datepicker is not yet chosen) then end with the max date
  // but if it is chosen then end with the day before 
  dateFilterStartDatePicker = date => {
    return isNullOrUndefined(this.endDatePicker) ? (date >= this.minDate && date < this.maxDate) : (date >= this.minDate && date < this.endDatePicker);
  }

  // this method filters which dates can be picked on right datePicker
  // if startDate is not yet defined (if date on the left datepicker is not yet chosen) then start with the min date
  // but if it is chosen then start with the day after 
  dateFilterEndDatePicker = date => {
    return isNullOrUndefined(this.startDatePicker) ? (date > this.minDate && date <= this.maxDate) : (date > this.startDatePicker && date <= this.maxDate) ;
  }


  areDiagramsDisabled: boolean = null;  
  isButtonDisabled: boolean = true;
  showTempAndHumDiagram: boolean = false;


  datesAreSubmitted(): void {
    //this.areDiagramsDisabled = false;
    this.isButtonDisabled = !this.isButtonDisabled;
    this.isStartDateValueChanged = false;
    this.isEndDateValueChanged = false;
    this.showTempAndHumDiagram = true;
    //console.log("isStartDateValueChanged: " + this.isStartDateValueChanged);
    //console.log("isEndDateValueChanged: " + this.isEndDateValueChanged);

    this.initialization();
    console.log(this.isButtonDisabled);
    //this.startDateSubmitted = this.startDatePicker;
    //this.endDateSubmitted = this.endDatePicker;
 
    
    this._temperatureService.getDateTwoParam(this.startDatePicker, this.endDatePicker)
      .subscribe((data) => {
        this.temperatureData = data;
        //console.log("Start date: " + this.startDatePicker);
        //console.log("End date: " + this.endDatePicker);
        this.humData = this.humClass.getHumidityDiagramData(this.temperatureData);
        this.tempData = this.tempClass.getTemperatureDiagramData(this.temperatureData);
      },
        (error) => { this.errorData = error; }
      );
  }

  // variable are set to null because the null state is used for initial state, when the page is first rendered
  isStartDateValueChanged: boolean = null;
  isEndDateValueChanged: boolean = null;

  // detects change on matDatePicker like event, stores this event in new variable
  // variable that detects change is set from null to true in first iteration or from false to null in other iterations
  // button is now enabled because new time interval can be submitted
  detectStartDateChange(event): void {
    //console.log('startDate changed', this.startDatePicker, event);
    this.startDatePicker = event;
    this.isStartDateValueChanged = true;
    this.isButtonDisabled = false;
    //console.log("isStartDateValueChanged: " + this.isStartDateValueChanged);
  }

  detectEndDateChange(event): void {
    //console.log('endDate changed', this.endDatePicker, event);
    this.endDatePicker = event;
    this.isEndDateValueChanged = true;
    this.isButtonDisabled = false;
    //console.log("isEndDateValueChanged: " + this.isEndDateValueChanged);
  }

  initialization(): void {
    this.humClass = new HumidityClass();
    this.tempClass = new TemperatureClass();
  }

}
