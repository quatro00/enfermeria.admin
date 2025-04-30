import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-modal-paciente-busqueda',
  templateUrl: './modal-paciente-busqueda.component.html',
  styleUrls: ['./modal-paciente-busqueda.component.css']
})
export class ModalPacienteBusquedaComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() pacienteSeleccionado = new EventEmitter<any>();

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
      title: 'Peso(kg)',
      key: 'peso',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Estatura(cms)',
      key: 'estatura',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Discapacidad',
      key: 'discapacidad',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    },
    {
      title: 'Desc. discapacidad',
      key: 'estatura',
      compare: (a: any, b: any) => a.importe.localeCompare(b.importe)
    }
  ];

  data: any[] = [];
  filteredData: any[] = [];

  form!: UntypedFormGroup;
  searchValue = '';

  btnLoading = false;
  constructor(
            private modalService: NzModalService,
            private msg: NzMessageService,
            private router: Router,
            private datePipe: DatePipe,
            private fb: UntypedFormBuilder,
            private pacienteService: PacienteService
          ) { }

          ngOnInit() {
          
              this.form = this.fb.group({
                nombreCorreo: [null, []]
              });
          
              
            }

  cerrarModal() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado.emit(paciente);
    this.cerrarModal();
  }

  private applyFilters(): any[] {
      
    return this.data.filter((data2) =>
      data2.no.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.apellidos.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.genero.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.telefono.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.correoElectronico.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.peso.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.estatura.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.discapacidad.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      data2.descripcionDiscapacidad.toLowerCase().includes(this.searchValue.toLowerCase()) 
    );
  }

  filterItems(): void {
    this.filteredData = this.applyFilters();
  }

  buscar(){
    
    if (this.form.valid) {
      this.btnLoading = true;

      this.pacienteService.GetAll(this.form.value.nombreCorreo, '')
      .subscribe({
        next: (response) => {
          //.log(response.result);
          this.data = response.result;
        this.filteredData = response.result;
          //this.loadData();
        },
        complete: () => {
          this.btnLoading = false;
        },
        error: () => {
          this.btnLoading = false;
        }
      })
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
