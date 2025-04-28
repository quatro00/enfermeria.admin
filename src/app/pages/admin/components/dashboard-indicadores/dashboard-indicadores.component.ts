import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-dashboard-indicadores',
  templateUrl: './dashboard-indicadores.component.html',
  styleUrls: ['./dashboard-indicadores.component.css']
})
export class DashboardIndicadoresComponent {

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
    this.dashboardService.GetIndicadores()
      .subscribe({
        next: (response) => {
          //console.log('indicadores',response);
          this.indicadores = response;
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
