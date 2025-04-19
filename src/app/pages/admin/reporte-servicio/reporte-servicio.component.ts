import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ContactoService } from 'src/app/services/contacto.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  styles: [`
    :host ::ng-deep .basic-select .ant-select-selector{
      @apply h-[50px] rounded-4 border-normal px-[20px] flex items-center dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
    }
    :host ::ng-deep .basic-select.ant-select-multiple .ant-select-selection-item{
        @apply bg-white dark:bg-white/10 border-normal dark:border-white/10;
      }
      ::ng-deep .ant-upload {
        @apply w-full;
      }
      :host ::ng-deep .basic-select .ant-select-multiple.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector{
        @apply dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
      }
    `],
  selector: 'app-reporte-servicio',
  templateUrl: './reporte-servicio.component.html',
  styleUrls: ['./reporte-servicio.component.css']
})
export class ReporteServicioComponent {

  isVisibleEnviarCorreo = false;
  isVisibleAplicarDescuento = false;

  isLoading = true;
  btnLoading = false;
  btnLoadingEnviarCorreo = false;
  btnLoadingAplicarDescuento = false;
  showContent = false;

  data: any[] = [];
  filteredData: any[] = [];

  contratoMantenimientoId;
  searchValue = '';

  listOfColumn = [
    {
      title: 'No',
      key: 'no',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Paciente',
      key: 'paciente',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Estado',
      key: 'estado',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Dirección',
      key: 'direccion',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Motivo',
      key: 'motivo',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Tipo enfermera',
      key: 'tipoEnfermera',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Horas',
      key: 'horas',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Descuento',
      key: 'descuento',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Total',
      key: 'total',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
  ];

  opcionesEstatus = [
    { id: 0, descripcion: 'Todos' },
    { id: 1, descripcion: 'En cotización' },
  ];

  formSearch!: UntypedFormGroup;
  formEnviarCorreo!: UntypedFormGroup;
  formAplicarDescuento!: UntypedFormGroup;

  estados: any[] = [];
  enviarCorreoId='';
  aplicarDescuento:any={};

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private excelService: ExcelService,
    private pacienteService: PacienteService,
    private servicioService: ServicioService,
    private estadosService: EstadoService
  ) { }

  ngOnInit() {

    this.formEnviarCorreo = this.fb.group({
      correo: [null, [Validators.required]]
    });

    this.formAplicarDescuento = this.fb.group({
      descuento: [null, [Validators.required]]
    });

    this.formSearch = this.fb.group({
      no: [null, []],
      nombrePaciente: [null, []],
      estatus: [null, []],
      estado: [null, []],
    });

    this.loadData();
  }

  cerrarModalAplicarDescuento(){
    this.isVisibleAplicarDescuento = false;
  }

  AbrirModalAplicarDescuento(id) {
    this.aplicarDescuento = id;
    this.formAplicarDescuento.reset();
    this.isVisibleAplicarDescuento = true;
  }

  AbrirModalEnviarCorreo(id) {
    this.enviarCorreoId = id;
    this.formEnviarCorreo.reset();
    this.isVisibleEnviarCorreo = true;
  }

  cerrarModalEnviarCorreo() {
    this.isVisibleEnviarCorreo = false;
  }

  loadData() {
    forkJoin([
      this.estadosService.Get()
    ]).subscribe({
      next: ([estadosReponse]) => {
        this.estados = estadosReponse;

        this.formSearch.patchValue({
          estatus: 0,
          estado: 0
        });

        this.isLoading = false;
        this.showContent = true;

      },
      complete: () => {
        this.isLoading = false;
        this.showContent = true;
      },
      error: () => {
        this.isLoading = false;
        // Maneja el error si es necesario
        this.msg.error("Ocurrio un error inesperado.");
      }
    });

  }

  AplicarDescuentoCotizacion(){
    const cotizacionId = this.aplicarDescuento.id;
    const monto = this.formAplicarDescuento.value.descuento;
    this.btnLoadingAplicarDescuento = true;
    this.servicioService.AplicarDescuento(cotizacionId, monto)
      .subscribe({
        next: () => {this.msg.success('Descuento aplicado.');this.BuscaServicios(); this.isVisibleAplicarDescuento = false; this.btnLoadingAplicarDescuento = false; this.cerrarModalEnviarCorreo()},
        error: err => {this.btnLoadingAplicarDescuento = false; this.msg.error('Ocurrio un error al aplicar el descuento.')}
      });
  }

  EnviarCotizacionCorreo() {
    const cotizacionId = this.enviarCorreoId;
    const correoExtra = this.formEnviarCorreo.value.correo;
    this.btnLoadingEnviarCorreo = true;
    this.servicioService.EnviarCotizacionPorCorreo(cotizacionId, correoExtra)
      .subscribe({
        next: () => {this.msg.success('Correo enviado.'); this.btnLoadingEnviarCorreo = false; this.cerrarModalEnviarCorreo()},
        error: err => {this.btnLoadingEnviarCorreo = false; this.msg.error('Ocurrio un error al enviar el correo.')}
      });
  }

  DescargarCotizacion(id: string) {
    this.servicioService.DescargarCotizacion(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cotizacion.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  BuscaServicios(){
    console.log(this.formSearch.valid);
    if (this.formSearch.valid) {
      this.btnLoading = true;
      let request = {
        noServicio: this.formSearch.value.no,
        nombrePaciente: this.formSearch.value.nombrePaciente,
        estado: this.formSearch.value.estado,
        estatus: this.formSearch.value.estatus,
      };

      this.servicioService.GetAll(request.noServicio, request.nombrePaciente, request.estado, request.estatus)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.data = response;
          this.filteredData = response;
          this.loadData();
        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
        }
      })
    } else {
      
      Object.values(this.formSearch.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
  }
}
