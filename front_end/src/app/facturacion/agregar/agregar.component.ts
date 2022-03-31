import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  idFac:number = null;

  id = new FormControl('');
  proveedor_id = new FormControl('', [Validators.required]);
  proyecto_id = new FormControl('', [Validators.required]);
  moneda_id = new FormControl('', [Validators.required]);
  folio = new FormControl('', [Validators.required]);
  fecha_factura = new FormControl('', [Validators.required]);
  subtotal = new FormControl('', [Validators.required]);
  iva = new FormControl(16, [Validators.required]);
  total = new FormControl('', [Validators.required]);
  tipo_factura = new FormControl('', [Validators.required]);
  orden_compra = new FormControl('', [Validators.required]);
  requisicion_id = new FormControl('', [Validators.required]);
  comentarios = new FormControl('', [Validators.required]);
  xml = new FormControl('', [Validators.required]);


  formFac: FormGroup = new FormGroup({
    id: this.id,
    proveedor_id: this.proveedor_id,
    proyecto_id: this.proyecto_id,
    moneda_id: this.moneda_id,
    folio: this.folio,
    fecha_factura: this.fecha_factura,
    subtotal: this.subtotal,
    iva: this.iva,
    total: this.total,
    tipo_factura: this.tipo_factura,
    orden_compra: this.orden_compra,
    requisicion_id: this.requisicion_id,
    comentarios: this.comentarios,
    xml: this.xml
  });

  proys: any = [];

  monedas:any = [
    { id:1, clave: "MXN" },
    { id:2, clave: "USD" }
  ];
  
  tFacturas = [
    {val: 1,text: "Factura rectificativa"},
    {val: 2,text: "Factura recapitulativa"},
    {val: 3,text: "Factura proforma"},
    {val: 4,text: "Factura simplificada"},
    {val: 5,text: "Factura electrónica"},
  ]

  proveedores: any = [];
  requisiciones: any = [];

  fileName:any = null;
  fileToUpload:File =null;

  constructor(private edp: EndpointsService, private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
    this.getProys();
    this.getProvs();
    this.getRequisicion();
  }

  onFileSelected(event:any) {
    console.log(event)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.fileToUpload = file;
    }
  }

  addfac(){
    if(this.formFac.valid){
      
      this.edp.createFactura(this.formFac.value).subscribe(
        (        doneR: any) => console.log(doneR),
        (        notR: any) => console.log(notR)
      )
    }else {
      console.log(':-|', 'Invalid input values..!', this.formFac)

    }
  }

  getProys() {
    this.edp.listProyectos().subscribe(
      proys => this.proys = proys,
      notProys => console.log("Error proys", notProys)
    )
  }

  getProvs(){
    this.edp.listProveedor().subscribe(
      proveedores => this.proveedores = proveedores,
      notProvs => console.log("Error proveedores",notProvs)
    )
  }

  getRequisicion(){
    this.edp.listRequisicion().subscribe(
      requisiciones => this.requisiciones = requisiciones,
      notReqs => console.log("Error requisiciones", notReqs)
    )
  }

  getErrorMessage(input: String) {
    let info = ""
    switch (input) {
      case 'proveedor_id':
        if (this.proveedor_id.hasError('required')) {
          info = 'El campo Proveedor es requerido';
        }
        break;
      case 'proyecto_id':
        if (this.proyecto_id.hasError('required')) {
          info = 'El campo Proyecto por es requerido';
        }
        break;
      case 'moneda_id':
        if (this.moneda_id.hasError('required')) {
          info = 'El campo moneda es requerido';
        }
        break;
      case 'folio':
        if (this.folio.hasError('required')) {
          info = 'El campo folio es requerido';
        }
        break;
      case 'fecha_factura':
        if (this.fecha_factura.hasError('required')) {
          info = 'El campo fecha factura es requerido';
        }
        break;
      case 'subtotal':
        if (this.subtotal.hasError('required')) {
          info = 'El campo subtotal es requerido';
        }
        break;
      case 'iva':
        if (this.iva.hasError('required')) {
          info = 'El campo IVA. es requerida';
        }
        break;
      case 'total':
        if (this.total.hasError('required')) {
          info = 'El campo Total es requerida';
        }
        break;
      case 'tipo_factura':
        if (this.tipo_factura.hasError('required')) {
          info = 'El campo Tipo Factura es requerida';
        }
        break;
      case 'orden_compra':
        if (this.orden_compra.hasError('required')) {
          info = 'El campo Orden Compra es requerida';
        }
        break;
      case 'requisicion_id':
        if (this.requisicion_id.hasError('required')) {
          info = 'El campo Requisicion es requerida';
        }
        break;
      case 'comentarios':
        if (this.comentarios.hasError('required')) {
          info = 'El campo Comentarios es requerida';
        }
        break;
      case 'xml':
        if (this.xml.hasError('required')) {
          info = 'El campo XML es requerida';
        }
        break;
    }
    return info;
  }

}
