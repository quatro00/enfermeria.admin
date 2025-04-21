import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ServicioFechaService } from 'src/app/services/serviciofecha.repository';
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
  selector: 'app-modal-ver-ofertas',
  templateUrl: './modal-ver-ofertas.component.html',
  styleUrls: ['./modal-ver-ofertas.component.css']
})
export class ModalVerOfertasComponent {
  @Input() isVisible: boolean = false;
  @Input() servicioFechasId!: string;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() ofertaSeleccionada = new EventEmitter<any>();

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

  data: any[] = [];
  filteredData: any[] = [];
  btnLoading = false;

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
    console.log(this.servicioFechasId);
    if (this.servicioFechasId) {
      this.busarOfertas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = [];
    this.filteredData = [];

    if (changes['isVisible'] && this.isVisible) {
      this.busarOfertas();
    }
  }

  cerrarSegundoModal() {
    this.isVisibleChange.emit(false); 
  }

  info(servicioFechasOfertaId): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Mensaje de confirmación</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas asignar la oferta seleccionada?</p>',
      nzOnOk: () => {
        
        this.servicioFechaService.AsignarOferta(this.servicioFechasId, { ServicioFechasOfertaId: servicioFechasOfertaId })
          .subscribe({
            next: (response) => {
              this.ofertaSeleccionada.emit(servicioFechasOfertaId);
              this.cerrarSegundoModal();
            },
            complete: () => {
              this.msg.success('Oferta asignada correctamente.');
            },
            error: () => {
              //this.btnLoading = false;
            }
          })


      }
    });
  }

  busarOfertas() {
    this.servicioFechasOfertaService.Get(this.servicioFechasId)
      .subscribe({
        next: (response) => {
          this.data = response;
          this.filteredData = response;
        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
        }
      })

  }

}
