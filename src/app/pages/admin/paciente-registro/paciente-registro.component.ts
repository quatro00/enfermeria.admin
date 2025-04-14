import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { guid } from '@fullcalendar/core/internal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';

@Component({
  selector: 'app-paciente-registro',
  templateUrl: './paciente-registro.component.html',
  styleUrls: ['./paciente-registro.component.css'],
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
    `]
})
export class PacienteRegistroComponent {
isVisible = false;
      isLoading = true;
      isLoadingMdl = false;
      showContent = false;
      editar = false;
      id = '';
    
      contratoMantenimientoId;
      searchValue = '';
      titulo = '';

      contactos: any[] = [];
      data: any[] = [];
      filteredData: any[] = [];
    
      estados: any[] = [];
      tipoEnfermera: any[] = [];

      form!: UntypedFormGroup;
      formContacto!: UntypedFormGroup;

      listOfColumn = [
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
          compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
        },
        {
          title: 'Parentezco',
          key: 'parentezco',
          compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
        },
      ];

      opcionesCompletas = [
        { id: false, descripcion: 'No' },
        { id: true, descripcion: 'Si' },
      ];

      opcionesGenero = [
        { id: 'M', descripcion: 'Masculino' },
        { id: 'F', descripcion: 'Femenino' },
      ];

  constructor(
        private modalService: NzModalService,
        private msg: NzMessageService,
        private router: Router,
        private datePipe: DatePipe,
        private fb: UntypedFormBuilder,
        private excelService: ExcelService,
        private tipoEnfermeraService: TipoEnfermeraService,
        private estadoService: EstadoService,
        private pacienteService: PacienteService,
      ) { }

  ngOnInit() {

    this.form = this.fb.group({
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

    this.loadData();
  }
  cerrarModal (){
    this.isVisible = false;
  }
  agregarContacto(){
    this.isVisible = true;
  }

  borrarContacto(id){
    this.contactos = this.contactos.filter(c => c.id !== id);
  }

  guardarContacto(){
    let request: any =
      {
        id: crypto.randomUUID(),
        nombre: this.formContacto.value.nombre,
        telefono: this.formContacto.value.telefono,
        correoElectronico: this.formContacto.value.correoElectronico,
        parentezco: this.formContacto.value.parentezco,
      }
      
    if (this.formContacto.valid) {
      //this.isLoading = true;
      
      this.contactos.push(request);
      this.contactos = [...this.contactos];
      
      this.formContacto.reset();
      this.isVisible = false;
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
      this.estadoService.Get(),
      this.tipoEnfermeraService.Get()
    ]).subscribe({
      next: ([estadosReponse, tipoEnfermeraResponse]) => {
        this.estados = estadosReponse;
        this.tipoEnfermera = tipoEnfermeraResponse;

        /*
        this.form.patchValue({
          proveedor: 0,
          tipoGrua: 0
        });
        */
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

  guardar(){
    
    let request: any =
      {
        nombre: this.form.value.nombre,
        apellidos: this.form.value.apellidos,
        telefono: this.form.value.telefono,
        correoElectronico: this.form.value.correoElectronico,
        fechaNacimiento: this.form.value.fechaNacimiento,
        genero: this.form.value.genero,
        peso: this.form.value.peso,
        estatura: this.form.value.estatura,
        discapacidad: this.form.value.discapacidad,
        descripcionDiscapacidad: this.form.value.discapacidadDescripcion,
        contactos:  this.contactos.map(({ id, ...resto }) => resto)
      }
      
      
    if (this.form.valid) {
      this.isLoading = true;
      
      this.pacienteService.Crear(request)
      .subscribe({
        next: (response) => {
          this.loadData();
        },
        complete: () => {
          this.isLoading = false;
          this.form.reset();
          this.contactos = [];
          this.contactos = [...this.contactos];
          this.msg.success('Paciente creado correctamente');
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
}
