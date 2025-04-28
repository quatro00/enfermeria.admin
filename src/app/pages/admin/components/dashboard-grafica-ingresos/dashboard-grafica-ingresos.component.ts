import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
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
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis:ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  responsive: ApexResponsive;
};

@Component({
  styles: [`
    :host ::ng-deep .apexcharts-text.apexcharts-yaxis-label {
      @apply dark:fill-white/[.60] #{!important};
    }
  `],
  selector: 'app-dashboard-grafica-ingresos',
  templateUrl: './dashboard-grafica-ingresos.component.html',
  styleUrls: ['./dashboard-grafica-ingresos.component.css']
})
export class DashboardGraficaIngresosComponent {

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

    @Input() componentId: string;
  //Tabs
  sellingTab: string = 'month';


  ngOnInit(): void {
    this.loadData();
  }

//Chart Data
 @ViewChild("chart") chart: ChartComponent;
 public chartOptions: Partial<ChartOptions>;
 public chartOptions2: Partial<ChartOptions>;
 public chartOptions3: Partial<ChartOptions>;

 loadData() {
  this.dashboardService.GetGraficaIngresos()
    .subscribe({
      next: (response:any) => {

       // console.log(response);
        this.chartOptions3 = {
          title:{
          },
          series: response.series,
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          states: {
    
          },
          tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            x: {
                show: true,
                format: 'dd MMM',
                formatter: undefined,
            },
            y: {
                formatter: undefined,
                title: {
                    formatter: (seriesName) => seriesName,
                },
            },
            z: {
                formatter: undefined,
                title: 'Size: '
            },
            marker: {
                show: true,
            },
            fixed: {
                enabled: false,
                position: 'topLeft',
                offsetY: 0,
            },
            style: {
                fontSize: '12px',
                fontFamily: '"Jost", sans-serif',
            },
          },
          grid: {
            borderColor: '#485e9029',
            strokeDashArray: 5,
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
          },
          },
          chart: {
            width: "100%",
            height: 368,
            type: "bar",
            parentHeightOffset: 0,
            toolbar: {
              show: false
            }
          },
          stroke: {
            show: true,
            width: 40,
            colors: ['transparent']
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '40%',
              borderRadius: 2,
            }
          },
          xaxis: {
            crosshairs: {
              show: false
            },
            labels: {
              style: {
                colors: Array.from({ length: 12 }, () => '#747474'),
                fontSize: '14px',
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
              },
            },
            categories: response.meses,
            axisBorder: {
              show: false,
            },
            axisTicks: {
                show: false,
            },
          },
          yaxis: {
            labels: {
              offsetX: -15,
              formatter: (val) => {
                return val + "";
              },
              style: {
                colors: ['#747474'],
                fontSize: '14px',
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
                show: false,
            },
          },
          // Rest of the chart options...
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
