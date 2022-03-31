import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './alta/cliente/cliente.component';
import { ProveedorComponent } from './alta/proveedor/proveedor.component';
import { ProyectoComponent } from './alta/proyecto/proyecto.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { AgregarComponent } from './facturacion/agregar/agregar.component';
import { ConsultarComponent } from './facturacion/consultar/consultar.component';
import { EstatusComponent } from './facturacion/estatus/estatus.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AsignacionComponent } from './ot/asignacion/asignacion.component';
import { MaterialComponent } from './ot/material/material.component';
import { AddComponent } from './Requisicion/add/add.component';
import { RequisicionComponent } from './requisicion/requisicion.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', component: LoginFormComponent },
  
  { path: 'home', component: NavigationComponent,
    children: [ {path: '', component: HomeComponent, canActivate: [AuthGuard]}]
  },

  { path: 'alta', component: NavigationComponent, 
    children: [
    { path: 'cliente', component: ClienteComponent , canActivate: [AuthGuard]},
    { path: 'proveedor', component: ProveedorComponent, canActivate: [AuthGuard] },
    { path: 'proyecto', component: ProyectoComponent, canActivate: [AuthGuard] }]
  },

  { path: 'ot', component: NavigationComponent, 
    children:[
      { path: 'material', component: MaterialComponent, canActivate: [AuthGuard] },
      { path: 'asignacion', component: AsignacionComponent, canActivate: [AuthGuard] }
    ]
  },

  { path: 'facturacion', component: NavigationComponent,
    children: [
      { path: 'agregar', component: AgregarComponent, canActivate: [AuthGuard] },
      { path: 'consultar', component: ConsultarComponent, canActivate: [AuthGuard] },
      { path: 'estatus', component: EstatusComponent , canActivate: [AuthGuard]},
    ]
  },
  
  { path: 'doc', component: NavigationComponent,
    children: [ 
      { path: '', component: DocumentacionComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: 'requisicion', component: NavigationComponent, 
    children: [ 
      { path: '', component: RequisicionComponent, canActivate: [AuthGuard] },
      { path: 'agregar', component: AddComponent, canActivate: [AuthGuard] },
      { path: ':idReq', component: AddComponent, canActivate: [AuthGuard] },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes, )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
