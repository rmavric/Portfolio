import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../canvasjs.min';
import { HumidityData } from '../../models/humidity-data';
import { Time } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { TemperatureData } from '../../models/temperature-data';

@Component({
  selector: 'app-temp-hum-diagram',
  templateUrl: './temp-hum-diagram.component.html',
  styleUrls: ['./temp-hum-diagram.component.scss']
})
export class TempHumDiagramComponent implements OnChanges {

  @Input() allHumidityData: HumidityData[] = new Array<HumidityData>();
  @Input() allTemperatureData: TemperatureData[] = new Array<TemperatureData>();
  @Input() startDate: Date;
  @Input() endDate: Date;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    let humidityData = new Array<HumidityData>();
    let temperatureData = new Array<TemperatureData>();
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      //humidityData = change.currentValue;
    }

    let dataPointsHumidity = [];
    let dataPointsTemperature = [];


    // HUMIDITY


    if ((isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate))) {
      humidityData = this.allHumidityData;
      //console.log("dates are not defined");
    }
    else {
      for (let i = 0; i < this.allHumidityData.length; i++) {
        if (this.allHumidityData[i].Date >= this.startDate || this.allHumidityData[i].Date <= this.endDate) {
          humidityData.push(this.allHumidityData[i]);
        }
      }
      //console.log("dates are defined");
    }

    // to calculate index of MIN and MAX value in humidityData
    let indexOfMaxHum = humidityData.reduce((iMax, x, i, arr) => x.Humidity > arr[iMax].Humidity ? i : iMax, 0);
    let indexOfMinHum = humidityData.reduce((iMin, x, i, arr) => x.Humidity < arr[iMin].Humidity ? i : iMin, 0);
    

    for (var i = 0; i < humidityData.length; i++) {
      let dateHum: Date = humidityData[i].Date;
      let timeHum: Time = humidityData[i].Time;
      let dayHum: number = this.getExactDay(dateHum);
      let monthHum: number = this.getExactMonth(dateHum) - 1;
      let yearHum: number = this.getExactYear(dateHum);
      let hourHum: number = this.getExactHours(timeHum);
      let minuteHum: number = this.getExactMinutes(timeHum);
      let humidityValue: number = humidityData[i].Humidity;




      // if index is equal to index of MIN humidity value then is necessarry to put marker in the dataPoints array
      if (i == indexOfMinHum) {

        dataPointsHumidity.push({
          x: new Date(yearHum, monthHum, dayHum, hourHum, minuteHum), y: humidityValue,
          indexLabel: "LOW", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + dayHum + "." + (monthHum + 1) + "." + yearHum + "." + "</br>" + "Time: " + this.printHour(hourHum) + ":" + this.printMinute(minuteHum) + "</br>" + "Humidity: " + humidityData[i].Humidity
        });
        //console.log("Index of min is: " + i + ", and value is: " + humidityValue);
      }
      // if index is equal to index of MAX humidity value then is necessarry to put marker in the dataPoints array
      else if (i == indexOfMaxHum) {
        dataPointsHumidity.push({
          x: new Date(yearHum, monthHum, dayHum, hourHum, minuteHum), y: humidityValue,
          indexLabel: "HIGH", markerType: "cross", markerColor: "red", markerSize: 8,
          toolTipContent: "Date: " + dayHum + "." + (monthHum + 1) + "." + yearHum + "." + "</br>" + "Time: " + this.printHour(hourHum) + ":" + this.printMinute(minuteHum) + "</br>" + "Humidity: " + humidityData[i].Humidity
        });
        //console.log("Index of max is: " + i + ", and value is: " + humidityValue);
      }
      else {
        dataPointsHumidity.push({
          x: new Date(yearHum, monthHum, dayHum, hourHum, minuteHum), y: humidityValue, markerType: "circle", markerColor: "#000099", markerSize: 3,
          toolTipContent: "Date: " + dayHum + "." + (monthHum + 1) + "." + yearHum + "." + "</br>" + "Time: " + this.printHour(hourHum) + ":" + this.printMinute(minuteHum) + "</br>" + "Humidity: " + humidityData[i].Humidity
        });
      }

    }

        // TEMPERATURE



      if ((isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate))) {
        temperatureData = this.allTemperatureData;
        //console.log("dates are not defined");
      }
      else {
        for (let i = 0; i < this.allTemperatureData.length; i++) {
          if (this.allTemperatureData[i].Date >= this.startDate || this.allTemperatureData[i].Date <= this.endDate) {
            temperatureData.push(this.allTemperatureData[i]);
          }
        }
        //console.log("dates are defined");
      }
  
      // to calculate index of MIN and MAX value in temperatureData
      let indexOfMaxTemp = temperatureData.reduce((iMax, x, i, arr) => x.Temperature > arr[iMax].Temperature ? i : iMax, 0);
      let indexOfMinTemp = temperatureData.reduce((iMin, x, i, arr) => x.Temperature < arr[iMin].Temperature ? i : iMin, 0);
      
  
      for (var i = 0; i < temperatureData.length; i++) {
        let dateTemp: Date = temperatureData[i].Date;
        let timeTemp: Time = temperatureData[i].Time;
        let dayTemp: number = this.getExactDay(dateTemp);
        let monthTemp: number = this.getExactMonth(dateTemp) - 1;
        let yearTemp: number = this.getExactYear(dateTemp);
        let hourTemp: number = this.getExactHours(timeTemp);
        let minuteTemp: number = this.getExactMinutes(timeTemp);
        let temperatureValue: number = temperatureData[i].Temperature;
  
  
  
  
        // if index is equal to index of MIN humidity value then is necessarry to put marker in the dataPoints array
        if (i == indexOfMinTemp) {
  
          dataPointsTemperature.push({
            x: new Date(yearTemp, monthTemp, dayTemp, hourTemp, minuteTemp), y: temperatureValue,
            indexLabel: "LOW", markerType: "cross", markerColor: "red", markerSize: 8,
            toolTipContent: "Date: " + dayTemp + "." + (monthTemp + 1) + "." + yearTemp + "." + "</br>" + "Time: " + this.printHour(hourTemp) + ":" + this.printMinute(minuteTemp) + "</br>" + "Temperature: " + temperatureData[i].Temperature
            
          });
          //console.log("Index of min is: " + i + ", and value is: " + humidityValue);
        }
        // if index is equal to index of MAX humidity value then is necessarry to put marker in the dataPoints array
        else if (i == indexOfMaxTemp) {
          dataPointsTemperature.push({
            x: new Date(yearTemp, monthTemp, dayTemp, hourTemp, minuteTemp), y: temperatureValue,
            indexLabel: "HIGH", markerType: "cross", markerColor: "red", markerSize: 8,
            toolTipContent: "Date: " + dayTemp + "." + (monthTemp + 1) + "." + yearTemp + "." + "</br>" + "Time: " + this.printHour(hourTemp) + ":" + this.printMinute(minuteTemp) + "</br>" + "Temperature: " + temperatureData[i].Temperature
          });
          //console.log("Index of max is: " + i + ", and value is: " + humidityValue);
        }
        else {
          dataPointsTemperature.push({
            x: new Date(yearTemp, monthTemp, dayTemp, hourTemp, minuteTemp), y: temperatureValue, markerType: "circle", markerColor: "#000099", markerSize: 3,
            toolTipContent: "Date: " + dayTemp + "." + (monthTemp + 1) + "." + yearTemp + "." + "</br>" + "Time: " + this.printHour(hourTemp) + ":" + this.printMinute(minuteTemp) + "</br>" + "Temperature: " + temperatureData[i].Temperature
          });
        }

      
    }

    let chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: true,
      animationEnabled: true,
      animationDuration: 2000,
      theme: "light1",
      //exportEnabled: true,
      title: {
        text: "°C/t, %/t diagram",
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
        labelFontColor: "#323232",
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
        title: "Temperature [°C]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelFontSize: 12,
        labelFontColor: "#FF0000",
        tickColor: "#FF0000",
        tickLength: 5,
        tickThickness: 2,
        interval: 5,
        gridDashType: "dot",
        gridThickness: 2,
        gridColor: "#787878",
        lineColor: "#FF0000",
        lineThickness: 2,
        maximum: 50,
        minimum: 0
      },

      axisY2: {
        title: "Humidity [%]",
        titleFontColor: "#323232",
        titleFontSize: 16,
        titleFontWeight: "bold",
        labelFontSize: 12,
        labelFontColor: "#000099",
        tickColor: "#000099",
        tickLength: 5,
        tickThickness: 2,
        interval: 10,
        lineColor: "#000099",
        lineThickness: 2,
        maximum: 100,
        minimum: 0
      },


      toolTip: {
        borderColor: "#000099",
        backgroundColor: "white",
        cornerRadius: 8,
        fontSize: 12,
        fontStyle: "comic sans ms",
        fontColor: "#000099"
      },

      legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries
      },

      data: [
        {
          type: "line",
          name: "Temperature",
          color: "#FF0000",
          lineThickness: 2,
          showInLegend: true,
          axisYIndex: 0,
          dataPoints: dataPointsTemperature
        },
        {
          type: "line",
          name: "Humidity",
          color: "#000099",
          lineThickness: 2,
          axisYType: "secondary",
          showInLegend: true,
          dataPoints: dataPointsHumidity

        } 
      ]
    });

    chart.render();

    function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
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

  // methods for printing minutes and hours in two digits... for example 02:05 instead of 2:5
  printMinute(minute: number): string {
    return minute < 10 ? "0" + minute.toString() : minute.toString();
  }

  printHour(hour: number): string {
    return hour < 10 ? "0" + hour.toString() : hour.toString();
  }

}


