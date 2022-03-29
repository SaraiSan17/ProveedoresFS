import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from '../services/endpoints.service';

export interface REQUESICION {
  id?: number,
  numero: string,
  solicitado_por: string,
  liquidacion: number,
  proyecto_id: number,
  fecha_solicitud: Date,
  fecha_requerida: Date,
  autorizado_por: string,
  lugar_entrega: string,
  descripcion: string,
}

@Component({
  selector: 'app-requisicion',
  templateUrl: './requisicion.component.html',
  styleUrls: ['./requisicion.component.css']
})
export class RequisicionComponent implements OnInit {

  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay: string[] = ["proyecto","cliente","proveedor", "comentario","actions"];
  public REQUESICION_DATA: REQUESICION[] = [];
  allData = new MatTableDataSource<REQUESICION>(this.REQUESICION_DATA);
  public newDoc = {id : 0,comentario: "", proyecto: 0, cliente:0, formato: 0};
  fileName:any = null;
  fileToUpload:File =null;
  
  numero = new FormControl('', [ Validators.required]);
  solicitado_por = new FormControl('', [ Validators.required]);
  liquidacion = new FormControl('', [ Validators.required]);
  proyecto_id = new FormControl('', [ Validators.required]);
  fecha_solicitud = new FormControl('', [ Validators.required]);
  fecha_requerida = new FormControl('', [ Validators.required]);
  autorizado_por = new FormControl('', [ Validators.required]);
  lugar_entrega = new FormControl('', [ Validators.required]);
  descripcion = new FormControl('', [ Validators.required]);

  reqToShow:any = this.newDoc;

  proys: any = [];
  clients: any = [];
  forms: any = [];


  constructor(private edp: EndpointsService,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listReqs();
    this.getProys();
    this.getClients();
    this.getFormatos();
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listReqs(){
    this.REQUESICION_DATA = []
    this.edp.listRequisicion().subscribe(
      doLP => {
        this.REQUESICION_DATA = doLP
        
        this.allData.data = this.REQUESICION_DATA;
      },
      notDoLP => console.log(notDoLP)
    )
  }

  getProys(){
    this.edp.listProyectos().subscribe(
      proys => this.proys = proys,
      notProys => console.log("Error proys",notProys)
    )
  }

  getClients(){
    this.edp.listClientes().subscribe(
      clients => this.clients = clients,
      notClients => console.log("Error clients",notClients)
    )
  }

  getFormatos(){
    this.edp.listFormato().subscribe(
      forms => this.forms = forms,
      notProvs => console.log("Error forms",notProvs)
    )
  }

  onFileSelected(event:any) {
    console.log(event)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.fileToUpload = file;
    }
  }

  updateDoc(){
    delete this.reqToShow.createdAt;
    delete this.reqToShow.updatedAt; 
    console.log("sdf",this.reqToShow)
    this.edp.updateRequisicion(this.reqToShow.id,{
      proyecto_id:this.reqToShow.proyecto,
      formato_id:this.reqToShow.formato,
      cliente_id:this.reqToShow.cliente,
      comentarios:this.reqToShow.comentario,
    }).subscribe(
      update => {
        console.log("update",update)
        this.listReqs();
      },
      notUpdate => {
        console.log(notUpdate);
      }
    )
  }

  delete(row_obj:any){
    this.REQUESICION_DATA = this.REQUESICION_DATA.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    this.allData.data = this.REQUESICION_DATA;//refresh tabla
  }

  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getRequisicion(row_obj.id).subscribe(
      req => {
        this.reqToShow.id = req.id;
        this.reqToShow.proyecto = req.proyecto_id;
        this.reqToShow.formato = req.formato_id;
        this.reqToShow.cliente = req.cliente_id;
        this.reqToShow.comentario = req.comentarios ;
        console.log(12,this.reqToShow)
        this.open({
          width: '400px',
          hasBackdrop: true,
          disableClose: true
        })
      },
      notDoc => {
        console.log(notDoc)
      }
    )
  }

  open(config?: MatDialogConfig) {
    return this.dialog.open(this.dialogTemplate, config );
  }

  afeterC(tipo: String){
    switch(tipo){
      case 'no':
        this.reqToShow = {id : 0,ot: "", proyecto: 0, cliente:0, proveedor: 0};
        break;
      case 'yes':
        this.updateDoc();
        break;
      
    }
  }

  getInfo(type: string, id:number){
    let info = "Información no encontrado";
    switch (type) {
      case "p":
        if(this.proys.length > 0){
          let data = this.proys.filter((v:any) =>{
            return v.id == id;
          })
          info = data[0].clave;
        }else {
          info = "Cargando información"
        }
        
        break;
      case "c":
        if(this.clients.length > 0){
          let data = this.clients.filter((v:any) =>{
            return v.id == id;
          })
          info = data[0].razon_social;
        }else {
          info = "Cargando información"
        }
        break;
      case "f":
        if(this.forms.length > 0){
          let data = this.forms.filter((v:any) =>{
            return v.id == id;
          })
          info = data[0].nombre;
        }else {
          info = "Cargando información"
        }
        break;
    }
    return info;
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
