import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContactoService } from 'src/app/services/contacto.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PacienteService } from 'src/app/services/paciente.service';

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
  isVisibleEditarContacto = false;
  isVisibleEditarPaciente = false;

  isLoading = true;
  showContent = false;
  btnLoading = false;
  isLoadingEditarContacto = false;
  contacto:any;
  paciente:any;
  
  contratoMantenimientoId;
  searchValue = '';
  titulo = 'Contactos';

  form!: UntypedFormGroup;
  formContacto!: UntypedFormGroup;
  formPaciente!: UntypedFormGroup;

  contactos: any[] = [];
  data: any[] = [];
  filteredData: any[] = [];

  opcionesCompletas = [
    { id: false, descripcion: 'No' },
    { id: true, descripcion: 'Si' },
  ];

  opcionesGenero = [
    { id: 'M', descripcion: 'Masculino' },
    { id: 'F', descripcion: 'Femenino' },
  ];
  
  listOfColumnContactos = [
    {
      title: 'Nombre',
      key: 'nombre',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Teléfono',
      key: 'telefono',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Correo electrónico',
      key: 'correoElectronico',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },
    {
      title: 'Parentezco',
      key: 'parentezco',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    
  ];

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

   constructor(
          private modalService: NzModalService,
          private msg: NzMessageService,
          private router: Router,
          private datePipe: DatePipe,
          private fb: UntypedFormBuilder,
          private excelService: ExcelService,
          private pacienteService: PacienteService,
          private contactoService:ContactoService
        ) { }


  ngOnInit() {

    this.formPaciente = this.fb.group({
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      correoElectronico: [null, [Validators.required]],
      fechaNacimiento: [null, [Validators.required]],
      genero: [null, [Validators.required]],
      peso: [null, [Validators.required]],
      estatura: [null, [Validators.required]],
      discapacidad: [null, [Validators.required]],
      discapacidadDescripcion: [null, [Validators.required]],
    });

    this.formContacto = this.fb.group({
      nombre: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      correoElectronico: [null, [Validators.required]],
      parentezco: [null, [Validators.required]],
    });

     this.form = this.fb.group({
                  nombre: [null, []],
                  correoElectronico: [null, []],
                });

    this.loadData();
  }

  cerrarModalEditarPaciente(){
    this.isVisibleEditarPaciente = false;
  }
  editarPaciente(item){
    this.paciente = item;
    this.formPaciente.reset();
    this.formPaciente.patchValue({
      nombre: item.nombre,
      apellidos: item.apellidos,
      telefono: item.telefono,
      correoElectronico: item.correoElectronico,
      fechaNacimiento:   item.fechaNacimiento.split('T')[0],
      genero: item.genero,
      peso: item.peso,
      estatura: item.estatura,
      discapacidad: item.discapacidad,
      discapacidadDescripcion: item. descripcionDiscapacidad
    });

    this.isVisibleEditarPaciente = true;
  }
  activarContacto(item){
    this.contactoService.Reactivar(item.id)
    .subscribe({
      next: (response) => {
        item.activo = true;
        this.loadData();
      },
      complete: () => {
        this.btnLoading = false;
      },
      error: () => {
        this.btnLoading = false;
      }
    })
  }
  
  editarContacto(item){
    this.contacto = item;
    this.formContacto.patchValue({
      nombre: item.nombre,
      telefono: item.telefono,
      correoElectronico: item.correoElectronico,
      parentezco: item.parentezco
    });

    this.isVisibleEditarContacto = true;
  }

  desactivarContacto(item){
    this.contactoService.Desactivar(item.id)
    .subscribe({
      next: (response) => {
        item.activo = false;
        this.loadData();
      },
      complete: () => {
        this.btnLoading = false;
      },
      error: () => {
        this.btnLoading = false;
      }
    })
  }

  activar(item){
    
    this.pacienteService.Reactivar(item.id)
    .subscribe({
      next: (response) => {
        item.activo = true;
        this.loadData();
      },
      complete: () => {
        this.btnLoading = false;
      },
      error: () => {
        this.btnLoading = false;
      }
    })
  }

  desactivar(item){
    this.pacienteService.Desactivar(item.id)
    .subscribe({
      next: (response) => {
        item.activo = false;
        this.loadData();
      },
      complete: () => {
        this.btnLoading = false;
      },
      error: () => {
        this.btnLoading = false;
      }
    })
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

    this.excelService.exportTableToExcel(formattedData,'Pacientes');
  }

  verContactos(item){
    this.contactoService.GetByPacienteId(item.id)
    .subscribe({
      next: (response) => {
        this.contactos = response.result;
        this.isVisible = true;
      },
      complete: () => {
        this.btnLoading = false;
      },
      error: () => {
        this.btnLoading = false;
      }
    })
  }
  private applyFilters(): any[] {
      
    return this.data.filter((data2) =>
      data2.no.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.apellidos.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.genero.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.telefono.toLowerCase().includes(this.searchValue.toLowerCase()) 
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  guardarPaciente(){
    let request: any =
      {
        id: this.paciente.id,
        nombre: this.formPaciente.value.nombre,
        apellidos: this.formPaciente.value.apellidos,
        telefono: this.formPaciente.value.telefono,
        correoElectronico: this.formPaciente.value.correoElectronico,
        fechaNacimiento: this.formPaciente.value.fechaNacimiento,
        genero: this.formPaciente.value.genero,
        peso: this.formPaciente.value.peso,
        estatura: this.formPaciente.value.estatura,
        discapacidad: this.formPaciente.value.discapacidad,
        descripcionDiscapacidad: this.formPaciente.value.discapacidadDescripcion
      }
      
      
    if (this.formPaciente.valid) {
      this.isLoading = true;
      
      this.pacienteService.Update(this.paciente.id, request)
      .subscribe({
        next: (response) => {
          //this.loadData();
          this.buscar();
          this.isVisibleEditarPaciente = false;
        },
        complete: () => {
          this.isLoading = false;
          this.formPaciente.reset();
          this.msg.success('Paciente actualizado correctamente');
        },
        error: () => {
          this.isLoading = false;
        }
      })

      /*
            this.btnLoading = true;
            */
    } else {
      
      Object.values(this.formPaciente.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
  }
  guardarContacto(){
    let request: any =
      {
        id: this.contacto.id,
        pacienteId: this.contacto.pacienteId,
        nombre:this.formContacto.value.nombre,
        telefono: this.formContacto.value.telefono,
        correoElectronico: this.formContacto.value.correoElectronico,
        parentezco: this.formContacto.value.parentezco,
        activo: this.formContacto.value.activo,
      }
      
    if (this.formContacto.valid) {
      //this.isLoading = true;
      this.contactoService.Update(this.contacto.id, request)
      .subscribe({
        next: (response) => {
          this.formContacto.reset();
          this.isVisibleEditarContacto = false;
          this.isVisible = false;
        },
        complete: () => {
          this.isLoadingEditarContacto = false;
        },
        error: () => {
          this.isLoadingEditarContacto = false;
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

  cerrarModal() {
    this.isVisible = false;
  }

  cerrarModalEditarContacto() {
    this.isVisibleEditarContacto = false;
  }

  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }

  calcularEdad(fecha: Date | string): number {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
  
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
  
    return edad;
  }

  buscar(){
    
    let nombre = this.form.value.nombre;
    let correoElectronico = this.form.value.correoElectronico;
    let request: any =
      {
        nombre: nombre,
        correoElectronico: correoElectronico
      }
      
    if (this.form.valid) {
      this.btnLoading = true;
      
      this.pacienteService.GetAll(nombre, correoElectronico)
      .subscribe({
        next: (response) => {
          console.log(response.result);
          this.data = response.result;
        this.filteredData = response.result;
          this.loadData();
        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
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
}
