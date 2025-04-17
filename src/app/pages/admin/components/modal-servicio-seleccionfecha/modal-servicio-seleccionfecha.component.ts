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
  selector: 'app-modal-servicio-seleccionfecha',
  templateUrl: './modal-servicio-seleccionfecha.component.html',
  styleUrls: ['./modal-servicio-seleccionfecha.component.css']
})
export class ModalServicioSeleccionfechaComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() fechaSeleccionada = new EventEmitter<any>();

  form!: UntypedFormGroup;

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
                fechaInicio: [null, [Validators.required]],
                fechaTermino: [null, [Validators.required]],
                horaInicio: [null, [Validators.required]],
                horaTermino: [null, [Validators.required]],
              });
              this.form.reset();
              
            }

  cerrarModal() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  seleccionarPaciente(paciente: any) {
    this.fechaSeleccionada.emit(paciente);
    this.cerrarModal();
  }

 
  validarFechasYHoras(datos: {
    fechaInicio: string;
    fechaTermino: string;
    horaInicio: string;
    horaTermino: string;
  }) {
    const fechaInicio = datos.fechaInicio;
    const fechaTermino = datos.fechaTermino;
    const horaInicio = datos.horaInicio;
    const horaTermino = datos.horaTermino;
  
    const fechaIni = new Date(fechaInicio);
    const fechaFin = new Date(fechaTermino);
  
    // 1. Validar fechas
    if (fechaIni > fechaFin) {
      return false;
    }
  
    // 2. Si la fecha es la misma, validar horas
      const [hInicio, mInicio] = horaInicio.split(':').map(Number);
      const [hFin, mFin] = horaTermino.split(':').map(Number);
      const totalInicio = hInicio * 60 + mInicio;
      const totalFin = hFin * 60 + mFin;
  
      if (totalInicio > totalFin) {
        return false;
      }
    
  
    return true;
  }

  generarIntervalosPorDia(datos: {
    fechaInicio: string;
    fechaTermino: string;
    horaInicio: string;
    horaTermino: string;
  }) {
    const lista: { fechaInicio: string; fechaTermino: string }[] = [];
    const inicio = new Date(datos.fechaInicio);
    const fin = new Date(datos.fechaTermino);
  
    for (
      let d = new Date(inicio);
      d <= fin;
      d.setDate(d.getDate() + 1)
    ) {
      const fecha = d.toISOString().split("T")[0];
  
      lista.push({
        fechaInicio: `${fecha}T${datos.horaInicio}`,
        fechaTermino: `${fecha}T${datos.horaTermino}`
      });
    }
  
    return lista;
  }

  seleccionarFechas(){
    if (this.form.valid) {
     let fechas ={
      fechaInicio: this.form.value.fechaInicio,
      fechaTermino: this.form.value.fechaTermino,
      horaInicio: this.form.value.horaInicio,
      horaTermino: this.form.value.horaTermino,
     }
      
     if(this.validarFechasYHoras(fechas) === false){
      this.msg.error('La fecha de termino debe ser mayor a la fecha inicial, y la hora de termino debe ser mayor a la hora inicial.');
      return;
     }
     
     let arreglo = this.generarIntervalosPorDia(fechas);
     this.form.reset();
     this.seleccionarPaciente(arreglo);
     
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
