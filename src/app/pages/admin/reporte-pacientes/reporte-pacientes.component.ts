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
  selector: 'app-reporte-pacientes',
  templateUrl: './reporte-pacientes.component.html',
  styleUrls: ['./reporte-pacientes.component.css']
})
export class ReportePacientesComponent {

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
      title: 'Nombre',
      key: 'nombre',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Apellidos',
      key: 'apellidos',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Sexo',
      key: 'sexo',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Teléfono',
      key: 'telefono',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Correo electrónico',
      key: 'correoElectronico',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Edad',
      key: 'edad',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Fecha de nacimiento',
      key: 'fechaNacimiento',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Peso',
      key: 'peso',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatura',
      key: 'estatura',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Discpacidad',
      key: 'discapacidad',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Descripción',
      key: 'descripcion',
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
