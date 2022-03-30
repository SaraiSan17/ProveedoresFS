import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { EndpointsService } from '../../services/endpoints.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface objProveedor  {
  id?: number,
  rfc: string,
  social: string,
  direccion: string
};


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  columnsToDisplay: string[] = ["rfc", "social","direccion", "actions"];
  public Proveedor = {
    rfc: "",
    contrasena: "",
    social: "",
    sucursal: "",
    direccion:""
  };
  public PROV_DATA: objProveedor[] = [];
  allData = new MatTableDataSource<objProveedor>(this.PROV_DATA); 
  usrToShow:any = null;
  social = new FormControl('', [ Validators.required]);
  rfc = new FormControl('', [ Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern(/[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/)]);
  direccion = new FormControl('', [ Validators.required]);
  pwd = new FormControl('', [Validators.required, Validators.minLength(8)]);
  sucursal = new FormControl('', [Validators.required]);


  

  formProv: FormGroup = new FormGroup({
    social: this.social,
    rfc: this.rfc,
    direccion: this.direccion,
    pwd: this.pwd,
    sucursal: this.sucursal
  });


  constructor(private edp: EndpointsService,private dialog: MatDialog) {
   
  }

  ngOnInit(): void {
    this.listProveedor()
  }
  
  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listProveedor(){
    this.PROV_DATA = []
    this.edp.listProveedor().subscribe(
      doLP => {
        doLP.forEach((element: {id: any; rfc: any; razon_social: any; direccion: any; }) => {
          const newProveedorsArray = this.PROV_DATA;
          newProveedorsArray.push({
            id: element.id,
            rfc: element.rfc,
            social: element.razon_social,
            direccion: element.direccion});
          this.allData.data = [...newProveedorsArray];
        });
      },
      notDoLP => console.log(notDoLP)
    )
  }

  addProveedor(){
    if(this.formProv.valid){
      
      const newProveedorsArray = this.PROV_DATA;
      this.Proveedor.rfc = this.formProv.value.rfc
      this.Proveedor.social = this.formProv.value.social
      this.Proveedor.direccion = this.formProv.value.direccion

      this.edp.createUser({
        rfc: this.formProv.value.rfc,
        razon_social: this.formProv.value.social,
        direccion: this.formProv.value.direccion,
        sucursal: this.formProv.value.sucursal,
        password: this.formProv.value.pwd
      }).subscribe(
        canDo => {
          console.log("Echo", canDo)
          this.listProveedor();
          
          this.formProv.reset()
          for (let control in this.formProv.controls) {
            this.formProv.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formProv)
      
    }
  }

  delete(row_obj:any){
    this.PROV_DATA = this.PROV_DATA.filter((value,key)=>{
      return value.rfc != row_obj.rfc;
    });
    this.allData.data = [...this.PROV_DATA];//refresh tabla
  }
  
  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getUser(row_obj.id).subscribe(
      user => {
        this.usrToShow = user;
        console.log(12,this.usrToShow)
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

  afterC(tipo: String){
    switch(tipo){
      case 'no':
        this.usrToShow = {
          rfc: "",
          contrasena: "",
          social: "",
          sucursal: "",
          direccion:""
        };
        break;
      case 'yes':
        this.updateUSer();
        break;
      
    }
  }

  updateUSer(){
    delete this.usrToShow.createdAt;
    delete this.usrToShow.updatedAt; 
    this.edp.updateUser(this.usrToShow.id,this.usrToShow).subscribe(
      update => {
        console.log(update)
        this.listProveedor()
      },
      notUpdate => {
        console.log(notUpdate)
      }
    )
  }

  getErrorMessage(input: String){
    let info =""
    switch (input) {
      case 'rfc':
        if (this.rfc.hasError('required')) {
          info = 'El campo rfc es requerido';
        }
        if (this.rfc.hasError('minlength') || this.rfc.hasError('maxlength')) {
          info = 'El campo rfc debe ser de 13 carcteres';
        }
        if (this.rfc.hasError('pattern')) {
          info = 'El formato debe ser con formato XAXX010101000';
        }
        break;
      case 'pwd':
        if (this.pwd.hasError('required')) {
          info = 'El campo contraseña es requerida';
        }
        if (this.pwd.hasError('minlength')) {
          info = 'El campo contraseña debe tener almenos 8 carcteres';
        }
        break;
      case 'social':
        if (this.social.hasError('required')) {
          info = 'El campo social es requerida';
        }
        break;
      case 'sucursal':
        if (this.sucursal.hasError('required')) {
          info = 'El campo sucursal es requerida';
        }
        break;
      case 'direccion':
        if (this.direccion.hasError('required')) {
          info = 'El campo dirección es requerida';
        }
        break;
    }
    return info;
  }

}
