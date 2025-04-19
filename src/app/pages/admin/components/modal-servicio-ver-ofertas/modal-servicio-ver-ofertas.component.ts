import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ServicioOfertaService } from 'src/app/services/serviciooferta.service';

@Component({
  selector: 'app-modal-servicio-ver-ofertas',
  templateUrl: './modal-servicio-ver-ofertas.component.html',
  styleUrls: ['./modal-servicio-ver-ofertas.component.css']
})
export class ModalServicioVerOfertasComponent {
  @Input() isVisible: boolean = false;
  @Input() servicioId!: string;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() ofertaSeleccionada = new EventEmitter<any>();

  btnLoading = false;
  ofertas: any[] = [];

  listOfColumn = [
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Fecha',
      key: 'fecha',
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
      title: 'Monto solicitado',
      key: 'montoSolicitado',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Monto original',
      key: 'montoOriginal',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Descuento',
      key: 'descuento',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Monto cobrado',
      key: 'montoCobrado',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Beneficio',
      key: 'beneficio',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Comisión',
      key: 'comision',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Beneficio total',
      key: 'beneficioTotal',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    }
  ];

  data: any[] = [];
  filteredData: any[] = [];

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private servicioOferta: ServicioOfertaService
  ) { }

  ngOnInit() {
    if (this.servicioId) {
      this.obtenerOfertas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.obtenerOfertas();
    }
  }

  obtenerOfertas() {
    // Aquí deberías usar un servicio para obtener las ofertas con base en el servicioId
    // Simulación:
    
  
    this.servicioOferta.Get(this.servicioId)
      .subscribe({
        next: (response) => {
          console.log('Cargando ofertas para el servicio:', response);
          this.data = response;
          this.filteredData = response;
          //this.loadData();
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
}
