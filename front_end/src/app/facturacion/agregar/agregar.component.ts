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
  xml = new FormControl('');

  status = new FormControl('');
  fecha_pago = new FormControl('');
  comentarios_ext = new FormControl('');


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
    xml: this.xml,
    status: this.status,
    fecha_pago: this.fecha_pago,
    comentarios_ext: this.comentarios_ext,
  });

  proys: any = [];

  monedas:any = [
    { id:1, clave: "MXN" },
    { id:2, clave: "USD" }
  ];
  
  tFacturas = [
    {val: 1,text: "Material"},
    {val: 2,text: "Mano de Obra"}
  ]

  estatus = [
    {id:1, text: "Ingresada"},
    {id:2, text: "Cancelada"},
    {id:3, text: "Programada"},
    {id:4, text: "Pagada"}
  ]

  proveedores: any = [];
  requisiciones: any = [];

  fileName:any = null;
  fileToUpload:File =null;


  
  constructor(private edp: EndpointsService, private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
    this.idFac = this.rutaActiva.snapshot?.params.idFac;
    this.getProys();
    this.getProvs();
    this.getRequisicion();
    this.getFactura();
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
    if(this.idFac == null){
      if(this.formFac.valid){
      
        this.edp.createFactura(this.formFac.value).subscribe(
          (        doneR: any) => console.log(doneR),
          (        notR: any) => console.log(notR)
        )
      }else {
        console.log(':-|', 'Invalid input values..!', this.formFac)
  
      }
    }else {
      this.updateFac();
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

  updateFac(){
    this.edp.updateFactura(this.idFac,{
      proveedor_id: this.formFac.value.proveedor_id,
      proyecto_id: this.formFac.value.proyecto_id,
      moneda_id: this.formFac.value.moneda_id,
      folio: this.formFac.value.folio,
      fecha_factura: this.formFac.value.fecha_factura,
      subtotal: this.formFac.value.subtotal,
      iva: this.formFac.value.iva,
      total: this.formFac.value.total,
      tipo_factura: this.formFac.value.tipo_factura,
      orden_compra: this.formFac.value.orden_compra,
      requisicion_id: this.formFac.value.requisicion_id,
      comentarios: this.formFac.value.comentarios,
      status: this.formFac.value.status,
      fecha_pago: this.formFac.value.fecha_pago,
      comentarios_ext: this.formFac.value.comentarios_ext
    }).subscribe(
      done => console.log("record updated",done),
      fail => console.log("Fail on Update",fail)
    )
  }

  getFactura(){
    if (this.idFac != undefined){
      this.edp.getFactura(this.idFac).subscribe(
        fac => {
          console.log("get fac", fac);

          this.formFac.patchValue({
            id: fac.id,
            proveedor_id: fac.proveedor_id,
            proyecto_id: fac.proyecto_id,
            moneda_id: fac.moneda_id,
            folio: fac.folio,
            fecha_factura: fac.fecha_factura,
            subtotal: fac.subtotal,
            iva: fac.iva,
            total: fac.total,
            tipo_factura: fac.tipo_factura,
            orden_compra: fac.orden_compra,
            requisicion_id: fac.requisicion_id,
            comentarios: fac.comentarios,
            status: fac.status,
            fecha_pago: fac.fecha_pago,
            comentarios_ext: fac.comentarios_ext
          })
        },
        notDoc => {
          console.log(notDoc)
        }
      )
    }
    
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
