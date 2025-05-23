import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authAdminGuard } from 'src/app/guard/auth-admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogoEstadosComponent } from './catalogo-estados/catalogo-estados.component';
import { CatalogoTipoEnfermeraComponent } from './catalogo-tipo-enfermera/catalogo-tipo-enfermera.component';
import { ReportePagosComponent } from './reporte-pagos/reporte-pagos.component';
import { ReporteServicioComponent } from './reporte-servicio/reporte-servicio.component';
import { ServicioRegistroComponent } from './servicio-registro/servicio-registro.component';
import { ColaboradoresRegistroComponent } from './colaboradores-registro/colaboradores-registro.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ServiciosActivosComponent } from './servicios-activos/servicios-activos.component';
import { PagoRegistroComponent } from './pago-registro/pago-registro.component';
import { ReportePacientesComponent } from './reporte-pacientes/reporte-pacientes.component';
import { PacienteRegistroComponent } from './paciente-registro/paciente-registro.component';
import { ReporteGuardiasComponent } from './reporte-guardias/reporte-guardias.component';
import { CatalogoEncuestasComponent } from './catalogo-encuestas/catalogo-encuestas.component';
import { CatalogoEncuestasPreguntasComponent } from './catalogo-encuestas-preguntas/catalogo-encuestas-preguntas.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
        title: 'Dashboard',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'catalogo-estados',
    component: CatalogoEstadosComponent,
    data: {
        title: 'Estados',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'catalogo-tipo-enfermera',
    component: CatalogoTipoEnfermeraComponent,
    data: {
        title: 'Tipo de enfermera',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-pagos',
    component: ReportePagosComponent,
    data: {
        title: 'Reporte de pagos',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'paciente-registro',
    component: PacienteRegistroComponent,
    data: {
        title: 'Registro de paciente',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-servicio',
    component: ReporteServicioComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'catalogo-encuestas',
    component: CatalogoEncuestasComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'catalogo-encuestas-pregunta',
    component: CatalogoEncuestasPreguntasComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-guardias',
    component: ReporteGuardiasComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-colaboradores',
    component: ColaboradoresComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-pacientes',
    component: ReportePacientesComponent,
    data: {
        title: 'Reporte de servicios',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'servicio-registro',
    component: ServicioRegistroComponent,
    data: {
        title: 'Registrar servicio',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'servicios-activos',
    component: ServiciosActivosComponent,
    data: {
        title: 'Servicios activos',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'colaboradores-registro',
    component: ColaboradoresRegistroComponent,
    data: {
        title: 'Registrar colaborador',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'pago-registro',
    component: PagoRegistroComponent,
    data: {
        title: 'Registrar pago',
    },
    //canActivate: [authAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
