import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExcelService } from 'src/app/services/excel.service';
import interactionPlugin from '@fullcalendar/interaction';


import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  styles: [`
    :host ::ng-deep .mini-calendar .fc .fc-toolbar.fc-header-toolbar{
      @apply justify-center gap-[15px] mb-[10px];
    }
    :host ::ng-deep .mini-calendar .fc .fc-toolbar.fc-header-toolbar .fc-button {
      @apply bg-transparent border-0 text-theme-gray dark:text-white/[.60] shadow-none outline-none text-[20px];
    }
    :host ::ng-deep .mini-calendar .fc .fc-button .fc-icon {
      @apply text-[15px];
    }
    :host ::ng-deep .mini-calendar .fc .fc-toolbar-title{
      @apply text-[16px] font-medium text-dark dark:text-white/[.87];
    }
    :host ::ng-deep .mini-calendar .fc td{
      @apply h-[64px] w-[64px] max-w-[64px] rounded-6;
    }
    :host ::ng-deep .mini-calendar .fc th{
      @apply w-[64px];
    }
    :host ::ng-deep .mini-calendar .fc-theme-standard .fc-scrollgrid,
    :host ::ng-deep .mini-calendar .fc-theme-standard td,
    :host ::ng-deep .mini-calendar .fc-theme-standard th{
      @apply border-0;
    }
    :host ::ng-deep .mini-calendar .fc .fc-daygrid-day-frame{
      @apply flex items-center justify-center;
    }
    :host ::ng-deep .mini-calendar .fc .fc-daygrid-day.fc-day-today{
      @apply bg-primary border-primary rounded-6;
    }
    :host ::ng-deep .mini-calendar .fc .fc-day-other .fc-daygrid-day-top{
      @apply text-light dark:text-white/[.60] text-[12px] font-medium;
    }
    :host ::ng-deep .mini-calendar .fc .fc-daygrid-day:not(.fc-day-other) .fc-daygrid-day-top{
      @apply text-[12px] font-medium text-theme-gray dark:text-white/[.60];
    }
    :host ::ng-deep .mini-calendar .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-top a{
      @apply text-white;
    }
    :host ::ng-deep .mini-calendar .fc .fc-col-header-cell-cushion{
      @apply text-[13px] font-medium text-theme-gray dark:text-white/[.60];
    }
    :host ::ng-deep .mini-calendar .fc thead .fc-scroller{
      @apply overflow-hidden #{!important};
    }
  `],
  selector: 'app-dashboard-mini-calendar',
  templateUrl: './dashboard-mini-calendar.component.html',
  styleUrls: ['./dashboard-mini-calendar.component.css']
})
export class DashboardMiniCalendarComponent {

  public chartOptions: any;
  calendarOptions:any;
  showContent = false;
  indicadores: any = [];

  currentYear: number;
  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private excelService: ExcelService,
    private dashboardService: DashboardService
  ) {
    this.currentYear = new Date().getFullYear();
    
  }

  ngOnInit() {


    this.loadData();
  }

  loadData() {

    this.dashboardService.GetGuardiasProximas()
    .subscribe({
      next: (response) => {
        this.calendarOptions = {
          initialView: 'timeGridWeek', // <-- cambiar a timeGridWeek para mostrar por horas
          plugins: [dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin], // <-- agregar timeGridPlugin
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek' // <-- agregar timeGridWeek al header
          },
          events: response,
          dateClick: (info) => {
            const clickedDate = info.dateStr;
            const eventsOnDate = (this.calendarOptions.events as any[]).filter(event => event.start.startsWith(clickedDate));
            
            if (eventsOnDate.length) {
              let details = eventsOnDate.map(ev => `- ${ev.title}: ${ev.description}`).join('\n');
              alert(`Eventos en ${clickedDate}:\n\n${details}`);
            } else {
              alert(`No hay eventos en ${clickedDate}`);
            }
          },
          eventClick: (info) => {
            alert(`Evento: ${info.event.title}\nDescripción: ${info.event.extendedProps.description}`);
          }
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


   
   
    

    /*
    this.dashboardService.GetIndicadores()
      .subscribe({
        next: (response) => {
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
      */
  }

}
