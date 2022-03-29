import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from 'src/app/services/endpoints.service';

interface objProyecto {
  id?: number,
  clave: string,
  cliente: string,
  monto: string,
  tipo: number,
  ot: string,
}

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;

  
  clave = new FormControl('', [ Validators.required]);
  cliente = new FormControl('', [ Validators.required]);
  monto = new FormControl('', [ Validators.required]);
  ot = new FormControl('', [ Validators.required]);
  tipo = new FormControl('', [ Validators.required]);
  

  formProy: FormGroup = new FormGroup({
    clave: this.clave,
    cliente: this.cliente,
    monto: this.monto,
    ot: this.ot,
    tipo: this.tipo
  });

  columnsToDisplay: string[] = ["clave", "cliente","monto", "tipo","ot","actions"];
  public PROY_DATA: objProyecto[] = [];
  allData = new MatTableDataSource<objProyecto>(this.PROY_DATA);
  proyToShow:any = null;
  public Proyecto = {
    clave: "",
    cliente: "",
    monto: "",
    tipo: 0,
    ot:"",
  };

  tipos = [
    {id: 0, text: "Seleciona"},
    {id: 1, text: "Suministro"},
    {id: 2, text: "MO"},
  ];


  constructor(private edp: EndpointsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listProeyctos()
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  addProyecto(){
    if(this.formProy.valid){
      
      const newProyectosArray = this.PROY_DATA;
      this.Proyecto.clave = this.formProy.value.clave
      this.Proyecto.cliente = this.formProy.value.cliente
      this.Proyecto.monto = this.formProy.value.monto
      this.Proyecto.tipo = this.formProy.value.tipo
      this.Proyecto.ot = this.formProy.value.ot

      this.edp.createProyecto({
        clave: this.formProy.value.clave,
        cliente: this.formProy.value.cliente,
        monto: this.formProy.value.monto,
        tipo: this.formProy.value.tipo,
        ot: this.formProy.value.ot
      }).subscribe(
        canDo => {
          console.log("Echo", canDo)
          this.listProeyctos();
          
          this.formProy.reset()
          for (let control in this.formProy.controls) {
            this.formProy.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formProy)
      
    }
  }

  delete(row_obj:any){
    this.PROY_DATA = this.PROY_DATA.filter((value,key)=>{
      return value.clave != row_obj.clave;
    });
    this.allData.data = [...this.PROY_DATA];//refresh tabla
  }

  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getProyecto(row_obj.id).subscribe(
      user => {
        this.proyToShow = user;
        console.log(12,this.proyToShow)
        this.open({
          width: '400px',
          hasBackdrop: true,
          disableClose: true
        })
      },
      notUser => {
        console.log(notUser)
      }
    )
  }

  open(config?: MatDialogConfig) {
    return this.dialog.open(this.dialogTemplate, config );
  }

  getTipoText(tipoID: number){
    let p = this.tipos.filter(pro => {
      return pro.id == tipoID
    })
    return p[0].text;
  }

  listProeyctos(){
    this.PROY_DATA = []
    this.edp.listProyectos().subscribe(
      doLP => {
        console.log(doLP)
        doLP.forEach((element: { id: any; clave: any; cliente: any; monto: any; tipo: any; ot: any; }) => {
          const newProyectosArray = this.PROY_DATA;
          newProyectosArray.push({
            id: element.id,
            clave: element.clave,
            cliente: element.cliente,
            monto: element.monto,
            tipo: element.tipo,
            ot: element.ot
          });
          this.allData.data = newProyectosArray;
        })
      },
      notDoLP => console.log(notDoLP)
    )
  }

  afeterC(tipo: String){
    switch(tipo){
      case 'no':
        this.proyToShow = {
          clave: "",
          cliente: "",
          monto: "",
          tipo: 0,
          ot:"",
        };
        break;
      case 'yes':
        this.updateProyect();
        break;
      
    }
  }
  
  updateProyect(){
    delete this.proyToShow.createdAt;
    delete this.proyToShow.updatedAt; 
    this.edp.updateProyecto(this.proyToShow.id,this.proyToShow).subscribe(
      update => {
        console.log(update)
        this.listProeyctos()
      },
      notUpdate => {
        console.log(notUpdate)
      }
    )
  }

  getErrorMessage(input: String){
    let info =""
    switch (input) {
      case 'clave':
        if (this.clave.hasError('required')) {
          info = 'El campo rfc es requerido';
        }
        break;
      case 'cliente':
        if (this.cliente.hasError('required')) {
          info = 'El campo cliente es requerida';
        }
        break;
      case 'monto':
        if (this.monto.hasError('required')) {
          info = 'El campo monto es requerida';
        }
        break;
      case 'ot':
        if (this.ot.hasError('required')) {
          info = 'El campo ot es requerida';
        }
        break;
      case 'tipo':
        if (this.tipo.hasError('required')) {
          info = 'El campo tipo es requerida';
        }
        break;
    }
    return info;
  }

}
