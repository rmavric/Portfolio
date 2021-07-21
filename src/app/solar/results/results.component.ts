import { Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { ISolarData } from '../models/solar-data.model';
import { SolarService } from 'src/app/services/solar.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { VoltageClass } from '../classes/voltage-class';
import { CurrentClass } from '../classes/current-class';
import { PowerClass } from '../classes/power-class';
// import { EnergyClass } from '../classes/energy-class';
import { isNullOrUndefined } from 'util';
import { VoltageData } from '../models/voltage-data';
import { EnergyData } from '../models/energy-data';
import { PowerData } from '../models/power-data';
import { CurrentData } from '../models/current-data';
import { retryWhen, delay, take, concatMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-solar-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [SolarService],
  encapsulation: ViewEncapsulation.None,


  animations: [
    trigger('btnAnimation', [
      state('void', style({ opacity: 0 })),

      transition(':enter, :leave', [
        animate(3000)
      ])
    ])
  ]

})

export class ResultsComponent implements OnInit {

  solarData: ISolarData[];
  errorData: string = "";

  constructor(private _solarService: SolarService) { }

  // variables used as possible starting date for datepickers, when application start working
  //firstStartingDate = new Date(2020, 2, 16);  // months start with 0
  //secondStartingDate = new Date(2020, 2, 16);

  // variables in which datepicker values are stored
  startDatePicker: Date;    // date picked in datepicker
  endDatePicker: Date;      // date picked in datepicker

  // varaibales used for methods that are limiting possible starting and ending datepicker dates
  startDateSubmitted: Date; // date submitted with click on the button
  endDateSubmitted: Date;   // date submitted with click on the button


  minDate = new Date(2020, 6, 14);
  maxDate = new Date(2020, 6, 24);


  generatedVoltageData: VoltageData[] = new Array<VoltageData>();
  consumedVoltageData: VoltageData[] = new Array<VoltageData>();
  generatedCurrentData: CurrentData[] = new Array<CurrentData>();
  consumedCurrentData: CurrentData[] = new Array<CurrentData>();
  generatedPowerData: PowerData[] = new Array<PowerData>();
  consumedPowerData: PowerData[] = new Array<PowerData>();
  // generatedEnergyData: EnergyData[] = new Array<EnergyData>();
  // consumedEnergyData: EnergyData[] = new Array<EnergyData>();
  
  generatedVoltageClass: VoltageClass;
  consumedVoltageClass: VoltageClass;
  generatedCurrentClass: CurrentClass;
  consumedCurrentClass: CurrentClass;
  generatedPowerClass: PowerClass;
  consumedPowerClass: PowerClass;
  // generatedEnergyClass: EnergyClass;
  // consumedEnergyClass: EnergyClass;



  ngOnInit() {
    this.initialization();
    //this._solarService.getAllData().pipe(retryWhen((err) => err.pipe(delay(10), take(1)))).subscribe(
    this._solarService.getAllData().subscribe(
      (data) => {
        this.solarData = data;
        this.generatedVoltageData = this.generatedVoltageClass.getGeneratedVoltageDiagramData(this.solarData);
        this.consumedVoltageData = this.consumedVoltageClass.getConsumedVoltageDiagramData(this.solarData);
        this.generatedCurrentData = this.generatedCurrentClass.getGeneratedCurrentDiagramData(this.solarData);
        this.consumedCurrentData = this.consumedCurrentClass.getConsumedCurrentDiagramData(this.solarData);
        this.generatedPowerData = this.generatedPowerClass.getGeneratedPowerDiagramData(this.solarData);
        this.consumedPowerData = this.consumedPowerClass.getConsumedPowerDiagramData(this.solarData);
        // this.generatedEnergyData = this.generatedEnergyClass.getGeneratedEnergyDiagramData(this.solarData);
        // this.consumedEnergyData = this.consumedEnergyClass.getConsumedEnergyDiagramData(this.solarData);
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



  voltage: VoltageClass = new VoltageClass();
  current: CurrentClass = new CurrentClass();
  power: PowerClass = new PowerClass();
  // energy: EnergyClass = new EnergyClass();

  

  isGeneratedVoltageCollapsed: boolean = false;
  isGeneratedCurrentCollapsed: boolean = false;
  isGeneratedPowerCollapsed: boolean = false;
  // isGeneratedEnergyCollapsed: boolean = false;
  isConsumedVoltageCollapsed: boolean = false;
  isConsumedCurrentCollapsed: boolean = false;
  isConsumedPowerCollapsed: boolean = false;
  // isConsumedEnergyCollapsed: boolean = false;

  get generatedVoltageIndicator() {
    //console.log("State of button is:" + this.isGeneratedVoltageCollapsed);
    return this.isGeneratedVoltageCollapsed ? true : false;
  }

  get consumedVoltageIndicator() {
    return this.isConsumedVoltageCollapsed ? true : false;
  }

  get generatedCurrentIndicator() {
    return this.isGeneratedCurrentCollapsed ? true : false;
  }

  get consumedCurrentIndicator() {
    return this.isConsumedCurrentCollapsed ? true : false;
  }

  get generatedPowerIndicator() {
    return this.isGeneratedPowerCollapsed ? true : false;
  }

  get consumedPowerIndicator() {
    return this.isConsumedPowerCollapsed ? true : false;
  }

  // get generatedEnergyIndicator() {
  //   return this.isGeneratedEnergyCollapsed ? true : false;
  // }

  // get consumedEnergyIndicator() {
  //   return this.isConsumedEnergyCollapsed ? true : false;
  // }

  //---------------------------------------------------------------------------------------------------

  generatedVoltageCollapseButton(panel): void {
    this.isGeneratedVoltageCollapsed = !this.isGeneratedVoltageCollapsed;
    //console.log("State of button is:" + this.isGeneratedVoltageCollapsed);
    this.isGeneratedCurrentCollapsed = false;
    this.isGeneratedPowerCollapsed = false;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = false;
    this.isConsumedCurrentCollapsed = false;
    this.isConsumedPowerCollapsed = false;
    // this.isConsumedEnergyCollapsed = false;
  }

  consumedVoltageCollapseButton(): void {
    this.isGeneratedVoltageCollapsed = false;
    this.isGeneratedCurrentCollapsed = false;
    this.isGeneratedPowerCollapsed = false;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = !this.isConsumedVoltageCollapsed;
    this.isConsumedCurrentCollapsed = false;
    this.isConsumedPowerCollapsed = false;
    // this.isConsumedEnergyCollapsed = false;
  }

  //---------------------------------------------------------------------------------------------------

  generatedCurrentCollapseButton(): void {
    this.isGeneratedVoltageCollapsed = false;
    this.isGeneratedCurrentCollapsed = !this.isGeneratedCurrentCollapsed;
    this.isGeneratedPowerCollapsed = false;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = false;
    this.isConsumedCurrentCollapsed = false;
    this.isConsumedPowerCollapsed = false;
    // this.isConsumedEnergyCollapsed = false;
  }

  consumedCurrentCollapseButton(): void {
    this.isGeneratedVoltageCollapsed = false;
    this.isGeneratedCurrentCollapsed = false;
    this.isGeneratedPowerCollapsed = false;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = false;
    this.isConsumedCurrentCollapsed = !this.isConsumedCurrentCollapsed;
    this.isConsumedPowerCollapsed = false;
    // this.isConsumedEnergyCollapsed = false;
  }

  //---------------------------------------------------------------------------------------------------

  generatedPowerCollapseButton(): void {
    this.isGeneratedVoltageCollapsed = false;
    this.isGeneratedCurrentCollapsed = false;
    this.isGeneratedPowerCollapsed = !this.isGeneratedPowerCollapsed;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = false;
    this.isConsumedCurrentCollapsed = false;
    this.isConsumedPowerCollapsed = false;
    // this.isConsumedEnergyCollapsed = false;
  }

  consumedPowerCollapseButton(): void {
    this.isGeneratedVoltageCollapsed = false;
    this.isGeneratedCurrentCollapsed = false;
    this.isGeneratedPowerCollapsed = false;
    // this.isGeneratedEnergyCollapsed = false;
    this.isConsumedVoltageCollapsed = false;
    this.isConsumedCurrentCollapsed = false;
    this.isConsumedPowerCollapsed = !this.isConsumedPowerCollapsed;
    // this.isConsumedEnergyCollapsed = false;
  }

  //---------------------------------------------------------------------------------------------------

  // generatedEnergyCollapseButton(): void {
  //   this.isGeneratedVoltageCollapsed = false;
  //   this.isGeneratedCurrentCollapsed = false;
  //   this.isGeneratedPowerCollapsed = false;
  //   this.isGeneratedEnergyCollapsed = !this.isGeneratedEnergyCollapsed;
  //   this.isConsumedVoltageCollapsed = false;
  //   this.isConsumedCurrentCollapsed = false;
  //   this.isConsumedPowerCollapsed = false;
  //   this.isConsumedEnergyCollapsed = false;
  // }

  // consumedEnergyCollapseButton(): void {
  //   this.isGeneratedVoltageCollapsed = false;
  //   this.isGeneratedCurrentCollapsed = false;
  //   this.isGeneratedPowerCollapsed = false;
  //   this.isGeneratedEnergyCollapsed = false;
  //   this.isConsumedVoltageCollapsed = false;
  //   this.isConsumedCurrentCollapsed = false;
  //   this.isConsumedPowerCollapsed = false;
  //   this.isConsumedEnergyCollapsed = !this.isConsumedEnergyCollapsed;
  // }


  // variable is set to null because the null state is used for initial state, when the page is first rendered
  areDiagramsDisabled: boolean = null;  
  isButtonDisabled: boolean = true;
  // when pressed the diagram panels are visible, when pressed button will be disabled
  // variables that are tracking changes on datepicker are set to false
  // it closes all opened expansion panels 
  //datesAreSubmitted(panel): void {
  //  this.solarData = new Array<ISolarData>() ;
  //  this._solarService.getDateTwoParam(this.startDatePicker, this.endDatePicker)
  //    .subscribe(data => this.solarData = data);

  //  this.areDiagramsDisabled = false;                                 
  //  this.isButtonDisabled = !this.isButtonDisabled;                   
  //  this.isStartDateValueChanged = false;                              
  //  this.isEndDateValueChanged = false;
  //  console.log("isStartDateValueChanged: " + this.isStartDateValueChanged);
  //  console.log("isEndDateValueChanged: " + this.isEndDateValueChanged);

  //  //this.startDateSubmitted = this.startDatePicker;
  //  //this.endDateSubmitted = this.endDatePicker;
  //  if (this.isButtonDisabled) {
  //   panel.close();
  //  }
  //}

  // datesAreSubmitted(generatedVoltagePanel, consumedVoltagePanel, generatedCurrentPanel, consumedCurrentPanel, generatedPowerPanel, consumedPowerPanel, generatedEnergyPanel, consumedEnergyPanel): void {

  datesAreSubmitted(generatedVoltagePanel, consumedVoltagePanel, generatedCurrentPanel, consumedCurrentPanel, generatedPowerPanel, consumedPowerPanel): void {
    //this.areDiagramsDisabled = false;
    this.isButtonDisabled = !this.isButtonDisabled;
    this.isStartDateValueChanged = false;
    this.isEndDateValueChanged = false;
    //console.log("isStartDateValueChanged: " + this.isStartDateValueChanged);
    //console.log("isEndDateValueChanged: " + this.isEndDateValueChanged);

    this.initialization();
    console.log(this.isButtonDisabled);
    //this.startDateSubmitted = this.startDatePicker;
    //this.endDateSubmitted = this.endDatePicker;
    if (this.isButtonDisabled) {
      generatedVoltagePanel.close();
      consumedVoltagePanel.close();
      generatedCurrentPanel.close();
      consumedCurrentPanel.close();
      generatedPowerPanel.close();
      consumedPowerPanel.close();
      // generatedEnergyPanel.close();
      // consumedEnergyPanel.close();
    }
    
    this._solarService.getDateTwoParam(this.startDatePicker, this.endDatePicker)
      .subscribe((data) => {
        this.solarData = data;
        //console.log("Start date: " + this.startDatePicker);
        //console.log("End date: " + this.endDatePicker);
        this.generatedVoltageData = this.generatedVoltageClass.getGeneratedVoltageDiagramData(this.solarData);
        this.consumedVoltageData = this.voltage.getConsumedVoltageDiagramData(this.solarData);
        this.generatedCurrentData = this.current.getGeneratedCurrentDiagramData(this.solarData);
        this.consumedCurrentData = this.current.getConsumedCurrentDiagramData(this.solarData);
        this.generatedPowerData = this.power.getGeneratedPowerDiagramData(this.solarData);
        this.consumedPowerData = this.power.getConsumedPowerDiagramData(this.solarData);
        // this.generatedEnergyData = this.energy.getGeneratedEnergyDiagramData(this.solarData);
        // this.consumedEnergyData = this.energy.getConsumedEnergyDiagramData(this.solarData);
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
    this.generatedVoltageClass = new VoltageClass();
    this.consumedVoltageClass = new VoltageClass();
    this.generatedCurrentClass = new CurrentClass();
    this.consumedCurrentClass = new CurrentClass();
    this.generatedPowerClass = new PowerClass();
    this.consumedPowerClass = new PowerClass();
    // this.generatedEnergyClass = new EnergyClass();
    // this.consumedEnergyClass = new EnergyClass();
    //this.generatedVoltageData = new Array<VoltageData>();
    //this.consumedVoltageData = new Array<VoltageData>();
    //this.generatedCurrentData = new Array<CurrentData>();
    //this.consumedCurrentData = new Array<CurrentData>();
    //this.generatedPowerData = new Array<PowerData>();
    //this.consumedPowerData = new Array<PowerData>();
    //this.generatedEnergyData = new Array<EnergyData>();
    //this.consumedEnergyData = new Array<EnergyData>();
  }


}