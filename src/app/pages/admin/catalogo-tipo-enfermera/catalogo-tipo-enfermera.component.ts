import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ExcelService } from 'src/app/services/excel.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';

@Component({
  selector: 'app-catalogo-tipo-enfermera',
  templateUrl: './catalogo-tipo-enfermera.component.html',
  styleUrls: ['./catalogo-tipo-enfermera.component.css']
})
export class CatalogoTipoEnfermeraComponent {
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
      title: 'Valor',
      key: 'valor',
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

  constructor(
      private modalService: NzModalService,
      private msg: NzMessageService,
      private router: Router,
      private datePipe: DatePipe,
      private fb: UntypedFormBuilder,
      private excelService: ExcelService,
      private tipoEnfermeraService: TipoEnfermeraService,
    ) { }

  ngOnInit() {
    this.form = this.fb.group({
          no: [null, [Validators.required]],
          descripcion: [null, [Validators.required]],
          valor: [null, [Validators.required]],
          costoHora: [null, [Validators.required]],
        });
    
        this.loadData();
  }

  cerrarModal() {
    this.isVisible = false;
  }

  log(isChecked: boolean, itemId: number) {

    let request: any = { id: itemId }

    if (isChecked == false) {

      this.tipoEnfermeraService.Desactivar(request)
        .subscribe({
          next: (response) => {
            //this.loadData();
          }
        })
    }
    else {
      this.tipoEnfermeraService.Activar(request)
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
      data2.no.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.descripcion.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.valor.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.costoHora.toLowerCase().includes(this.searchValue.toLowerCase()) 
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  loadData() {
  
      forkJoin([
        this.tipoEnfermeraService.Get()
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
      this.titulo = 'Nuevo';
      this.isVisible = true;
      this.editar = false;
    }

    editarItem(item){
      this.id = item.id;
      this.editar = true;
      this.form.patchValue({
        no: item.no,
        descripcion: item.descripcion,
        valor: item.valor,
        costoHora: item.costoHora
      });
  
      this.titulo = 'Editar';
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
  
      this.excelService.exportTableToExcel(formattedData,'TiposDeEnfermera');
    }

    guardar(): void {
      if (this.form.valid) {
        this.isLoadingMdl = true;
        let request: any =
        {
          no: this.form.value.no,
          descripcion: this.form.value.descripcion,
          valor: this.form.value.valor,
          costoHora: this.form.value.costoHora,
        }
  
        if (this.editar == false) {
          this.tipoEnfermeraService.Create(request)
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
          this.tipoEnfermeraService.Update(this.id, request)
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
