
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { SharedModule } from '../../shared/shared.module';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgChartsModule  } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { EditorModule } from '@tinymce/tinymce-angular';
import { GoogleMapsModule } from '@angular/google-maps';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdminRoutingModule } from './admin-routing.module';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfectScrollbarModule } from 'ngx-om-perfect-scrollbar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { HotTableModule } from '@handsontable/angular';

import { registerAllModules } from 'handsontable/registry';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CatalogoEstadosComponent } from './catalogo-estados/catalogo-estados.component';
import { CatalogoTipoEnfermeraComponent } from './catalogo-tipo-enfermera/catalogo-tipo-enfermera.component';
import { ServicioRegistroComponent } from './servicio-registro/servicio-registro.component';
import { ReporteServicioComponent } from './reporte-servicio/reporte-servicio.component';
import { ReportePagosComponent } from './reporte-pagos/reporte-pagos.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ColaboradoresRegistroComponent } from './colaboradores-registro/colaboradores-registro.component';
import { ServiciosActivosComponent } from './servicios-activos/servicios-activos.component';
import { PagoRegistroComponent } from './pago-registro/pago-registro.component';
import { ReportePacientesComponent } from './reporte-pacientes/reporte-pacientes.component';
import { PacienteRegistroComponent } from './paciente-registro/paciente-registro.component';
import { ModalPacienteBusquedaComponent } from './components/modal-paciente-busqueda/modal-paciente-busqueda.component';
import { ModalServicioSeleccionfechaComponent } from './components/modal-servicio-seleccionfecha/modal-servicio-seleccionfecha.component';
import { ModalServicioVerOfertasComponent } from './components/modal-servicio-ver-ofertas/modal-servicio-ver-ofertas.component';
import { ReporteGuardiasComponent } from './reporte-guardias/reporte-guardias.component';
import { ModalVerOfertasComponent } from './components/modal-ver-ofertas/modal-ver-ofertas.component';
import { CatalogoEncuestasComponent } from './catalogo-encuestas/catalogo-encuestas.component';
import { CatalogoEncuestasPreguntasComponent } from './catalogo-encuestas-preguntas/catalogo-encuestas-preguntas.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DashboardIndicadoresComponent } from './components/dashboard-indicadores/dashboard-indicadores.component';
import { DashboardGraficaServiciosPorTipoComponent } from './components/dashboard-grafica-servicios-por-tipo/dashboard-grafica-servicios-por-tipo.component';
import { DashboardGraficaPagosComponent } from './components/dashboard-grafica-pagos/dashboard-grafica-pagos.component';
import { DashboardMiniCalendarComponent } from './components/dashboard-mini-calendar/dashboard-mini-calendar.component';
import { DashboardGraficaIngresosComponent } from './components/dashboard-grafica-ingresos/dashboard-grafica-ingresos.component';

const antdModule = [
  HotTableModule.forRoot(),
  NzButtonModule,
  NzModalModule,
  NzPaginationModule,
  NzDropDownModule,
  NzAutocompleteModule,
  AngularSvgIconModule.forRoot(),
  NgChartsModule,
  NgApexchartsModule,
  NzLayoutModule,
  NzGridModule,
  NzSkeletonModule,
  NzAutocompleteModule,
  //FeaturesRoutingModule,
  AdminRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  NzInputModule,
  NzFormModule,
  NzInputNumberModule,
  NzDatePickerModule,
  NzTimePickerModule,
  NzSelectModule,
  NzUploadModule,
  NzCheckboxModule,
  NzRadioModule,
  NzTagModule,
  NzSwitchModule,
  NzSliderModule,
  NzTableModule,
  EditorModule,
  //DashboardModule,
 // AppsModule,
  NzProgressModule,
  NzAvatarModule,
  NzToolTipModule,
  //NzStepsModule,
  GoogleMapsModule,
  NzCalendarModule,
  FullCalendarModule,
  

]


registerAllModules();

@NgModule({
  declarations: [
    DashboardComponent,
    CatalogoEstadosComponent,
    CatalogoTipoEnfermeraComponent,
    ServicioRegistroComponent,
    ReporteServicioComponent,
    ReportePagosComponent,
    ColaboradoresComponent,
    ColaboradoresRegistroComponent,
    ServiciosActivosComponent,
    PagoRegistroComponent,
    ReportePacientesComponent,
    PacienteRegistroComponent,
    ModalPacienteBusquedaComponent,
    ModalServicioSeleccionfechaComponent,
    ModalServicioVerOfertasComponent,
    ReporteGuardiasComponent,
    ModalVerOfertasComponent,
    CatalogoEncuestasComponent,
    CatalogoEncuestasPreguntasComponent,
    DashboardIndicadoresComponent,
    DashboardGraficaServiciosPorTipoComponent,
    DashboardGraficaPagosComponent,
    DashboardMiniCalendarComponent,
    DashboardGraficaIngresosComponent
  ],
  imports: [
    CommonModule,
        SharedModule,
        NzCardModule,
        HttpClientModule,
    ...antdModule
  ],
  providers: [
    ThemeConstantService,
    NzMessageService,
    DatePipe
  ]
})
export class AdminModule { }
