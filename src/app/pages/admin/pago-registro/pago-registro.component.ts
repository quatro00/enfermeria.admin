import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ServicioFechaService } from 'src/app/services/serviciofecha.repository';
import { ColaboradoresComponent } from '../colaboradores/colaboradores.component';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { NzAutocompleteOptionComponent } from 'ng-zorro-antd/auto-complete';
import { PagoLoteService } from 'src/app/services/pagolote.service';

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
  selector: 'app-pago-registro',
  templateUrl: './pago-registro.component.html',
  styleUrls: ['./pago-registro.component.css']
})
export class PagoRegistroComponent {
 isVisible = false;

  isVisibleVerOfertas = false;
  servicioFechaIdSeleccionado:any=null;

  isLoading = true;
  isLoadingGenerarPagos = false;
  showContent = false;

  colaboradorId:any;
  colaboradores: any[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  
  contratoMantenimientoId;
  searchValue = '';

  opcionesEstatus = [
    { id: 0, descripcion: 'Todos' },
    { id: 1, descripcion: 'Por asignar' },
    { id: 2, descripcion: 'Asignada' },
    { id: 3, descripcion: 'Completada' },
    { id: 4, descripcion: 'Pagada' },
    { id: 99, descripcion: 'Cancelada' },
  ];

  serviciosSeleccionados = 0;
  totalColaboradores = 0;
  montoBruto = 0;
  comisiones = 0;
  retenciones = 0;
  costoOperativo = 0;
  montoATransferir = 0;

  listOfColumn = [
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Inicio',
      key: 'inicio',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Termino',
      key: 'termino',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Horas',
      key: 'horas',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Importe bruto',
      key: 'importeBruto',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Comision',
      key: 'comision',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Retenciones',
      key: 'retenciones',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Costos operativos',
      key: 'costosOperativos',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Total',
      key: 'total',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatusServicioFecha',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  colaboradorCtrl = new FormControl('');
  formSearch!: UntypedFormGroup;
  formRegistraPago!: UntypedFormGroup;
  opcionesFiltradas$: Observable<{ id: number; nombre: string }[]>;

  constructor(
      private modalService: NzModalService,
      private msg: NzMessageService,
      private router: Router,
      private datePipe: DatePipe,
      private fb: UntypedFormBuilder,
      private excelService: ExcelService,
      private servicioFechaService: ServicioFechaService,
      private colaboradorService: ColaboradoresService,
      private pagoLoteService: PagoLoteService
    ) { 

      
    }

  ngOnInit() {

    this.formSearch = this.fb.group({
      colaborador: [null, []],
      inicio: [null, []],
      termino: [null, []],
    });

    this.formRegistraPago = this.fb.group({
      concepto: [null, [Validators.required]],
      periodoInicio: [null, [Validators.required]],
      periodoFin: [null, [Validators.required]],
    });

    this.formSearch.patchValue({
      estatus: 0
    });

    this.opcionesFiltradas$ = this.formSearch
  .get('colaborador')!.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      /* ⬇️ Si el usuario ya seleccionó un objeto, no dispares búsqueda */
      if (!term || typeof term === 'object') {       // <-- clave
        return of(this.colaboradores);               // devuelve la lista actual
      }

      return this.colaboradorService
        .GetColaboradores({ nombre: term })
        .pipe(
          map(resp => resp.map(o => ({
            ...o,
            nombreCompleto: `${o.nombre} ${o.apellidos}`.trim(),
          }))),
          tap(resp => this.colaboradores = resp),    // cache local
          catchError(() => of([])),
        );
    })
  );
    this.loadData();
  }

  calculaTotales(){

    const activos = this.filteredData.filter(item => item.pago === true);

    this.montoBruto = activos.reduce((acc, item) => acc + item.importeSolicitado, 0);
    this.comisiones = activos.reduce((acc, item) => acc + item.comision, 0);
    this.retenciones = activos.reduce((acc, item) => acc + item.retenciones, 0);
    this.costoOperativo = activos.reduce((acc, item) => acc + item.costoOperativos, 0);
    this.montoATransferir = activos.reduce((acc, item) => acc + item.total, 0);
    this.serviciosSeleccionados = activos.length;
    this.totalColaboradores = new Set(activos.map(item => item.colaborador)).size;
  }
  onSeleccion(event: NzAutocompleteOptionComponent) {  // value contiene el objeto
    const seleccionado = event.nzValue;
    this.colaboradorId = event.nzValue.id;
  }

  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }


  generarPagos(){
    if (this.formRegistraPago.valid) {
      this.isLoadingGenerarPagos = true;
      const activos = this.filteredData.filter(item => item.pago === true);

      var request = {
        concepto: this.formRegistraPago.value.concepto,
        fechaInicio: this.formRegistraPago.value.periodoInicio,
        fechaFin: this.formRegistraPago.value.periodoFin,
        pagos: activos.map(item => item.id)
      }
      
      this.pagoLoteService.Crear(request)
      .subscribe({
        next: (response) => {
          this.loadData();
        },
        complete: () => {
          this.isLoadingGenerarPagos = false;
          this.data = [];
          this.filteredData = [];
          this.calculaTotales();
          this.formRegistraPago.reset();
          
          this.msg.success('Pago creado correctamente.');
        },
        error: (err) => {
          this.isLoadingGenerarPagos = false;
          //this.msg.error(err.error);
        }
      })
    } else {
      
      Object.values(this.formRegistraPago.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
  }

  Buscar(){
    
    if (this.formSearch.valid) {
      this.isLoading = true;
      
      var noColaborador = null;

      try {
        noColaborador = this.formSearch.value.colaborador.split('|')[0];
        const admin = this.colaboradores.find(u => u.no === 'admin');
      } catch (err) {
        noColaborador = null
      }

      this.servicioFechaService.GetServicioFechaFiltros(
        noColaborador,
        null,
        this.formSearch.value.inicio,
        this.formSearch.value.termino,
      )
      .subscribe({
        next: (response) => {
          this.data = response;
          this.filteredData = response;
          this.calculaTotales();
          this.loadData();
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
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

