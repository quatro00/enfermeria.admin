import {
  SideNavInterface
} from '../../interfaces/side-nav.type';

export const AdminRoutes: SideNavInterface[] = [
  
  {
    path: 'administrador/dashboard',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[]
  },
  /*
  {
    path: 'administrador/servicios-activos',
    title: 'Servicios activos',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },
  */
  {
    path: 'administrador/paciente-registro',
    title: 'Registrar paciente',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[]
  },
  {
    path: 'administrador/servicio-registro',
    title: 'Registrar servicio',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[]
  },
  {
    path: 'administrador/colaboradores-registro',
    title: 'Registrar colaborador',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[]
  },
  {
    path: 'administrador/pago-registro',
    title: 'Registrar pago',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[]
  },
  {
    path: 'administrador/reportes',
    title: 'Reportes',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'check',
    submenu:[
      {
        path: 'administrador/reporte-servicio',
        title: 'Servicios',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'check',
        submenu:[]
      },
      {
        path: 'administrador/reporte-guardias',
        title: 'Guardias',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'check',
        submenu:[]
      },
      {
        path: 'administrador/reporte-pacientes',
        title: 'Pacientes',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'check',
        submenu:[]
      },
      {
        path: 'administrador/reporte-colaboradores',
        title: 'Colaboradores',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'check',
        submenu:[]
      },
      {
        path: 'administrador/reporte-pagos',
        title: 'Pagos',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'check',
        submenu:[]
      }]
  },
  {
    path: 'administrador/catalogos',
    title: 'Catalogos',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[
      {
        path: 'administrador/catalogo-tipo-enfermera',
        title: 'Tipos de enfermera',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu:[]
      },
      {
        path: 'administrador/catalogo-estados',
        title: 'Estados',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu:[]
      }]
  },
  {
    path: 'administrador/encuestas',
    title: 'Admin. encuestas',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[
      {
        path: 'administrador/catalogo-encuestas',
        title: 'Encuestas',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu:[]
      },
      {
        path: 'administrador/catalogo-encuestas-pregunta',
        title: 'Preguntas',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu:[]
      }]
  }
]

export const MercaderiaRoutes: SideNavInterface[] = [
  
  {
    path: 'mercaderia/dashboard',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
},
{
  path: 'mercaderia/ordenes-compra',
  title: 'Ordenes de compra',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: '',
  submenu:[]
},
{
  path: 'mercaderia/citas',
  title: 'Citas',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: '',
  submenu:[
    {
      path: 'mercaderia/citas',
      title: 'Agenda',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: '',
      submenu:[]
    },
    {
    path: 'mercaderia/citas/nueva-cita',
    title: 'Registrar cita',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },]
}
]

  export const ClienteRoutes: SideNavInterface[] = [
  
    {
      path: 'cliente/dashboard',
      title: 'Dashboard',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'home',
      submenu:[]
    },
   
]

  export const SupervisorRoutes: SideNavInterface[] = [

    {
      path: 'supervisor/dashboard',
      title: 'Dashboard',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'appstore-add',
      submenu:[]
    },
]
