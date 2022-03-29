import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { LoginFormComponent } from './login-form/login-form.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { RequisicionComponent } from './requisicion/requisicion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import { ClienteComponent } from './alta/cliente/cliente.component';
import { ProveedorComponent } from './alta/proveedor/proveedor.component';
import { ProyectoComponent } from './alta/proyecto/proyecto.component';
import { AgregarComponent } from './facturacion/agregar/agregar.component';
import { ConsultarComponent } from './facturacion/consultar/consultar.component';
import { MaterialComponent } from './ot/material/material.component';
import { AsignacionComponent } from './ot/asignacion/asignacion.component';
import { EstatusComponent } from './facturacion/estatus/estatus.component';
import { HomeComponent } from './home/home.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatBadgeModule} from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { JwtTokenInterceptor } from './services/client.service';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { AddComponent } from './Requisicion/add/add.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginFormComponent,
    FacturacionComponent,
    CotizacionComponent,
    RequisicionComponent,
    ClienteComponent,
    ProveedorComponent,
    ProyectoComponent,
    AgregarComponent,
    ConsultarComponent,
    MaterialComponent,
    AsignacionComponent,
    EstatusComponent,
    HomeComponent,
    DocumentacionComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatGridListModule,
    MatExpansionModule,
    ScrollingModule,
    MatBadgeModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
