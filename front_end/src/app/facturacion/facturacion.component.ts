import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from '../services/endpoints.service';

interface FACTURACION {
  id: number
  proveedor_id: number
  proyecto_id: number
  moneda_id: number
  folio: string
  fecha_factura: Date
  subtotal: number
  iva: number
  total: number
  tipo_factura: number
  orden_compra: number
  requisicion_id: number
  comentarios: string
  xml: string
}

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  columnsToDisplay: string[] = ["proyecto", "folio", "frecha_factura", "fecha_ingreso", "subtotal", "iva", "todal", "folio_oc", "importe_oc", "status", "fecha_pago", "comentarios", "actions"];

  FACTURACION_DATA: FACTURACION[] = [];
  allData = new MatTableDataSource<FACTURACION>(this.FACTURACION_DATA);

  proys: any = [];

  estatus = [
    "nOi",
    "Ingresada",
    "Cancelada",
    "Programada",
    "Pagada"
  ]

  constructor(private edp: EndpointsService) { }

  ngOnInit(): void {
    this.listFacturas();
    this.getProys();
  }

  listFacturas() {
    this.FACTURACION_DATA = []
    this.edp.listFactura().subscribe(
      doLP => {
        this.FACTURACION_DATA = doLP

        this.allData.data = this.FACTURACION_DATA;
      },
      notDoLP => console.log(notDoLP)
    )
  }

  getProys() {
    this.edp.listProyectos().subscribe(
      proys => this.proys = proys,
      notProys => console.log("Error proys", notProys)
    )
  }

  delete(row_obj: any) {
    this.FACTURACION_DATA = this.FACTURACION_DATA.filter((value, key) => {
      return value.id != row_obj.id;
    });
    this.allData.data = this.FACTURACION_DATA;//refresh tabla
  }

  getInfo(type: string, id: number) {
    let info = "Información no encontrado";
    switch (type) {
      case "p":
        if (this.proys.length > 0) {
          let data = this.proys.filter((v: any) => {
            return v.id == id;
          })
          info = data[0].clave;
        } else {
          info = "Cargando información"
        }

        break;
    }
    return info;
  }

}
