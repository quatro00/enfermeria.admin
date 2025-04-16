import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { BancoService } from 'src/app/services/banco.service';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ExcelService } from 'src/app/services/excel.service';
import { TipoEnfermeraService } from 'src/app/services/tipoEnfermera.service';

@Component({
  selector: 'app-colaboradores-registro',
  templateUrl: './colaboradores-registro.component.html',
  styleUrls: ['./colaboradores-registro.component.css'],
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
export class ColaboradoresRegistroComponent {
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
    
      estados: any[] = [];
      tipoEnfermera: any[] = [];
      bancos: any[] = [];

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
        private bancoService: BancoService
      ) { }

  ngOnInit() {

    this.form = this.fb.group({
              nombre: [null, [Validators.required]],
              apellidos: [null, [Validators.required]],
              telefono: [null, [Validators.required]],
              correoElectronico: [null, [Validators.required]],
              rfc: [null, [Validators.required]],
              curp: [null, [Validators.required]],
              cedulaProfesional: [null, [Validators.required]],
              domicilioCalle: [null, [Validators.required]],
              domicilioNumero: [null, [Validators.required]],
              cp: [null, [Validators.required]],
              colonia: [null, [Validators.required]],
              estados: [null, [Validators.required]],
              tipoEnfermera: [null, [Validators.required]],

              banco: [null, [Validators.required]],
              clabe: [null, [Validators.required]],
              cuenta: [null, [Validators.required]],
              
              
            });

    this.loadData();
  }

  loadData() {

    forkJoin([
      this.estadoService.Get(),
      this.tipoEnfermeraService.Get(),
      this.bancoService.Get()
    ]).subscribe({
      next: ([estadosReponse, tipoEnfermeraResponse, bancoResponse]) => {
        this.estados = estadosReponse;
        this.tipoEnfermera = tipoEnfermeraResponse;
        this.bancos = bancoResponse;
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
        rfc: this.form.value.rfc,
        curp: this.form.value.curp,
        cedulaProfesional: this.form.value.cedulaProfesional,
        domicilioCalle: this.form.value.domicilioCalle,
        domicilioNumero: this.form.value.domicilioNumero,
        cp: this.form.value.cp,
        colonia: this.form.value.colonia,
        bancoId: this.form.value.banco,
        clabe: this.form.value.clabe,
        cuenta: this.form.value.cuenta,
        tipoEnfermeraId:this.form.value.tipoEnfermera,
        estados:this.form.value.estados
      }
      
    if (this.form.valid) {
      this.isLoading = true;
      
      this.colaboradorService.Create(request)
      .subscribe({
        next: (response) => {
          this.loadData();
        },
        complete: () => {
          this.isLoading = false;
          this.form.reset();
          this.msg.success('Colaborador creado correctamente');
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
