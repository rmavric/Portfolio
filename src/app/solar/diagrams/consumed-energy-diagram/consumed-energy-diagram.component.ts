import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../canvasjs.min';
import { EnergyData } from '../../models/energy-data';
import { Time } from '@angular/common';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-consumed-energy-diagram',
  templateUrl: './consumed-energy-diagram.component.html',
  styleUrls: ['./consumed-energy-diagram.component.scss']
})
export class ConsumedEnergyDiagramComponent implements OnChanges {

  @Input() allEnergyData: EnergyData[] = new Array<EnergyData>();
  @Input() startDate: Date;
  @Input() endDate: Date;


  ngOnChanges(changes: SimpleChanges) {
    let energyData = new Array<EnergyData>();
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      energyData = change.currentValue;
    }

    let dataPoints = [];


    if ((isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate))) {
      energyData = this.allEnergyData;
      //console.log("dates are not defined");
    }
    else {
      for (let i = 0; i < this.allEnergyData.length; i++) {
        if (this.allEnergyData[i].Date >= this.startDate || this.allEnergyData[i].Date <= this.endDate) {
          energyData.push(this.allEnergyData[i]);
        }
      }
      //console.log("dates are defined");
    }

    // to calculate index of MIN and MAX voltage value in voltageDataArray
    let indexOfMax = energyData.reduce((iMax, x, i, arr) => x.Energy > arr[iMax].Energy ? i : iMax, 0);
    let indexOfMin = energyData.reduce((iMin, x, i, arr) => x.Energy < arr[iMin].Energy ? i : iMin, 0);

    //console.log(indexOfMax);
    //console.log(indexOfMin);
    //console.log(this.energyData.length);

    // for loop that for creating new Date and Time object that is then pushed into dataPoints array
    // dataPoints array is required for ploting on the graph
    for (var i = 0; i < energyData.length; i++) {
      //console.log(this.energyData[i].Energy);
      let date: Date = energyData[i].Date;
      let time: Time = energyData[i].Time;
      let day: number = this.getExactDay(date);
      let month: number = this.getExactMonth(date) - 1;
      let year: number = this.getExactYear(date);
      let hour: number = this.getExactHours(time);
      let minute: number = this.getExactMinutes(time);
      let energyValue: number = energyData[i].Energy;




      // if index is equal to index of MIN voltage value then is necessarry to put marker in the dataPoints array
      if (i == indexOfMin) {

        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: energyValue,
          indexLabel: "LOW", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + energyData[i].Energy
        });
        //console.log("Index of min is: " + i + ", and value is: " + energyValue);
      }
      // if index is equal to index of MAX voltage value then is necessarry to put marker in the dataPoints array
      else if (i == indexOfMax) {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: energyValue,
          indexLabel: "HIGH", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + energyData[i].Energy
        });
        //console.log("Index of max is: " + i + ", and value is: " + energyValue);
      }
      else {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: energyValue, markerType: "circle", markerColor: "#000099", markerSize: 6,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + energyData[i].Energy
        });
      }
    }

    let chart8 = new CanvasJS.Chart("chartContainer8", {
      zoomEnabled: true,
      animationEnabled: true,
      animationDuration: 2000,
      theme: "light1",
      //exportEnabled: true,
      title: {
        text: "E/t  diagram",
        fontFamily: "calibri",
        fontWeight: "bold",
        fontColor: "#323232",
        fontSize: 24,
        padding: {
          top: 2,
          bottom: 2
        }
      },

      axisX: {
        title: "Time [Date]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelAngle: -30,
        labelFontSize: 12,
        labelFontColor: "#000099",
        tickColor: "#000099",
        tickLength: 5,
        tickThickness: 2,
        gridColor: "#787878",
        gridDashType: "dot",
        gridThickness: 2,
        lineColor: "#787878",
        lineThickness: 2,
        crosshair: {
          enabled: true,
          //snapToDataPoint: true,
          thickness: 1,
          lineDashType: "dash",
          labelMaxWidth: 80,
          labelWrap: true,
          labelFormatter: function (e) {
            return CanvasJS.formatDate(e.value, "MMM DD, YYYY hh:mm");
          }
        }
      },

      axisY: {
        title: "Consumption [mWs]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelFontSize: 12,
        labelFontColor: "#000099",
        interlacedColor: "#E6E6E6",
        tickColor: "#000099",
        tickLength: 5,
        tickThickness: 2,
        interval: 1000,
        gridDashType: "dot",
        gridThickness: 2,
        gridColor: "#787878",
        lineColor: "#787878",
        lineThickness: 2
      },


      toolTip: {
        borderColor: "#000099",
        backgroundColor: "white",
        cornerRadius: 8,
        fontSize: 12,
        fontStyle: "comic sans ms",
        fontColor: "#000099"
      },

      data: [
        {
          type: "line",
          lineColor: "#000099",
          lineThickness: 2,
          dataPoints: dataPoints
        }]
    });

    chart8.render();
  }


  // methods required for extracting day, month, year, hour and minutes from voltageData array
  getExactDay(date: Date): number {
    let str: String = date.toString();
    let exactDay: number = parseInt(str.substring(8, 10), 10);
    return exactDay;
  }
  getExactMonth(date: Date): number {
    let str: String = date.toString();
    let exactMonth: number = parseInt(str.substring(5, 7), 10);
    return exactMonth;
  }
  getExactYear(date: Date): number {
    let str: String = date.toString();
    let exactYear: number = parseInt(str.substring(0, 4), 10);
    return exactYear;
  }
  getExactHours(time: Time): number {
    let str: String = time.toString();
    let exactHours: number = parseInt(str.substring(0, 2), 10);
    return exactHours;
  }
  getExactMinutes(time: Time): number {
    let str: String = time.toString();
    let exactMinutes: number = parseInt(str.substring(3, 5), 10);
    return exactMinutes;
  }

  getMinIndex(energyData: EnergyData[]): number {
    let minIndex = 0;
    for (let i = 1; i < energyData.length; i++) {
      if (energyData[i].Energy < energyData[minIndex].Energy) {
        minIndex = i;
      }
    }
    return minIndex;
  }

  getMaxIndex(energyData: EnergyData[]): number {
    let maxIndex = 0;
    for (let i = 1; i < energyData.length; i++) {
      if (energyData[i].Energy > energyData[maxIndex].Energy) {
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  // methods for printing minutes and hours in two digits... for example 02:05 instead of 2:5
  printMinute(minute: number): string {
    return minute < 10 ? "0" + minute.toString() : minute.toString();
  }

  printHour(hour: number): string {
    return hour < 10 ? "0" + hour.toString() : hour.toString();
  }

}