import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogo-tipo-enfermera',
  templateUrl: './catalogo-tipo-enfermera.component.html',
  styleUrls: ['./catalogo-tipo-enfermera.component.css']
})
export class CatalogoTipoEnfermeraComponent {
  isVisible = false;
  isLoading = true;
  showContent = false;
  
  contratoMantenimientoId;
  searchValue = '';

  listOfColumn = [
    {
      title: 'Id',
      key: 'id',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'No',
      key: 'no',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Descripción',
      key: 'descripcion',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Costo por hora',
      key: 'costoHora',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Activo',
      key: 'activo',
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
