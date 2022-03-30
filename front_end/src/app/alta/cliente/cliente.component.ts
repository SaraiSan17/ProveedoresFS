import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from 'src/app/services/endpoints.service';

export interface CLIENT {
  id?: number,
  rfc: string,
  social: string,
  direccion: string
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay: string[] = ["rfc", "social","direccion","actions"];
  public CLIENT_DATA: CLIENT[] = [];
  allData = new MatTableDataSource<CLIENT>(this.CLIENT_DATA);
  public newClient = {rfc: "", social: "", direccion:""};

  social = new FormControl('', [ Validators.required]);
  rfc = new FormControl('', [ Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern(/[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/)]);
  direccion = new FormControl('', [ Validators.required]);

  formCli: FormGroup = new FormGroup({
    social: this.social,
    rfc: this.rfc,
    direccion: this.direccion
  });
  usrToShow:any = null;

  

  constructor(private edp: EndpointsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listCliente()
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listCliente(){
    this.CLIENT_DATA = []
    this.edp.listClientes().subscribe(
      doLP => {
        this.CLIENT_DATA = doLP
        
        this.allData.data = this.CLIENT_DATA;
      },
      notDoLP => console.log(notDoLP)
    )
  }

  addClient(){
    if(this.formCli.valid){
      
      const newClientsArray = this.CLIENT_DATA;
      this.newClient.rfc = this.formCli.value.rfc
      this.newClient.social = this.formCli.value.social
      this.newClient.direccion = this.formCli.value.direccion

      this.edp.createCliente({
        rfc: this.formCli.value.rfc,
        razon_social: this.formCli.value.social,
        direccion: this.formCli.value.direccion
      }).subscribe(
        canDo => {
          console.log("Echo", canDo)
          this.listCliente();
          
          this.formCli.reset()
          for (let control in this.formCli.controls) {
            this.formCli.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
        }
      )

      
    }else{
      console.log(':-|', 'Invalid input values..!', this.formCli)
      
    }
  }

  delete(row_obj:any){
    this.CLIENT_DATA = this.CLIENT_DATA.filter((value,key)=>{
      return value.rfc != row_obj.rfc;
    });
    this.allData.data = this.CLIENT_DATA;//refresh tabla
  }

  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getCliente(row_obj.id).subscribe(
      cliente => {
        this.usrToShow = cliente;
        console.log(12,this.usrToShow)
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

  afterC(tipo: String){
    switch(tipo){
      case 'no':
        this.usrToShow = {rfc: "",
          social: "",
          direccion:""
        };
        break;
      case 'yes':
        this.updateClient();
        break;
      
    }
  }

  updateClient(){
    delete this.usrToShow.createdAt;
    delete this.usrToShow.updatedAt; 
    this.edp.updateCliente(this.usrToShow.id,this.usrToShow).subscribe(
      update => {
        console.log(update)
        this.listCliente();
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
      case 'social':
        if (this.social.hasError('required')) {
          info = 'El campo social es requerida';
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
