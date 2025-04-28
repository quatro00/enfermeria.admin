import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExcelService } from 'src/app/services/excel.service';
import { ServicioFechaService } from 'src/app/services/serviciofecha.repository';

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
  selector: 'app-reporte-guardias',
  templateUrl: './reporte-guardias.component.html',
  styleUrls: ['./reporte-guardias.component.css']
})
export class ReporteGuardiasComponent {

  isVisible = false;

  isVisibleVerOfertas = false;
  servicioFechaIdSeleccionado:any=null;

  isLoading = true;
  showContent = false;

  data: any[] = [];
  filteredData: any[] = [];
  
  contratoMantenimientoId;
  searchValue = '';

  opcionesEstatus = [
    { id: null, descripcion: 'Todos' },
    { id: 1, descripcion: 'Por asignar' },
    { id: 2, descripcion: 'Asignada' },
    { id: 3, descripcion: 'Completada' },
    { id: 4, descripcion: 'Pagada' },
    { id: 99, descripcion: 'Cancelada' },
  ];

  listOfColumn = [
    {
      title: 'No servicio',
      key: 'no',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
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
      key: 'cantidadHoras',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  formSearch!: UntypedFormGroup;

  constructor(
      private modalService: NzModalService,
      private msg: NzMessageService,
      private router: Router,
      private datePipe: DatePipe,
      private fb: UntypedFormBuilder,
      private excelService: ExcelService,
      private servicioFechaService: ServicioFechaService
    ) { }

  ngOnInit() {

    this.formSearch = this.fb.group({
      noServicio: [null, []],
      estatus: [null, []],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
    });
    this.loadData();
  }

  

  onOfertaSeleccionada(item){
    this.Buscar();
  }

  verOfertas(servicioId: string) {
    this.servicioFechaIdSeleccionado = servicioId;
    this.isVisibleVerOfertas = true;
  }

  cerrarModal() {
    this.isVisible = false;
  }

  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }

  TerminarGuardia(item): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Terminación de guardia</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas terminar la guardia seleccionada?</p>',
      nzOnOk: () => {
        this.servicioFechaService.TerminarOferta(item)
          .subscribe({
            next: (response) => {
              this.Buscar();
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

  DesasignarGuardia(item): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Liberación de guardia</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas liberar la guardia seleccionada?</p>',
      nzOnOk: () => {
        this.servicioFechaService.DesasignarOferta(item)
          .subscribe({
            next: (response) => {
              this.Buscar();
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

  CancelarGuardia(item): void {
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Cancelación de guardia</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas cancelar la guardia seleccionada?</p>',
      nzOnOk: () => {
        this.servicioFechaService.CancelarOferta(item)
          .subscribe({
            next: (response) => {
              this.Buscar();
            },
            complete: () => {
              this.msg.success('Guardia cancelada correctamente.');
            },
            error: () => {
              //this.btnLoading = false;
            }
          })

      }
    });
  }
  Buscar(){
    
    if (this.formSearch.valid) {
      this.isLoading = true;
      

      this.servicioFechaService.GetGuardias(
        this.formSearch.value.noServicio,
        this.formSearch.value.estatus,
        this.formSearch.value.fechaInicio,
        this.formSearch.value.fechaFin,
      )
      .subscribe({
        next: (response) => {
          this.data = response;
          this.filteredData = response;
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

