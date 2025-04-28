import { Component, ViewChild } from '@angular/core';
import overviewData from '../../../../assets/data/pages/demo-one/overviewData.json';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexStates,
  ApexFill,
} from "ng-apexcharts";
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showContent = false;
  altasPendientes:number = 0;
  medicamentosCaducos:number = 0;
  diasUltimoInventario:number = 0;
  fechas:string[]=[];
  appOverviewData = overviewData;
  filteredOverviewData = this.appOverviewData.filter(item => item.id >= 5 && item.id <= 8);


  public chartOptions: any;


  ngOnInit() {
    this.showContent = true;

    
    
  }


  //--------
  sellingTab: string = 'week';
  handleClick(tab: string): void {
    this.sellingTab = tab;
  }



  constructor(private datePipe: DatePipe) {
  
    this.chartOptions = {
      series: [20, 10, 10,10,10],//
      labels: ['Target', 'In Progress', 'Completed','ewe','22'],//
      //colors: ['#8231D3', '#00AAFF', '#FA8B0C'],
      chart: {//
        width: '100%',
        height: 298,
        type: 'donut',
      },

      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 0,
        offsetX: 0,
        fontSize: '15px',
        fontFamily: '"Jost", sans-serif',
        fontWeight: 400,
        labels: {
          colors: '#404040',
        },
        markers: {
          width: 6,
          height: 6,
          radius: 20,
          offsetX: -4,
          offsetY:-2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      plotOptions: {
        pie: {
            dataLabels: {
                minAngleToShowLabel: undefined
            },
            donut: {
                size: "80%",
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '16px',
                        fontFamily: 'Jost, sans-serif',
                        color: '#404040',
                        offsetY: -10
                    },
                    value: {
                        show: true,
                        fontSize: '30px',
                        fontFamily: 'Jost, sans-serif',
                        color: "black",
                        fontWeight: "bold",
                        offsetY: 10,
                        formatter: function (val) {
                            return +val //+ "K"
                        }
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        color: '#404040',
                        fontFamily: 'Jost, sans-serif',
                        formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => {
                                return a + b
                            }, 0)
                        }
                    }
                }
            },
        },
    },
    responsive: [{
        breakpoint: 1399,
        options: {
            chart: {
                width: "100%"
            },

        }
    }],

    };


   
  }

}
