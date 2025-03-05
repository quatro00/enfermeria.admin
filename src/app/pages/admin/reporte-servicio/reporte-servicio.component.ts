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
  selector: 'app-reporte-servicio',
  templateUrl: './reporte-servicio.component.html',
  styleUrls: ['./reporte-servicio.component.css']
})
export class ReporteServicioComponent {

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
      title: 'Paciente',
      key: 'paciente',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Sexo',
      key: 'sexo',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Edad',
      key: 'edad',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Peso',
      key: 'peso',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Dirección',
      key: 'direccion',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estado',
      key: 'estado',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Colaborador',
      key: 'colaborador',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Precio sugerido',
      key: 'precioSugerido',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Precio acordado',
      key: 'precioAcordado',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Frecuencia',
      key: 'frecuencia',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Horas',
      key: 'horas',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
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
