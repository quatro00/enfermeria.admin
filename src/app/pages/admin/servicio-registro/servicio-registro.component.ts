import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';
import { TipoLugarService } from 'src/app/services/tipoLugarService';

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
  selector: 'app-servicio-registro',
  templateUrl: './servicio-registro.component.html',
  styleUrls: ['./servicio-registro.component.css']
})
export class ServicioRegistroComponent {
  isVisible = false;
  isVisibleFecha = false;

  isLoading = true;
  showContent = false;

  contratoMantenimientoId;
  searchValue = '';

  form!: UntypedFormGroup;
  formServicio!: UntypedFormGroup;

  estados: any[] = [];
  tipoEnfermera: any[] = [];
  tipoLugar: any[] = [];
  pacienteSeleccionado: any = {};

  data: any[] = [];
  filteredData: any[] = [];

  opcionesSiNo = [
    { id: false, descripcion: 'No' },
    { id: true, descripcion: 'Si' },
  ];

  listOfColumn = [
    {
      title: 'Fecha',
      key: 'fecha'
    },
    {
      title: 'Inicio',
      key: 'inicio'
    },

    {
      title: 'Termino',
      key: 'termino'
    },
    {
      title: 'Horas',
      key: 'horas'
    },

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
    private tipoLugarService: TipoLugarService,
    private servicioService: ServicioService
  ) { }

  ngOnInit() {

    this.formServicio = this.fb.group({
      principalRazon: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      direccion: [null, [Validators.required]],
      requiereAyudaBasica: [null, [Validators.required]], //ok
      requiereAyudaBasicaDesc: [null, [Validators.required]],//ok
      enfermedadDiagnosticada: [null, [Validators.required]],//ok
      enfermedadDiagnosticadaDesc: [null, [Validators.required]],//ok
      tomaMedicamento: [null, [Validators.required]],//ok
      tomaMedicamentoDesc: [null, [Validators.required]],//ok

      dispositivosMedicos: [null, [Validators.required]],//ok
      dispositivosMedicosDesc: [null, [Validators.required]],//ok
      requiereCuraciones: [null, [Validators.required]],//ok
      requiereCuracionesDesc: [null, [Validators.required]],//ok
      requiereMonitoreo: [null, [Validators.required]],//ok
      requiereMonitoreoDesc: [null, [Validators.required]],//ok

      requiereAtencionNeurologica: [null, [Validators.required]],//ok
      requiereAtencionNeurologicaDesc: [null, [Validators.required]],//ok
      cuidadosNocturnos: [null, [Validators.required]],//ok
      cuidadosNocturnosDesc: [null, [Validators.required]],//ok
      requiereCuidadosCriticos: [null, [Validators.required]],//ok
      requiereCuidadosCriticosDesc: [null, [Validators.required]],//ok
      observaciones: [null, [Validators.required]],//ok
      tipoLugar: [null, [Validators.required]],//ok
      tipoEnfermera: [null, [Validators.required]],//ok
    });

    this.form = this.fb.group({
      no: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      correoElectronico: [null, [Validators.required]],
      edad: [null, [Validators.required]],
      genero: [null, [Validators.required]],
      peso: [null, [Validators.required]],
      estatura: [null, [Validators.required]]
    });

    this.loadData();
  }

  guardar() {

    if (this.pacienteSeleccionado.id == null) {
      this.msg.error('Favor de seleccionar un paciente.');
      return;
    }
    let request: any =
    {
      pacienteId: this.pacienteSeleccionado.id,
      motivo: this.formServicio.value.principalRazon,
      estadoId: this.formServicio.value.estado,
      direccion: this.formServicio.value.direccion,
      requiereAyudaBasica: this.formServicio.value.requiereAyudaBasica,
      requiereAyudaBasicaDesc: this.formServicio.value.requiereAyudaBasicaDesc,
      enfermedadDiagnosticada: this.formServicio.value.enfermedadDiagnosticada,
      enfermedadDiagnosticadaDesc: this.formServicio.value.enfermedadDiagnosticadaDesc,
      tomaAlgunMedicamento: this.formServicio.value.tomaMedicamento,
      tomaAlgunMedicamentoDesc: this.formServicio.value.tomaMedicamentoDesc,
      requiereCuraciones: this.formServicio.value.requiereCuraciones,
      requiereCuracionesDesc: this.formServicio.value.requiereCuracionesDesc,
      cuentaConDispositivosMedicos: this.formServicio.value.dispositivosMedicos,
      cuentaConDispositivosMedicosDesc: this.formServicio.value.dispositivosMedicosDesc,
      requiereMonitoreo: this.formServicio.value.requiereMonitoreo,
      requiereMonitoreoDesc: this.formServicio.value.requiereMonitoreoDesc,
      cuidadosNocturnos: this.formServicio.value.cuidadosNocturnos,
      cuidadosNocturnosDesc: this.formServicio.value.cuidadosNocturnosDesc,
      requiereAtencionNeurologica: this.formServicio.value.requiereAtencionNeurologica,
      requiereAtencionNeurologicaDesc: this.formServicio.value.requiereAtencionNeurologicaDesc,
      cuidadosCriticos: this.formServicio.value.requiereCuidadosCriticos,
      cuidadosCriticosDesc: this.formServicio.value.requiereCuidadosCriticosDesc,

      tipoLugarId: this.formServicio.value.tipoLugar,
      tipoEnfermeraId: this.formServicio.value.tipoEnfermera,
      observaciones: this.formServicio.value.observaciones,
      servicioFechasDtos: this.filteredData
    }

    if (this.formServicio.valid) {
      this.isLoading = true;

      this.servicioService.Crear(request)
      .subscribe({
        next: (response) => {
        },
        complete: () => {
          this.isLoading = false;
 /*
          this.formServicio.reset();
          this.form.reset();

          this.filteredData = [];
          this.filteredData = [...this.filteredData];
          */
          this.msg.success('Servicio creado correctamente');
        },
        error: () => {
          this.isLoading = false;
        }
      })

    } else {

      Object.values(this.formServicio.controls).forEach(control => {
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

  muestraModal() {
    this.isVisible = true;
  }

  cerrarModalFecha() {
    this.isVisibleFecha = false;
  }

  muestraModalFecha() {
    this.isVisibleFecha = true;
  }

  borrarFecha(index: number) {
    this.filteredData.splice(index, 1);
    // Si necesitas forzar el cambio en la tabla:
    this.filteredData = [...this.filteredData];
  }

  onFechaSeleccionada(fechas: any) {

    const resultado = fechas.map(item => {
      const inicio = new Date(item.fechaInicio);
      const termino = new Date(item.fechaTermino);

      const fecha = inicio.toISOString().split('T')[0];
      const horaInicio = inicio.toTimeString().substring(0, 5);
      const horaTermino = termino.toTimeString().substring(0, 5);

      const diffMs = termino.getTime() - inicio.getTime();
      const diffHoras = Math.ceil(diffMs / (1000 * 60 * 60)); // redondeo hacia arriba

      return {
        fecha,
        inicio: horaInicio,
        termino: horaTermino,
        horas: diffHoras
      };
    });

    this.filteredData = [...this.filteredData, ...resultado];

  }
  onPacienteSeleccionado(paciente: any) {
    this.pacienteSeleccionado = paciente;

    this.form.patchValue({
      no: this.pacienteSeleccionado.no,
      nombre: this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellidos,
      telefono: this.pacienteSeleccionado.telefono,
      correoElectronico: this.pacienteSeleccionado.correoElectronico,
      genero: this.pacienteSeleccionado.genero,
      peso: this.pacienteSeleccionado.peso,
      estatura: this.pacienteSeleccionado.estatura,
    });
  }


  loadData() {

    this.isLoading = false;
    this.showContent = true;

    forkJoin([
      this.estadoService.Get(),
      this.tipoEnfermeraService.Get(),
      this.tipoLugarService.Get()
    ]).subscribe({
      next: ([estadosReponse, tipoEnfermeraResponse, tipoLugarResponse]) => {
        this.estados = estadosReponse;
        this.tipoEnfermera = tipoEnfermeraResponse;
        this.tipoLugar = tipoLugarResponse;
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
