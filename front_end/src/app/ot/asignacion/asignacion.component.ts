import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from 'src/app/services/endpoints.service';


export interface ASIGNACION {
  id?: number,
  ot: string,
  proyecto: number,
  cliente: number,
  proveedor: number
}


@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {

  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay: string[] = ["ot", "proyecto","cliente","proveedor","actions"];
  public ASIGNACION_DATA: ASIGNACION[] = [];
  allData = new MatTableDataSource<ASIGNACION>(this.ASIGNACION_DATA);
  public newAsign = {id : 0,ot: "", proyecto: 0, cliente:0, proveedor: 0};

  ot = new FormControl('', [ Validators.required]);
  proyecto = new FormControl('', [ Validators.required]);
  cliente = new FormControl('', [ Validators.required]);
  proveedor = new FormControl('', [ Validators.required]);

  asgToShow:any = this.newAsign;

  proys: any = [];
  clients: any = [];
  provs: any = [];

  formAsg: FormGroup = new FormGroup({
    ot: this.ot,
    proyecto: this.proyecto,
    cliente: this.cliente,
    proveedor: this.proveedor
  });

  constructor(private edp: EndpointsService,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listAsignaciones();
    this.getProys();
    this.getClients();
    this.getProvs();
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listAsignaciones(){
    this.ASIGNACION_DATA = []
    this.edp.listAsignacion().subscribe(
      doLP => {
        this.ASIGNACION_DATA = doLP
        
        this.allData.data = this.ASIGNACION_DATA;
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

  getProvs(){
    this.edp.listProveedor().subscribe(
      provs => this.provs = provs,
      notProvs => console.log("Error provs",notProvs)
    )
  }

  addAsign(){
    if(this.formAsg.valid){
      
      this.newAsign.ot = this.formAsg.value.ot
      this.newAsign.proyecto = this.formAsg.value.proyecto
      this.newAsign.cliente = this.formAsg.value.cliente
      this.newAsign.proveedor = this.formAsg.value.proveedor

      this.edp.createAsignacion({
        ot: this.formAsg.value.ot,
        proyecto_id: this.formAsg.value.proyecto,
        cliente_id: this.formAsg.value.cliente,
        users_id: this.formAsg.value.proveedor
      }).subscribe(
        canDo => {
          console.log("Echo", canDo)

          this.listAsignaciones();
          
          this.formAsg.reset()
          for (let control in this.formAsg.controls) {
            this.formAsg.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formAsg)
      
    }
  }

  updateAsign(){
    delete this.asgToShow.createdAt;
    delete this.asgToShow.updatedAt; 
    this.edp.updateAsignacion(this.asgToShow.id,{
      ot: this.asgToShow.ot,
      proyecto_id: this.asgToShow.proyecto,
      cliente_id: this.asgToShow.cliente,
      users_id: this.asgToShow.proveedor
    }).subscribe(
      update => {
        console.log("updaye",update)
        this.listAsignaciones();
      },
      notUpdate => {
        console.log(notUpdate)
      }
    )
  }

  delete(row_obj:any){
    this.ASIGNACION_DATA = this.ASIGNACION_DATA.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    this.allData.data = this.ASIGNACION_DATA;//refresh tabla
  }

  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getAsignacion(row_obj.id).subscribe(
      asign => {
        this.asgToShow = asign;
        console.log(12,this.asgToShow)
        this.open({
          width: '400px',
          hasBackdrop: true,
          disableClose: true
        })
      },
      notCliente => {
        console.log(notCliente)
      }
    )
  }

  open(config?: MatDialogConfig) {
    return this.dialog.open(this.dialogTemplate, config );
  }

  afeterC(tipo: String){
    switch(tipo){
      case 'no':
        this.asgToShow = {id : 0,ot: "", proyecto: 0, cliente:0, proveedor: 0};
        break;
      case 'yes':
        this.updateAsign();
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
      case "u":
        if(this.provs.length > 0){
          let data = this.provs.filter((v:any) =>{
            return v.id == id;
          })
          info = data[0].razon_social;
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
      case 'ot':
        if (this.ot.hasError('required')) {
          info = 'El campo ot es requerido';
        }
        break;
      case 'proyecto':
        if (this.proyecto.hasError('required')) {
          info = 'El campo proyecto es requerida';
        }
        break;
      case 'cliente':
        if (this.cliente.hasError('required')) {
          info = 'El campo cliente es requerida';
        }
        break;
      case 'proveedor':
        if (this.proveedor.hasError('required')) {
          info = 'El campo proveedor es requerida';
        }
        break;
    }
    return info;
  }

}
