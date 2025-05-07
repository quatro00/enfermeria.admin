import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';

@Component({
  styles: [`
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

  isVisibleDocumentacion = false;
  isVisible = false;
  isLoading = true;
  isLoadingEnviarDocumentacion = false;
  showContent = false;
  item:any;

  contratoMantenimientoId;
  searchValue = '';

  tipos: any[] = [];

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
      key: 'cedulaProfesional',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Domicilio',
      key: 'domicilio',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estados',
      key: 'estadosConcat',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Cuenta Creada',
      key: 'cuentaCreada',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
  ];

  form!: UntypedFormGroup;
  formDocumentacion!: UntypedFormGroup;

  fotografia: File | null = null;
  identificacion: File | null = null;
  comprobanteDeDomicilio: File | null = null;
  titulo: File | null = null;
  cedula: File | null = null;
  contratoFirmado: File | null = null;

  fotografiaTitulo: string = 'Seleccione..';
  identificacionTitulo: string = 'Seleccione..';
  comprobanteDeDomicilioTitulo: string = 'Seleccione..';
  tituloTitulo: string = 'Seleccione..';
  cedulaTitulo: string = 'Seleccione..';
  contratoFirmadofiaTitulo: string = 'Seleccione..';

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
    private colaboradoresService: ColaboradoresService,
  ) { }
  ngOnInit() {

    this.form = this.fb.group({
      nombre: [null, []],
      correoElectronico: [null, []],
      telefono: [null, []],
      tipo: [null, []],
    });

    this.formDocumentacion = this.fb.group({
      fotografia: [null, [Validators.required]],
      titulo: [null, [Validators.required]],
      identificacion: [null, [Validators.required]],
      comprobanteDeDomicilio: [null, [Validators.required]],
      cedulaProfesional: [null, [Validators.required]],
      contratoFirmado: [null, [Validators.required]],

    });

    this.loadData();
  }

  beforeUploadContratoFirmado = (file: File): boolean => {
    this.contratoFirmado = file;
    this.form.get('contratoFirmado')?.setValue(file);
    this.contratoFirmadofiaTitulo = file.name;
    return false; // evita la subida automática
  };

  beforeUploadCedulaProfesional = (file: File): boolean => {
    this.cedula = file;
    this.form.get('cedulaProfesional')?.setValue(file);
    this.cedulaTitulo = file.name;
    return false; // evita la subida automática
  };

  beforeUploadTitulo = (file: File): boolean => {
    this.titulo = file;
    this.form.get('titulo')?.setValue(file);
    this.tituloTitulo = file.name;
    return false; // evita la subida automática
  };

  beforeUploadFotografia = (file: File): boolean => {
    
    this.fotografia = file;
    this.form.get('fotografia')?.setValue(file);
    this.fotografiaTitulo = file.name;
    return false; // evita la subida automática
  };

  beforeUploadIdentificacion = (file: File): boolean => {
    this.identificacion = file;
    this.form.get('identificacion')?.setValue(file);
    this.identificacionTitulo = file.name;
    return false; // evita la subida automática
  };

  beforeUploadComprobanteDeDomicilio = (file: File): boolean => {
    this.comprobanteDeDomicilio = file;
    this.form.get('comprobanteDeDomicilio')?.setValue(file);
    this.comprobanteDeDomicilioTitulo = file.name;
    return false; // evita la subida automática
  };

  cerrarModalDocumentacion() {
    this.isVisibleDocumentacion = false;
  }
  showModalDocumentacion(item) {
    this.item = item;
    this.isLoadingEnviarDocumentacion = false;
    this.formDocumentacion.reset();

    this.fotografia = null;
    this.identificacion = null;
    this.comprobanteDeDomicilio = null;
    this.titulo = null;
    this.cedula = null;
    this.contratoFirmado = null;

    this.fotografiaTitulo = 'Seleccione..';
    this.identificacionTitulo = 'Seleccione..';
    this.comprobanteDeDomicilioTitulo = 'Seleccione..';
    this.tituloTitulo = 'Seleccione..';
    this.cedulaTitulo = 'Seleccione..';
    this.contratoFirmadofiaTitulo = 'Seleccione..';

    this.isVisibleDocumentacion = true;
  }

  cerrarModal() {
    this.isVisible = false;
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

    this.excelService.exportTableToExcel(formattedData, 'Colaboradores');
  }

  private applyFilters(): any[] {

    return this.data.filter((data2) =>
      data2.no.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.telefono.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.correoElectronico.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.rfc.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.curp.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.cedulaProfesional.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.domicilioCalle.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.estatus.toLowerCase().includes(this.searchValue.toLowerCase())
      
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  buscarServicios() {
    let request: any =
    {
      nombre: this.form.value.nombre,
      tipo: this.form.value.tipo.toString(),
      telefono: this.form.value.telefono,
      correoElectronico: this.form.value.correoElectronico,
    }

    if (this.form.valid) {
      this.isLoading = true;

      this.colaboradoresService.GetColaboradores(request)
        .subscribe({
          next: (response) => {
            console.log(response);
            response.forEach(item => {
              // Usa la propiedad `key` para acceder al valor en `item`
              item.domicilio = item.domicilioCalle + ' ' + item.domicilioNumero +', ' + item.colonia;
              item.estadosConcat = item.estados.join(', ')
            });

            console.log(response);
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

  confirmarActivacion(item): void {
    this.item = item;
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Activar colaborador</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas activar al colaborador seleccionado?</p>',
      nzOnOk: () => {
        
        this.colaboradoresService.ActivarColaborador(item.id)
        .subscribe({
          next: (response) => {
            this.msg.success('Colaborador activado correctamente.');
          },
          complete: () => {
            
          },
          error: (err) => {
            //console.log(err);
            this.msg.error('Ocurrio un error al activar el articulo.');
          }
    })
      }
    });
  }

  confirmarCrearCuenta(item): void {
    this.item = item;
    this.modalService.info({
      nzTitle: '<h2 class="text-dark dark:text-white/[.87]"> Crear cuenta colaborador</h2>',
      nzContent: '<p class="text-theme-gray dark:text-white/60">Deseas crear la cuenta al colaborador seleccionado?</p>',
      nzOnOk: () => {
        
        this.colaboradoresService.CrearCuenta(item.id)
        .subscribe({
          next: (response) => {
            this.msg.success('Cuenta creada correctamente.');
          },
          complete: () => {
            
          },
          error: (err) => {
            //console.log(err);
            this.msg.error('Ocurrio un error al crear la cuenta.');
          }
    })
      }
    });
  }

  guardarDocumentacion(){
    var valido = false;

    if(
      this.fotografia != null &&
      this.identificacion != null &&
      this.comprobanteDeDomicilio != null &&
      this.titulo != null &&
      this.cedula != null &&
      this.contratoFirmado != null

    ){
      valido = true;
    }

      const request = new FormData();

      if (this.item) request.append('id', this.item.id);
      if (this.fotografia) request.append('fotografia', this.fotografia);
      if (this.identificacion) request.append('identificacion', this.identificacion);
      if (this.comprobanteDeDomicilio) request.append('comprobanteDeDomicilio', this.comprobanteDeDomicilio);
      if (this.titulo) request.append('titulo', this.titulo);
      if (this.cedula) request.append('cedula', this.cedula);
      if (this.contratoFirmado) request.append('contratoFirmado', this.contratoFirmado);

    if (valido) {
      this.isLoadingEnviarDocumentacion = true;
      
      this.colaboradoresService.EnviarDoccumentacion(request)
      .subscribe({
        next: (response) => {
          this.loadData();
        },
        complete: () => {
          this.isLoadingEnviarDocumentacion = false;
          this.isVisibleDocumentacion = false;
          this.buscarServicios();
          this.msg.success('Documentos guardados correctamente.');
        },
        error: () => {
          this.isLoadingEnviarDocumentacion = false;
        }
      })
      
    } else {
      this.msg.error('Todos los documentos son requeridos.');
    }
  }
}
