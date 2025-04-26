import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExcelService } from 'src/app/services/excel.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { PagoLoteService } from 'src/app/services/pagolote.service';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  styles:  [`
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
  selector: 'app-reporte-pagos',
  templateUrl: './reporte-pagos.component.html',
  styleUrls: ['./reporte-pagos.component.css']
})
export class ReportePagosComponent {
  isVisible = false;
  isVisibleAdjuntarDocumento = false;
  isLoading = true;
  isLoadingAdjuntarDocumentoe = false;
  showContent = false;

  deposito:any;
  documento:any;
  documentoTitulo:any = '';

  data: any[] = [];
  filteredData: any[] = [];

  dataDepositos: any[] = [];
  filteredDataDepositos: any[] = [];

  dataDetalle: any[] = [];
  filteredDataDetalle: any[] = [];
  
  pagoSeleccionado = '';

  estatusPagoLote = [
    {id:null, descripcion:'Todos'},
    {id:1, descripcion:'Por pagar'},
    {id:2, descripcion:'Pagado'},
    {id:99, descripcion:'Cancelado'},
  ];
  contratoMantenimientoId;
  searchValue = '';
  formBusqueda!: UntypedFormGroup;
  formAdjuntarDocumento!: UntypedFormGroup;

  fileUrl: SafeResourceUrl | null = null;

  listOfColumn = [
    {
      title: 'No',
      key: 'no',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Fecha creación',
      key: 'fechaCreacion',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Total de lote',
      key: 'totalLote',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Numero de pagos',
      key: 'numeroPagos',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Colaboradores',
      key: 'colaboradores',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  listOfColumnDetalle = [
    {
      title: 'No',
      key: 'no',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Referencia',
      key: 'referencia',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Beneficiario',
      key: 'beneficiario',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Monto',
      key: 'monto',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Fecha de pago',
      key: 'fechaPago',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  listOfColumnDepositos = [
    {
      title: 'Banco',
      key: 'banco',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Clabe',
      key: 'clabe',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Beneficiario',
      key: 'beneficiario',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Monto',
      key: 'monto',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  constructor(
            private modalService: NzModalService,
            private msg: NzMessageService,
            private router: Router,
            private datePipe: DatePipe,
            private fb: UntypedFormBuilder,
            private excelService: ExcelService,
            private pagoLoteService:PagoLoteService,
            private pagoService:PagosService,
            private sanitizer: DomSanitizer
          ) { }

  ngOnInit() {

    this.formBusqueda = this.fb.group({
      periodo: [null, []],
      estatusPagoLote: [null, []],
    });

    this.formAdjuntarDocumento = this.fb.group({
      importe: [null, [Validators.required]],
      referencia: [null, [Validators.required]],
      documento: [null, [Validators.required]],
    });

    
    this.loadData();
  }

  guardarAdjuntarDocumento(){
    if (this.formAdjuntarDocumento.valid) {
      this.isLoadingAdjuntarDocumentoe = true;

      const request = new FormData();
      if (this.deposito) request.append('PagoLoteId', this.deposito.pagoLoteId);
      if (this.deposito) request.append('ColaboradorId', this.deposito.colaboradorId);
      if (this.deposito) request.append('Monto', this.formAdjuntarDocumento.value.importe);
      if (this.deposito) request.append('Referencia', this.formAdjuntarDocumento.value.referencia);
      if (this.documento) request.append('Documento', this.documento);

      this.pagoLoteService.SubirDeposito(request)
      .subscribe({
        next: (response) => {
          this.loadData();
        },
        complete: () => {
          this.isLoadingAdjuntarDocumentoe = false;
          this.isVisibleAdjuntarDocumento = false;
          this.buscarPagos();
          this.msg.success('Documentos guardados correctamente.');
        },
        error: () => {
          this.isLoadingAdjuntarDocumentoe = false;
        }
      })

    
    } else {
      
      Object.values(this.formAdjuntarDocumento.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
  }
  
  beforeUploadDocumento = (file: File): boolean => {
    
    this.documento = file;
    this.formAdjuntarDocumento.get('documento')?.setValue(file);
    this.documentoTitulo = file.name;
    return false; // evita la subida automática
  };

  cerrarModalAdjuntarDocumento(){
    this.isVisibleAdjuntarDocumento = false;
  }

  cerrarModal() {
    this.isVisible = false;
  }

  descargarPago(item){
    this.pagoLoteService.DescargarDeposito(item.pagoLoteId, item.referencia)
    .subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.referencia+'.pdf';
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

  adjuntarPago(item){
    this.formAdjuntarDocumento.reset();
    this.deposito = item;
    this.documento = null;
    this.documentoTitulo = 'Seleccione...';
    this.isVisibleAdjuntarDocumento = true;
  }
  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }

  verDetalle(item){
    this.pagoSeleccionado = item.no;

    this.pagoService.GetPagos(item.id)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.filteredDataDetalle = response;
        this.dataDetalle = response;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.pagoService.GetDepositos(item.id)
    .subscribe({
      next: (response) => {
        console.log('Depositos',response);
        this.filteredDataDepositos = response;
        this.dataDepositos = response;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

  }
  buscarPagos(){
    if (this.formBusqueda.valid) {
      this.isLoading = true;
      console.log(this.formBusqueda.value.periodo);
      console.log(this.formBusqueda.value.estatusPagoLote);

      this.pagoLoteService.GetPagoLote(this.formBusqueda.value.periodo,this.formBusqueda.value.estatusPagoLote)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.data = response;
        this.filteredData = response;

        this.dataDepositos = [];
        this.filteredDataDepositos = [];

        this.dataDetalle = [];
        this.filteredDataDetalle = [];
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
      

      /*
            this.btnLoading = true;
            */
    } else {
      
      Object.values(this.formBusqueda.controls).forEach(control => {
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

