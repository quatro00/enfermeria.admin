import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExcelService } from 'src/app/services/excel.service';


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
  selector: 'app-dashboard-grafica-pagos',
  templateUrl: './dashboard-grafica-pagos.component.html',
  styleUrls: ['./dashboard-grafica-pagos.component.css']
})
export class DashboardGraficaPagosComponent {

public chartOptions: any;
  showContent = false;
  indicadores: any = [];
  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private excelService: ExcelService,
    private dashboardService: DashboardService
  ) {

    
  }

  ngOnInit() {


    this.loadData();
  }

  loadData() {
    this.dashboardService.GetGraficaPagos()
      .subscribe({
        next: (response:any) => {
          this.indicadores = response;

          this.chartOptions = {
            series: response.series,//
            labels: response.labels,//
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


          this.showContent = true;
        },
        complete: () => {
          //this.msg.success('Oferta asignada correctamente.');
        },
        error: () => {
          //this.btnLoading = false;
        }
      })

  }
}
