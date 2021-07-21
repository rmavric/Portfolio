import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CryptoModel } from '../models/crypto-model';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-crypto-diagram',
  templateUrl: './crypto-diagram.component.html',
  styleUrls: ['./crypto-diagram.component.scss']
})
export class CryptoDiagramComponent implements OnChanges {


  constructor() { }

  chartOptions: {};

  Highcharts = Highcharts;

  @Input() allData: CryptoModel[] = new Array<CryptoModel>();
  @Input() currencyInput: string;

  text: string;
  name: string;
  currencyFirst: string;
  currencySecond: string;

  date: Date;

  ngOnChanges(changes: SimpleChanges) {
    let cryptoData = new Array<CryptoModel>();
    for (let propName in changes) {
      let change = changes[propName];
      cryptoData = change.currentValue;
    }

    let timeArray = new Array<Date>();

    let data = new Array<number>();

    if (this.allData.length > 1) {

      // add values to BTC-EUR array
      if (this.currencyInput == "BTCEUR") {
        this.text = "BTC to EUR Exchange Rate";
        this.name = "BTC to EUR";
        this.currencyFirst = "BTC";
        this.currencySecond = "EUR";
        for (let i = 0; i < this.allData.length; i++) {
          this.date = new Date(this.allData[i].timeNow);
          data.push(this.allData[i].BTCvalueEUR);
          timeArray.push(this.date);
        }
      }
      

      // add values to BTC-USD array
      if (this.currencyInput == "BTCUSD") {
        this.text = "BTC to USD Exchange Rate";
        this.name = "BTC to USD";
        this.currencyFirst = "BTC";
        this.currencySecond = "USD";
        for (let i = 0; i < this.allData.length; i++) {
          this.date = new Date(this.allData[i].timeNow);
          data.push(this.allData[i].BTCvalueUSD);
          timeArray.push(this.date);
        }
      }

      // add values to ETH-EUR array
      if (this.currencyInput == "ETHEUR") {
        this.text = "ETH to EUR Exchange Rate";
        this.name = "ETH to EUR";
        this.currencyFirst = "ETH";
        this.currencySecond = "EUR";
        for (let i = 0; i < this.allData.length; i++) {
          this.date = new Date(this.allData[i].timeNow);
          data.push(this.allData[i].ETHvalueEUR);
          timeArray.push(this.date);
        }
      }

      // add values to ETH-USD array
      if (this.currencyInput == "ETHUSD") {
        this.text = "ETH to USD Exchange Rate";
        this.name = "ETH to USD";
        this.currencyFirst = "ETH";
        this.currencySecond = "USD";
        for (let i = 0; i < this.allData.length; i++) {
          this.date = new Date(this.allData[i].timeNow);
          data.push(this.allData[i].ETHvalueUSD);
          timeArray.push(this.date);
        }
      }


      this.chartOptions = {
        chart: {
          //animation: true,
          marginBottom: 120,
          zoomType: 'x',
          reflow: true,
          marginLeft: 100,
          marginRight: 20,
          style: {
            position: 'absolute'
          },
        },

        credits: {
          enabled: false
        },
        title: {
          //text: 'BTC to EUR Exchange Rate',
          text: this.text,

          align: 'center'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Time [h]'
          }
        },
        yAxis: {
          title: {
            //text: 'Exchange rate [EUR]'
            text: this.text,
          },
          //maxZoom: 0.1
        },
        tooltip: {
          //useHTML: true,
          formatter: function () {
            var point = this.points[0];
            var first = this.currencyFirst;

            var second = this.currencySecond;

            var string = '<b>' + point.series.name + '</b><br/>' + Highcharts.dateFormat('%B %e, %Y   %k:%M', this.x) + '<br/>';
            if (point.series.name === 'BTC to EUR') {
              string += '1 BTC = ' + Highcharts.numberFormat(point.y, 2) + ' EUR';
            }
            if (point.series.name === 'BTC to USD') {
              string += '1 BTC = ' + Highcharts.numberFormat(point.y, 2) + ' USD';
            }
            if (point.series.name === 'ETH to EUR') {
              string += '1 ETH = ' + Highcharts.numberFormat(point.y, 2) + ' EUR';
            }
            if (point.series.name === 'ETH to USD') {
              string += '1 ETH = ' + Highcharts.numberFormat(point.y, 2) + ' USD';
            }

            return string;
 
          },
          //Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>'
          shared: true
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            cursor: 'pointer',
            animation: {
              duration: 1000      // filling the diagram for 5 sec
            },
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              ]
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
          
        },

        loading: {
          hideDuration: 1000

        },

        series: [{
          turboThreshold: false,
          type: 'area',
          name: this.name,
          //pointInterval: 10 * 1000,
          data: function () {
            var myData = [];
            for (let i = 0; i < data.length; i++) {     // without + 7 returns 7 days too early
              myData.push({ x: Date.UTC(timeArray[i].getFullYear(), timeArray[i].getMonth(), timeArray[i].getDate(), timeArray[i].getHours(), timeArray[i].getMinutes()), y: data[i] });
            }
            return myData;
            
          }(),

          lang: {
            noData: "There is no data to show"
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
          }


        }],

        exporting: {
          enabled: false
        }
      }


    }


  }


}
