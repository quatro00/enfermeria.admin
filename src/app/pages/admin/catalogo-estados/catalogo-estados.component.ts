import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-catalogo-estados',
  templateUrl: './catalogo-estados.component.html',
  styleUrls: ['./catalogo-estados.component.css']
})
export class CatalogoEstadosComponent {

  isVisible = false;
  isLoading = true;
  isLoadingMdl = false;
  showContent = false;
  editar = false;
  id = '';

  contratoMantenimientoId;
  searchValue = '';
  titulo = '';

  data: any[] = [];
  filteredData: any[] = [];

  form!: UntypedFormGroup;

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

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private excelService: ExcelService,
    private estadoService: EstadoService,
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      nombre: [null, [Validators.required]],
      nombreCorto: [null, [Validators.required]],
    });

    this.loadData();
  }


  cerrarModal() {
    this.isVisible = false;
  }

  log(isChecked: boolean, itemId: number) {

    let request: any = { id: itemId }

    if (isChecked == false) {

      this.estadoService.Desactivar(request)
        .subscribe({
          next: (response) => {
            //this.loadData();
          }
        })
    }
    else {
      this.estadoService.Activar(request)
        .subscribe({
          next: (response) => {
            //this.loadData();
          }
        })
    }
  }

  private applyFilters(): any[] {
      
    return this.data.filter((data2) =>
      data2.id.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombreCorto.toLowerCase().includes(this.searchValue.toLowerCase()) 
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  loadData() {

    forkJoin([
      this.estadoService.Get()
    ]).subscribe({
      next: ([estadoResponse]) => {
        console.log(estadoResponse);
        this.data = estadoResponse;
        this.filteredData = estadoResponse;
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

  muestraModal() {
    this.form.reset();
    this.titulo = 'Nuevo estado';
    this.isVisible = true;
    this.editar = false;
  }

  editarEstado(item){
    this.id = item.id;
    this.editar = true;
    this.form.patchValue({
      nombre: item.nombre,
      nombreCorto: item.nombreCorto
    });

    this.titulo = 'Editar estado';
    this.isVisible = true;
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

    this.excelService.exportTableToExcel(formattedData,'Estados');
  }

  guardarEstado(): void {
    if (this.form.valid) {
      this.isLoadingMdl = true;
      let request: any =
      {
        nombre: this.form.value.nombre,
        nombreCorto: this.form.value.nombreCorto
      }

      if (this.editar == false) {
        this.estadoService.Create(request)
          .subscribe({
            next: (response) => {
              this.loadData();
            },
            complete: () => {
              this.isLoadingMdl = false;
            },
            error: () => {
              this.isLoadingMdl = false;
            }
          })
      }
      else {
        this.estadoService.Update(this.id, request)
          .subscribe({
            next: (response) => {
              this.loadData();
            },
            complete: () => {
              this.isLoadingMdl = false;
            },
            error: () => {
              this.isLoadingMdl = false;
            }
          })
      }

      /*
            this.btnLoading = true;
            */
    } else {
      Object.values(this.form.controls).forEach(control => {
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
