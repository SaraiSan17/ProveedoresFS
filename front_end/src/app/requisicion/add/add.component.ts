import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  ddd = true;
  numero = new FormControl('', [ Validators.required]);
  solicitado_por = new FormControl('', [ Validators.required]);
  liquidacion = new FormControl('', [ Validators.required]);
  proyecto_id = new FormControl('', [ Validators.required]);
  fecha_solicitud = new FormControl({value: '', disabled: true}, [ Validators.required]);
  fecha_requerida = new FormControl({value: '', disabled: true}, [ Validators.required]);
  autorizado_por = new FormControl('', [ Validators.required]);
  lugar_entrega = new FormControl('', [ Validators.required]);
  descripcion = new FormControl('', [ Validators.required]);

  formReq: FormGroup = new FormGroup({
    numero: this.numero,
    solicitado_por: this.solicitado_por,
    liquidacion: this.liquidacion,
    proyecto_id: this.proyecto_id,
    fecha_solicitud: this.fecha_solicitud,
    fecha_requerida: this.fecha_requerida,
    autorizado_por: this.autorizado_por,
    lugar_entrega: this.lugar_entrega,
    descripcion: this.descripcion
  });
  
  proys: any = [];
  liqs: any = [
    {id: 1, nombre: "Eléctrica"},
    {id: 2, nombre: "Hidráulica"},
    {id: 3, nombre: "Especiales"}
  ];

  constructor(private edp: EndpointsService) { }

  ngOnInit(): void {
    this.getProys()
  }

  addReq(){
    if(this.formReq.valid){
      console.log("Create", this.formReq.value)
      this.edp.createRequisicion(this.formReq.value).subscribe(
        canDo => {
          console.log("Echo", canDo)

          
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formReq)
      
    }
  }

  getProys(){
    this.edp.listProyectos().subscribe(
      proys => this.proys = proys,
      notProys => console.log("Error proys",notProys)
    )
  }

  getErrorMessage(input: String){
    let info =""
    switch (input) {
      case 'numero':
        if (this.numero.hasError('required')) {
          info = 'El campo numero es requerido';
        }
        break;
      case 'solicitado_por':
        if (this.solicitado_por.hasError('required')) {
          info = 'El campo solicitado por es requerido';
        }
        break;
      case 'liquidacion':
        if (this.liquidacion.hasError('required')) {
          info = 'El campo liquidacion es requerido';
        }
        break;
      case 'proyecto_id':
        if (this.proyecto_id.hasError('required')) {
          info = 'El campo proyecto es requerido';
        }
        break;
      case 'fecha_solicitud':
        if (this.fecha_solicitud.hasError('required')) {
          info = 'El campo fecha solicitud es requerido';
        }
        break;
      case 'fecha_requerida':
        if (this.fecha_requerida.hasError('required')) {
          info = 'El campo fecha requerida es requerido';
        }
        break;
      case 'autorizado_por':
        if (this.autorizado_por.hasError('required')) {
          info = 'El campo autorizado por es requerida';
        }
        break;
      case 'lugar_entrega':
        if (this.lugar_entrega.hasError('required')) {
          info = 'El campo lugar de entrega es requerida';
        }
        break;
      case 'descripcion':
        if (this.descripcion.hasError('required')) {
          info = 'El campo descripcion es requerida';
        }
        break;
    }
    return info;
  }

}
