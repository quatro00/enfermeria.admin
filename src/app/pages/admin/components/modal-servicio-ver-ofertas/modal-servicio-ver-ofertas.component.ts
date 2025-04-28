import { signal, ChangeDetectorRef, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';


import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ServicioFechaService } from 'src/app/services/serviciofecha.repository';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { ServicioFechasOfertaService } from 'src/app/services/serviciofechasoferta.service';

@Component({
  styles: [`

:host ::ng-deep .punto-marcado {
  position: relative;
}
:host ::ng-deep .punto-marcado::after {
  content: '';
  width: 8px;
  height: 8px;
  background: #ff5722;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
}

::ng-deep .fc-daygrid-day.fc-day-selected {
  background-color: #4caf50; /* Color para el día seleccionado */
  border-color: #388e3c;
  color: white;
}

    .ant-radio-inner{
      @apply dark:bg-white/10 dark:border-white/30;
    }
    .ant-radio-checked .ant-radio-inner{
      @apply dark:border-primary;
    }
    .ant-radio-input:focus + .ant-radio-inner{
      @apply dark:shadow-none;
    }
    .ant-radio.ant-radio-checked .ant-radio-inner {
      @apply border-4 after:hidden;
    }
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
  selector: 'app-modal-servicio-ver-ofertas',
  templateUrl: './modal-servicio-ver-ofertas.component.html',
  styleUrls: ['./modal-servicio-ver-ofertas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalServicioVerOfertasComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Input() isVisible: boolean = false;
  @Input() servicioId!: string;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() ofertaSeleccionada = new EventEmitter<any>();


  //----calendario

  radioValue = 'A';

  calendarVisible = signal(true);


  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'today,prev,title,next',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: [],
    eventContent: this.eventDotContent.bind(this),
  });

  currentEvents = signal<EventApi[]>([]);

  calendarOptions2: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, listPlugin], // Aquí añadimos plugins adicionales
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    select: this.onDateClick.bind(this),
  };

  data: any[] = [];
  filteredData: any[] = [];
  fechasServicio: any[] = [];
  //-----
  btnLoading = false;
  selectedDate: any;
  mode = 'month';
  servicioFechaSeleccionada: any = '';
  listOfColumn = [
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Inicio',
      key: 'fechaInicio',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Termino',
      key: 'fechaTermino',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Teléfono',
      key: 'telefono',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Correo',
      key: 'correo',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Tipo',
      key: 'tipo',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Comentario',
      key: 'comentario',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Monto',
      key: 'monto',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Fecha',
      key: 'fecha',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },

  ];

  isSegundoModalVisible = false;

  eventosMarcados = [
    {
      id: '2f888f79-8e1c-f011-931f-b57f6ab13c2c',
      servicioId: '2e888f79-8e1c-f011-931f-b57f6ab13c2c',
      fechaInicio: '2025-04-24T07:00:00',
      fechaTermino: '2025-04-24T19:00:00',
      estatusServicioFecha: 'Por asignar'
    },
    // ...los demás
  ];

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private servicioFechaService: ServicioFechaService,
    private servicioFechasOfertaService: ServicioFechasOfertaService
  ) { }

  ngOnInit() {
    if (this.servicioId) {
      this.obtenerOfertas();
    }
  }


  abrirSegundoModal() {
    this.isSegundoModalVisible = true;
  }

  cerrarSegundoModal() {
    this.isSegundoModalVisible = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.obtenerOfertas();
    }
  }

  getClasePorEstatus(estatus: string, ofertas: any): string {
    switch (estatus) {
      case 'Sin ofertas':
        return 'danger';
      case 'Por asignar':
        if (ofertas === 0) { return 'warning'; }
        return 'warning';
      case 'Asignada':
        return 'success';
      case 'Cancelada':
        return 'primary';
      default:
        return 'fondo-gris';
    }
  }

  obtenerOfertas() {
    // Aquí deberías usar un servicio para obtener las ofertas con base en el servicioId
    // Simulación:
    this.servicioFechaService.Get(this.servicioId)
      .subscribe({
        next: (response) => {
          this.fechasServicio = response;

          const eventos: EventInput[] = response.map(ev => ({
            id: ev.id,
            title: 'No.' + ev.no + '-' + ev.estatusServicioFecha + ' (Ofertas: ' + ev.ofertas.toString() + ')',
            start: ev.fechaInicio,
            end: ev.fechaTermino,
            ofertas: ev.ofertas,
            label: 'warning',//this.getClasePorEstatus(ev.estatusServicioFecha, ev.ofertas),
            type: 'event',
            description:
              '',

            //color: this.getClasePorEstatus(ev.estatusServicioFecha),   // an option!
            //textColor: this.getClasePorEstatus(ev.estatusServicioFecha) // an option!
          }));

          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents(); // limpia anteriores
          calendarApi.addEventSource(eventos); // agrega los nuevos

        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
        }
      })
  }

  cerrarModal() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  seleccionarOferta(oferta: any) {
    this.ofertaSeleccionada.emit(oferta);
    this.cerrarModal();
  }


  // Función para manejar el clic en un día
  onDateClick(arg: any): void {
    // Guardamos la fecha seleccionada
    this.selectedDate = arg.dateStr;
  }


  handleDateSelect(selectInfo: DateSelectArg) {
    this.abrirSegundoModal();
    /*
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        
      });
    }
    */
  }

  handleEventClick(clickInfo: EventClickArg) {

    this.servicioFechaSeleccionada = clickInfo.event.id;

    this.servicioFechasOfertaService.Get(this.servicioFechaSeleccionada)
      .subscribe({
        next: (response) => {
          this.data = response;
          this.filteredData = response;
          this.abrirSegundoModal();
        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
        }
      })

  }

  info(servicioFechasOfertaId): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Mensaje de confirmación</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas asignar la oferta seleccionada?</p>',
      nzOnOk: () => {
        this.servicioFechaService.AsignarOferta(this.servicioFechaSeleccionada, { ServicioFechasOfertaId: servicioFechasOfertaId })
          .subscribe({
            next: (response) => {
              this.isSegundoModalVisible = false;
              this.obtenerOfertas();
            },
            complete: () => {
              this.msg.success('Colaborador asignado correctamente.');
            },
            error: () => {
              //this.btnLoading = false;
            }
          })


      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    //this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  eventDotContent(arg: any) {
    return {
      html: `<div class="dot-indicator"></div>`
    };
  }
}
