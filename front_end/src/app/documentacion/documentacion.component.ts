import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from '../services/endpoints.service';


export interface ASIGNACION {
  id?: number,
  ot: string,
  proyecto: number,
  cliente: number,
  proveedor: number
}

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {

  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay: string[] = ["ot", "proyecto","cliente","proveedor","actions"];
  public ASIGNACION_DATA: ASIGNACION[] = [];
  allData = new MatTableDataSource<ASIGNACION>(this.ASIGNACION_DATA);
  public newDoc = {id : 0,ot: "", proyecto: 0, cliente:0, proveedor: 0};
  fileName:any = null;
  fileToUpload:File =null;
  
  proyecto = new FormControl('', [ Validators.required]);
  formato = new FormControl('', [ Validators.required]);
  cliente = new FormControl('', [ Validators.required]);
  comentario = new FormControl('', [ Validators.required]);
  archivo = new FormControl('', [ Validators.required]);

  docToShow:any = this.newDoc;

  proys: any = [];
  clients: any = [];
  forms: any = [];

  formDoc: FormGroup = new FormGroup({
    proyecto: this.proyecto,
    formato: this.formato,
    cliente: this.cliente,
    comentario: this.comentario,
    archivo :this.archivo
  });
  srcResult: any;

  constructor(private edp: EndpointsService,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listDocs();
    this.getProys();
    this.getClients();
    this.getFormatos();
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listDocs(){
    this.ASIGNACION_DATA = []
    this.edp.listDocumento().subscribe(
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

  getFormatos(){
    this.edp.listFormato().subscribe(
      forms => this.forms = forms,
      notProvs => console.log("Error forms",notProvs)
    )
  }

  addDoc(){
    if(this.formDoc.valid){
      
      this.newDoc.ot = this.formDoc.value.ot
      this.newDoc.proyecto = this.formDoc.value.proyecto
      this.newDoc.cliente = this.formDoc.value.cliente
      this.newDoc.proveedor = this.formDoc.value.proveedor
      const formData = new FormData();
      formData.append('archivo', this.formDoc.get('archivo').value);
      formData.append('proyecto_id', this.formDoc.get('proyecto').value);
      formData.append('formato_id', this.formDoc.get('formato').value);
      formData.append('cliente_id', this.formDoc.get('cliente').value);
      formData.append('comentarios', this.formDoc.get('comentario').value);
      this.edp.createDocumento({
        archivo: this.fileToUpload.name,
        proyecto_id:this.formDoc.get('proyecto').value,
        formato_id:this.formDoc.get('formato').value,
        cliente_id:this.formDoc.get('cliente').value,
        comentarios:this.formDoc.get('comentario').value,
      }, this.fileToUpload).subscribe(
        canDo => {
          console.log("Echo", canDo)

          this.listDocs();
          
          this.formDoc.reset()
          for (let control in this.formDoc.controls) {
            this.formDoc.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formDoc)
      
    }
  }

  onFileSelected(event:any) {
    console.log(event)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      this.fileToUpload = file;
      //this.formDoc.get('archivo').setValue(file.name);
    }
  }

  updateDoc(){
    delete this.docToShow.createdAt;
    delete this.docToShow.updatedAt; 
    this.edp.updateDocumento(this.docToShow.id,{
      ot: this.docToShow.ot,
      proyecto_id: this.docToShow.proyecto,
      cliente_id: this.docToShow.cliente,
      users_id: this.docToShow.proveedor
    }).subscribe(
      update => {
        console.log("update",update)
        this.listDocs();
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
    
    this.edp.getDocumento(row_obj.id).subscribe(
      doc => {
        this.docToShow = doc;
        console.log(12,this.docToShow)
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
        this.docToShow = {id : 0,ot: "", proyecto: 0, cliente:0, proveedor: 0};
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
      case "u":
        if(this.forms.length > 0){
          let data = this.forms.filter((v:any) =>{
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
      case 'proyecto':
        if (this.proyecto.hasError('required')) {
          info = 'El campo proyecto es requerido';
        }
        break;
      case 'formato':
        if (this.formato.hasError('required')) {
          info = 'El campo formato es requerida';
        }
        break;
      case 'cliente':
        if (this.cliente.hasError('required')) {
          info = 'El campo cliente es requerida';
        }
        break;
      case 'comentario':
        if (this.comentario.hasError('required')) {
          info = 'El campo comentario es requerida';
        }
        break;
    }
    return info;
  }

}
