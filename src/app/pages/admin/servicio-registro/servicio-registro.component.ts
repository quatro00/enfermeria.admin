import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';
import { TipoLugarService } from 'src/app/services/tipoLugarService';

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
  selector: 'app-servicio-registro',
  templateUrl: './servicio-registro.component.html',
  styleUrls: ['./servicio-registro.component.css']
})
export class ServicioRegistroComponent {
  isVisible = false;
  isLoading = true;
  showContent = false;
  
  contratoMantenimientoId;
  searchValue = '';

  form!: UntypedFormGroup;
  formServicio!: UntypedFormGroup;

  estados:any[]=[];
  tipoEnfermera:any[]=[];
  tipoLugar:any[]=[];


  opcionesSiNo = [
    { id: false, descripcion: 'No' },
    { id: true, descripcion: 'Si' },
  ];

  listOfColumn = [
    {
      title: 'Fecha',
      key: 'fecha',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Tipo',
      key: 'Tipo',
      compare: (a: any, b: any) => a.noContrato.localeCompare(b.noContrato)
    },
    {
      title: 'Inicio',
      key: 'inicio',
      compare: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion)
    },

    {
      title: 'Termino',
      key: 'termino',
      compare: (a: any, b: any) => a.estatusContratoMantenimientoId.localeCompare(b.estatusContratoMantenimientoId)
    },
    {
      title: 'Horas',
      key: 'horas',
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
          private tipoEnfermeraService: TipoEnfermeraService,
                  private estadoService: EstadoService,
                  private tipoLugarService:TipoLugarService
        ) { }

  ngOnInit() {

    this.formServicio = this.fb.group({
      principalRazon: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      direccion: [null, [Validators.required]],
      requiereAyudaBasica: [null, [Validators.required]], //ok
      requiereAyudaBasicaDesc: [null, [Validators.required]],//ok
      correoElectronico: [null, [Validators.required]],//
      enfermedadDiagnosticiada: [null, [Validators.required]],//ok
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

  cerrarModal() {
    this.isVisible = false;
  }

  muestraModal(){
    this.isVisible = true;
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
