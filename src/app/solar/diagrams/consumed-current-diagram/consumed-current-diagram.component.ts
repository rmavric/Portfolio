import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../canvasjs.min';
import { CurrentData } from '../../models/current-data';
import { Time } from '@angular/common';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-consumed-current-diagram',
  templateUrl: './consumed-current-diagram.component.html',
  styleUrls: ['./consumed-current-diagram.component.scss']
})
export class ConsumedCurrentDiagramComponent implements OnChanges {

  @Input() allCurrentData: CurrentData[] = new Array<CurrentData>();
  @Input() startDate: Date;
  @Input() endDate: Date;



  ngOnChanges(changes: SimpleChanges) {
    let currentData = new Array<CurrentData>();
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      currentData = change.currentValue;
    }

    let dataPoints = [];


    if ((isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate))) {
      currentData = this.allCurrentData;
      //console.log("dates are not defined");
    }
    else {
      for (let i = 0; i < this.allCurrentData.length; i++) {
        if (this.allCurrentData[i].Date >= this.startDate || this.allCurrentData[i].Date <= this.endDate) {
          currentData.push(this.allCurrentData[i]);
        }
      }
      //console.log("dates are defined");
    }


    // to calculate index of MIN and MAX voltage value in voltageDataArray
    let indexOfMax = currentData.reduce((iMax, x, i, arr) => x.Current > arr[iMax].Current ? i : iMax, 0);
    let indexOfMin = currentData.reduce((iMin, x, i, arr) => x.Current < arr[iMin].Current ? i : iMin, 0);

    //console.log(indexOfMax);
    //console.log(indexOfMin);
    //console.log(this.currentData.length);

    // for loop that for creating new Date and Time object that is then pushed into dataPoints array
    // dataPoints array is required for ploting on the graph
    for (var i = 0; i < currentData.length; i++) {
      //console.log(this.currentData[i].Current);
      let date: Date = currentData[i].Date;
      let time: Time = currentData[i].Time;
      let day: number = this.getExactDay(date);
      let month: number = this.getExactMonth(date) - 1;
      let year: number = this.getExactYear(date);
      let hour: number = this.getExactHours(time);
      let minute: number = this.getExactMinutes(time);
      let currentValue: number = currentData[i].Current;




      // if index is equal to index of MIN voltage value then is necessarry to put marker in the dataPoints array
      if (i == indexOfMin) {

        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: currentValue,
          indexLabel: "LOW", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Current: " + currentData[i].Current + " mA"
        });
        //console.log("Index of min is: " + i + ", and value is: " + currentValue);
      }
      // if index is equal to index of MAX voltage value then is necessarry to put marker in the dataPoints array
      else if (i == indexOfMax) {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: currentValue,
          indexLabel: "HIGH", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Current: " + currentData[i].Current + " mA"
        });
        //console.log("Index of max is: " + i + ", and value is: " + currentValue);
      }
      else {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: currentValue, markerType: "circle", markerColor: "#000099", markerSize: 6,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Current: " + currentData[i].Current + " mA"
        });
      }
    }

    let chart4 = new CanvasJS.Chart("chartContainer4", {
      zoomEnabled: true,
      animationEnabled: true,
      animationDuration: 2000,
      theme: "light1",
      //exportEnabled: true,
      title: {
        text: "I/t  diagram",
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
        title: "Current [A]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelFontSize: 12,
        labelFontColor: "#000099",
        interlacedColor: "#E6E6E6",
        tickColor: "#000099",
        tickLength: 5,
        tickThickness: 2,
        interval: 10,
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

    chart4.render();
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

  getMinIndex(currentData: CurrentData[]): number {
    let minIndex = 0;
    for (let i = 1; i < currentData.length; i++) {
      if (currentData[i].Current < currentData[minIndex].Current) {
        minIndex = i;
      }
    }
    return minIndex;
  }

  getMaxIndex(currentData: CurrentData[]): number {
    let maxIndex = 0;
    for (let i = 1; i < currentData.length; i++) {
      if (currentData[i].Current > currentData[maxIndex].Current) {
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
