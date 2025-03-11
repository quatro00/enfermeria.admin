import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';

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
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent {

  isVisible = false;
  isLoading = true;
  showContent = false;
  
  contratoMantenimientoId;
  searchValue = '';

  tipos:any[]=[];

  data: any[] = [];
  filteredData: any[] = [];

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
      title: 'Teléfono',
      key: 'telefono',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Correo electrónico',
      key: 'correoElectronico',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'RFC',
      key: 'rfc',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'CURP',
      key: 'curp',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Cedula',
      key: 'cedula',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Domicilio',
      key: 'domicilio',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estados',
      key: 'estados',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Activo',
      key: 'activo',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
  ];

   form!: UntypedFormGroup;
  
  
    constructor(
          private modalService: NzModalService,
          private msg: NzMessageService,
          private router: Router,
          private datePipe: DatePipe,
          private fb: UntypedFormBuilder,
          private excelService: ExcelService,
          private tipoEnfermeraService: TipoEnfermeraService,
          private estadoService: EstadoService,
          private colaboradorService: ColaboradorService,
        ) { }
  ngOnInit() {

    this.form = this.fb.group({
                  nombre: [null, []],
                  correoElectronico: [null, []],
                  telefono: [null, []],
                  tipo: [null, []],
                  
                  
                });

    this.loadData();
  }

  cerrarModal() {
    this.isVisible = false;
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

    this.excelService.exportTableToExcel(formattedData,'Colaboradores');
  }

  private applyFilters(): any[] {
      
    return this.data.filter((data2) =>
      data2.no.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.telefono.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.correoElectronico.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.rfc.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.curp.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.cedula.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.domicilio.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.estatus.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }
  
  buscarServicios(){
    let request: any =
      {
        nombre: this.form.value.nombre,
        tipo: this.form.value.tipo.toString(),
        telefono: this.form.value.telefono,
        correoElectronico: this.form.value.correoElectronico,
      }
      
    if (this.form.valid) {
      this.isLoading = true;
      
      this.colaboradorService.GetColaboradores(request)
      .subscribe({
        next: (response) => {
          this.data = response;
        this.filteredData = response;
        },
        complete: () => {
          this.isLoading = false;
          //this.form.reset();
        },
        error: () => {
          this.isLoading = false;
        }
      })

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

  loadData() {

    forkJoin([
          this.tipoEnfermeraService.GetActivos()
        ]).subscribe({
          next: ([tipoEnfermeriaReponse]) => {
            this.tipos = tipoEnfermeriaReponse;
    
            this.form.patchValue({
              tipo: 0
            });
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
}
