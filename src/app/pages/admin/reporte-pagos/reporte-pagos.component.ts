import { Component } from '@angular/core';

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
  isLoading = true;
  showContent = false;
  
  contratoMantenimientoId;
  searchValue = '';

  listOfColumn = [
    {
      title: 'No',
      key: 'no',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Motivo',
      key: 'motivo',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Fecha',
      key: 'fecha',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Servicios',
      key: 'servicios',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Monto',
      key: 'monto',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Comisión',
      key: 'comision',
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
    }
  ];

  ngOnInit() {
    this.loadData();
  }

  cerrarModal() {
    this.isVisible = false;
  }

  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }
}

