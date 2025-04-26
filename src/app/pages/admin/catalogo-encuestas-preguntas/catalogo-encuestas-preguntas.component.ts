import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { EncuestaPlantillaService } from 'src/app/services/encuestaplantilla.service';
import { EncuestaPlantillaPreguntaService } from 'src/app/services/encuestaplantillapregunta.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-catalogo-encuestas-preguntas',
  templateUrl: './catalogo-encuestas-preguntas.component.html',
  styleUrls: ['./catalogo-encuestas-preguntas.component.css']
})
export class CatalogoEncuestasPreguntasComponent {
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

  encuestas: any[] = [];
  SiNo: any[] = [{id:true,descripcion:'Si'}, {id:false,descripcion:'No'}];
  TipoPregunta: any[] = [{id:'Calificacion',descripcion:'Calificación'}, {id:'Texto',descripcion:'Texto'}];

  form!: UntypedFormGroup;
  formNuevaPregunta!: UntypedFormGroup;

  listOfColumn:any[

  ] = [
    {
      title: 'Orden',
      key: 'orden',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Texto',
      key: 'texto',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Tipo',
      key: 'tipo',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Requerida',
      key: 'requerida',
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
    private encuestaPlantillaPreguntaService: EncuestaPlantillaPreguntaService,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      encuesta: [null, [Validators.required]]
    });

    this.formNuevaPregunta = this.fb.group({
      plantillaId: [null, [Validators.required]],
      orden: [null, [Validators.required]],
      texto: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      requerida: [null, [Validators.required]],
      activo: [null, [Validators.required]],
    });

    this.form.get('encuesta')?.valueChanges.subscribe((selectedId: any) => {
      this.buscaPreguntas(selectedId);
    });

    this.loadData();
  }

  buscaPreguntas(id){
    this.encuestaPlantillaPreguntaService.GetAll(id)
    
    .subscribe({
      next: (response) => {
        this.data = response.result;
        this.filteredData = response.result;
        this.loadData();
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
    })

  }
  cerrarModal() {
    this.isVisible = false;
  }

  log(isChecked: boolean, itemId: any) {

    let request: any = { id: itemId }

    if (isChecked == false) {
      this.encuestaPlantillaPreguntaService.Desactivar(itemId)
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
      this.encuestaPlantillaPreguntaService.Reactivar(itemId)
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
        this.encuestas = estadoResponse;
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
    this.formNuevaPregunta.reset();
    this.titulo = 'Nueva pregunta';
    this.isVisible = true;
    this.editar = false;
    this.formNuevaPregunta.get('plantillaId')?.enable();
  }

  editarEstado(item) {
    this.id = item.id;
    this.editar = true;

    console.log(item);
    this.formNuevaPregunta.patchValue({
      plantillaId: this.form.value.encuesta,
      orden: item.orden,
      texto: item.texto,
      tipo: item.tipo,
      requerida: item.requerida,
      activo: item.activo,
    });

    this.formNuevaPregunta.get('plantillaId')?.disable();
    
    this.titulo = 'Editar pregunta';
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
    if (this.formNuevaPregunta.valid) {
      this.isLoadingMdl = true;
      let request: any =
      {
        plantillaId: this.formNuevaPregunta.value.plantillaId,
        orden: this.formNuevaPregunta.value.orden,
        texto: this.formNuevaPregunta.value.texto,
        tipo: this.formNuevaPregunta.value.tipo,
        requerido: this.formNuevaPregunta.value.requerida,
        activo: this.formNuevaPregunta.value.activo
      }

      if (this.editar == false) {
        this.encuestaPlantillaPreguntaService.Crear(request)
          .subscribe({
            next: (response) => {
              this.loadData();
            },
            complete: () => {
              this.msg.success('Pregunta creada correctamente.');
              this.isVisible = false;
              this.isLoadingMdl = false;
              this.buscaPreguntas(this.formNuevaPregunta.value.plantillaId);
            },
            error: () => {
              this.isLoadingMdl = false;
            }
          })
      }
      else {

        request =
      {
        plantillaId: this.form.value.encuesta,
        orden: this.formNuevaPregunta.value.orden,
        texto: this.formNuevaPregunta.value.texto,
        tipo: this.formNuevaPregunta.value.tipo,
        requerido: this.formNuevaPregunta.value.requerida,
        activo: this.formNuevaPregunta.value.activo
      }

        this.encuestaPlantillaPreguntaService.Update(this.id, request)
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
      Object.values(this.formNuevaPregunta.controls).forEach(control => {
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

