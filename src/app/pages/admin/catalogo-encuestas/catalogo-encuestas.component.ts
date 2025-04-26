import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { EncuestaPlantillaService } from 'src/app/services/encuestaplantilla.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-catalogo-encuestas',
  templateUrl: './catalogo-encuestas.component.html',
  styleUrls: ['./catalogo-encuestas.component.css']
})
export class CatalogoEncuestasComponent {
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
      title: 'Descripción',
      key: 'descripcion',
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
    private encuestaPlantillaService: EncuestaPlantillaService,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      nombre: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });

    this.loadData();
  }


  cerrarModal() {
    this.isVisible = false;
  }

  log(isChecked: boolean, itemId: any) {

    let request: any = { id: itemId }

    if (isChecked == false) {
      this.encuestaPlantillaService.Desactivar(itemId)
        .subscribe({
          next: (response) => {
            //this.loadData();
          },
          error:(err)=>{
            this.msg.error(err.error.message);
            this.loadData();
          }
        })
    }
    else {
      this.encuestaPlantillaService.Reactivar(itemId)
        .subscribe({
          next: (response) => {
            this.loadData();
          },
          error:(err)=>{
            this.msg.error(err.error.message);
            this.loadData();
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
      this.encuestaPlantillaService.GetAll()
    ]).subscribe({
      next: ([estadoResponse]) => {

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
    this.titulo = 'Nueva encuesta';
    this.isVisible = true;
    this.editar = false;
  }

  editarEstado(item) {
    this.id = item.id;
    this.editar = true;
    this.form.patchValue({
      nombre: item.nombre,
      descripcion: item.descripcion
    });

    this.titulo = 'Editar encuesta';
    this.isVisible = true;
  }

  exportToExcel() {
    const formattedData = this.filteredData.map(item => {
      const formattedItem = {};
      this.listOfColumn.forEach(column => {
        // Usa la propiedad `key` para acceder al valor en `item`
        formattedItem[column.title] = item[column.key];
      });
      return formattedItem;
    });

    this.excelService.exportTableToExcel(formattedData, 'Encuestas');
  }

  guardarEstado(): void {
    if (this.form.valid) {
      this.isLoadingMdl = true;
      let request: any =
      {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion
      }

      if (this.editar == false) {
        this.encuestaPlantillaService.Crear(request)
          .subscribe({
            next: (response) => {
              this.loadData();
            },
            complete: () => {
              this.msg.success('Plantilla creada correctamente.');
              this.isLoadingMdl = false;
            },
            error: () => {
              this.isLoadingMdl = false;
            }
          })
      }
      else {
        this.encuestaPlantillaService.Update(this.id, request)
          .subscribe({
            next: (response) => {
              this.loadData();
            },
            complete: () => {
              this.isLoadingMdl = false;
              this.isVisible = false;
              this.msg.success('Encuesta modificada correctamente.');
            },
            error: () => {
              this.isLoadingMdl = false;
              this.isVisible = false;
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
