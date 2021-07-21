import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as CanvasJS from '../canvasjs.min';
import { VoltageData } from '../../models/voltage-data';
import { Time } from '@angular/common';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-generated-voltage-diagram',
  templateUrl: './generated-voltage-diagram.component.html',
  styleUrls: ['./generated-voltage-diagram.component.scss']
})
export class GeneratedVoltageDiagramComponent implements OnChanges {

  @Input() allVoltageData: VoltageData[] = new Array <VoltageData>();
  @Input() startDate: Date;
  @Input() endDate: Date;

  //voltageData = new Array<VoltageData>();;


  
  //ngOnChanges(changes: SimpleChanges) {
  //  let valueArray = new Array<VoltageData>();
  //  for (let propName in changes) {
  //    let change = changes[propName];
  //    console.log(change);
  //    valueArray = change.currentValue;
  //  }
    
  //  //for (let i = 0; i < valueArray.length; i++) {
  //  //  console.log(valueArray[i].Voltage);
  //  //}
  //}




  ngOnChanges(changes: SimpleChanges) {
    let voltageData = new Array<VoltageData>();
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      voltageData = change.currentValue;
    }

    let dataPoints = [];

    if ((isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate))) {
      voltageData = this.allVoltageData;
      //console.log("dates are not defined");
    }
    else {
      for (let i = 0; i < this.allVoltageData.length; i++) {
        if (this.allVoltageData[i].Date >= this.startDate || this.allVoltageData[i].Date <= this.endDate) {
          voltageData.push(this.allVoltageData[i]);
        }
      }
      //console.log("dates are defined");
    }

    // to calculate index of MIN and MAX voltage value in voltageDataArray
    let indexOfMax = voltageData.reduce((iMax, x, i, arr) => x.Voltage > arr[iMax].Voltage ? i : iMax, 0);
    let indexOfMin = voltageData.reduce((iMin, x, i, arr) => x.Voltage < arr[iMin].Voltage ? i : iMin, 0);

    //console.log(indexOfMax);
    //console.log(indexOfMin);
    //console.log(this.voltageData.length);

    // for loop that for creating new Date and Time object that is then pushed into dataPoints array
    // dataPoints array is required for ploting on the graph
    for (var i = 0; i < voltageData.length; i++) {
      //console.log(this.voltageData[i].Voltage);
      let date: Date = voltageData[i].Date;
      let time: Time = voltageData[i].Time;
      let day: number = this.getExactDay(date);
      let month: number = this.getExactMonth(date) - 1;
      let year: number = this.getExactYear(date);
      let hour: number = this.getExactHours(time);
      let minute: number = this.getExactMinutes(time);
      let voltageValue: number = voltageData[i].Voltage;


      // if index is equal to index of MIN voltage value then is necessarry to put marker in the dataPoints array
      if (i == indexOfMin) {

        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: voltageValue, 
          indexLabel: "LOW", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + voltageData[i].Voltage + " V"
        });
        //console.log("Index of min is: " + i + ", and value is: " + voltageValue);
      }
      // if index is equal to index of MAX voltage value then is necessarry to put marker in the dataPoints array
      else if (i == indexOfMax) {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: voltageValue,
          indexLabel: "HIGH", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + voltageData[i].Voltage + " V"
        });
        //console.log("Index of max is: " + i + ", and value is: " + voltageValue);
      }
      else {
        dataPoints.push({
          x: new Date(year, month, day, hour, minute), y: voltageValue, markerType: "circle", markerColor: "#000099", markerSize: 6,
          toolTipContent: "Date: " + day + "." + (month + 1) + "." + year + "." + "</br>" + "Time: " + this.printHour(hour) + ":" + this.printMinute(minute) + "</br>" + "Voltage: " + voltageData[i].Voltage + " V"
        });
      }
    }

    let chart1 = new CanvasJS.Chart("chartContainer1", {
      zoomEnabled: true,
      animationEnabled: true,
      animationDuration: 2000,
      theme: "light1",
      //exportEnabled: true,
      title: {
        text: "V/t  diagram",
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
        title: "Voltage [V]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelFontSize: 12,
        labelFontColor: "#000099",
        interlacedColor: "#E6E6E6",
        tickColor: "#000099",
        tickLength: 5,
        tickThickness: 2,
        interval: 1,
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

    chart1.render();
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

  getMinIndex(voltageData: VoltageData[]): number {
    let minIndex = 0;
    for (let i = 1; i < voltageData.length; i++) {
      if (voltageData[i].Voltage < voltageData[minIndex].Voltage) {
        minIndex = i;
      }
    }
    return minIndex;
  }

  getMaxIndex(voltageData: VoltageData[]): number {
    let maxIndex = 0;
    for (let i = 1; i < voltageData.length; i++) {
      if (voltageData[i].Voltage > voltageData[maxIndex].Voltage) {
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
