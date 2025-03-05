import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalogo-estados',
  templateUrl: './catalogo-estados.component.html',
  styleUrls: ['./catalogo-estados.component.css']
})
export class CatalogoEstadosComponent {

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
      title: 'Nombre',
      key: 'nombre',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Nombre corto',
      key: 'nombreCorto',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
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
