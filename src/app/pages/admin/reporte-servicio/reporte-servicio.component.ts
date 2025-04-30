import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ContactoService } from 'src/app/services/contacto.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { ServicioFechaService } from 'src/app/services/serviciofecha.repository';

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
  isVisibleVerOfertas = false;
  isVisibleAdjuntarTransferencia=false;

  servicioIdSeleccionado = '';

  isLoading = true;

  btnLoading = false;
  btnLoadingEnviarCorreo = false;
  btnLoadingAplicarDescuento = false;
  btnLoadingAdjuntarTransferencia = false;
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
      key: 'subTotal',
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
      title: 'Por asignar',
      key: 'guardiasPorAsignar',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Asignadas',
      key: 'guardiasAsignadas',
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
    { id: 2, descripcion: 'Pagado' },
    { id: 99, descripcion: 'Cancelado' },
  ];


  formSubirTransferencia!: UntypedFormGroup;
  formSearch!: UntypedFormGroup;
  formEnviarCorreo!: UntypedFormGroup;
  formAplicarDescuento!: UntypedFormGroup;
  formDescuento: FormGroup;

  estados: any[] = [];
  enviarCorreoId='';
  aplicarDescuento:any={};
  servicioSeleccionado:any;

  transferenciaTitulo: string = 'Seleccione..';
  transferencia: File | null = null;

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private excelService: ExcelService,
    private pacienteService: PacienteService,
    private servicioService: ServicioService,
    private estadosService: EstadoService,
    private servicioFechaService:ServicioFechaService
  ) { }

  ngOnInit() {

    this.formSubirTransferencia = this.fb.group({
      referencia: [null, [Validators.required]],
      transferencia: [null, [Validators.required]],
    });

    this.formDescuento = this.fb.group({
      items: this.fb.array([])
    });

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

  beforeUploadTransferencia = (file: File): boolean => {
    this.transferencia = file;
    this.formSubirTransferencia.get('transferencia')?.setValue(file);
    this.transferenciaTitulo = file.name;
    return false; // evita la subida automática
  };

  private applyFilters(): any[] {
      
    return this.data.filter((data2) =>
      data2.no.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.paciente.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.estado.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.direccion.toLowerCase().includes(this.searchValue.toLowerCase()) ||

      data2.tipoEnfermera.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.horas.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.descuento.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.subTotal.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||


      data2.motivo.toLowerCase().includes(this.searchValue.toLowerCase()) 
    );
  }

  DescargarTransferencia(id){
    this.servicioService.DescargarPago(id)
    .subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transferencia.pdf';
        a.click();
        window.URL.revokeObjectURL(url);

      },
      complete: () => {
        //this.isLoading = false;
      },
      error: () => {
        //this.isLoading = false;
      }
    });
  }

  AbrirModalAdjuntarTransferencia(id){
    this.servicioSeleccionado = id;
    this.formSubirTransferencia.reset();
    this.transferenciaTitulo = 'Seleccione...';
    this.transferencia = null;
    
    this.isVisibleAdjuntarTransferencia = true;
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  exportToExcel(){
    const formattedData = this.filteredData.map(item => {
      const formattedItem = {};
      this.listOfColumn.forEach(column => {
        // Usa la propiedad `key` para acceder al valor en `item`
        formattedItem[column.title] = item[column.key];
      });
      return formattedItem;
    });

    this.excelService.exportTableToExcel(formattedData,'Servicios');
  }

  cerrarAdjuntarTransferencia(){
    this.isVisibleAdjuntarTransferencia = false;
  }
  cerrarModalAplicarDescuento(){
    this.isVisibleAplicarDescuento = false;
  }

  get items(): FormArray {
    return this.formDescuento.get('items') as FormArray;
  }

  AbrirModalAplicarDescuento(id) {
    this.items.clear(); // Por si se vuelve a cargar

    
    this.aplicarDescuento = id;
    this.formAplicarDescuento.reset();
    this.isVisibleAplicarDescuento = true;
    this.servicioFechaService.GetServiciosFechaByServicio(id)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.isVisibleAplicarDescuento = true;

        this.items.clear(); // Por si se vuelve a cargar

        response.forEach(d => {
        this.items.push(this.fb.group({
          id: [d.id],
          descuento: [d.descuento],
          total: [new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(d.total)],
          inicio: (new Date([d.fechaInicio].toString())).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
          fin: (new Date([d.fechaTermino].toString())).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
          fecha: (new Date([d.fechaInicio].toString())).toLocaleDateString('es-MX')
        }));
      });

        
      },
      complete: () => {
        //this.btnLoading = false;
      },
      error: () => {
        //this.btnLoading = false;
      }
    })
  }

  CancelarCotizacion(item): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Terminación de guardia</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas cancelar la cotizacion seleccionada?</p>',
      nzOnOk: () => {
        this.servicioService.CancelarServicio(item)
          .subscribe({
            next: (response) => {
              this.BuscaServicios();
            },
            complete: () => {
              this.msg.success('Guardia liberada correctamente.');
            },
            error: () => {
              //this.btnLoading = false;
            }
          })

      }
    });
  }

  guardarDescuentos() {
    const valores = this.formDescuento.value.items;
    this.servicioFechaService.AplicarDescuentos(valores)
    .subscribe({
      next: (response) => {
        this.msg.success("Descuentos aplicados correctamente.");
        this.isVisibleAplicarDescuento = false;
      },
      complete: () => {
        //this.btnLoading = false;
      },
      error: () => {
        //this.btnLoading = false;
      }
    })
    // Aquí mandas los datos al backend
  }

  AbrirModalEnviarCorreo(id) {
    this.enviarCorreoId = id;
    this.formEnviarCorreo.reset();
    this.isVisibleEnviarCorreo = true;
  }

 

  EnviarTransferencia(){
    var valido = false;

    if(
      this.transferencia != null 

    ){
      valido = true;
    }

      const request = new FormData();

      if (this.servicioSeleccionado) request.append('ServicioId', this.servicioSeleccionado);
      if (this.transferencia) request.append('transferencia', this.transferencia);
      request.append('referencia', this.formSubirTransferencia.value.referencia);

    if (valido) {
      this.btnLoadingAdjuntarTransferencia = true;
      
      this.servicioService.AdjuntarReferencia(request)
      .subscribe({
        next: (response) => {
          this.BuscaServicios();
          this.btnLoadingAdjuntarTransferencia = false;
          this.formSubirTransferencia.reset();
          this.isVisibleAdjuntarTransferencia = false;
        },
        complete: () => {
          this.btnLoadingAdjuntarTransferencia = false;
          this.msg.success('Documentos guardados correctamente.');
        },
        error: () => {
          this.msg.error('Ocurrio un error.');
          this.btnLoadingAdjuntarTransferencia = false;
        }
      })

    } else {
      this.msg.error('Todos los documentos son requeridos.');
    }
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

  verOfertas(servicioId: string) {
    this.servicioIdSeleccionado = servicioId;
    this.isVisibleVerOfertas = true;
  }

  onOfertaSeleccionada(oferta: any) {
  
    // Aquí puedes manejar lo que quieras hacer con la oferta ganadora
    // Por ejemplo: asignarla, actualizar estatus, etc.
  }
}
