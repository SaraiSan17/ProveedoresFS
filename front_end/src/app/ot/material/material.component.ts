import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { EndpointsService } from 'src/app/services/endpoints.service';

interface MATERIAL {
  id?: number,
  clave: string,
  cantidad: string,
  unidad: number,
  descripcion: string,
}

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog')
  dialogTemplate!: TemplateRef<any>;

  columnsToDisplay: string[] = ["clave", "cantidad","unidad", "descripcion","actions"];
  public MAT_DATA: MATERIAL[] = [];
  allData = new MatTableDataSource<MATERIAL>(this.MAT_DATA);
  public Material = {
    clave: "",
    cantidad: "",
    unidad: 0,
    descripcion:"",
  };

  clave = new FormControl('', [ Validators.required]);
  cantidad = new FormControl('', [ Validators.required]);
  unidad = new FormControl('', [ Validators.required]);
  descripcion = new FormControl('', [ Validators.required]);

  formMaterial: FormGroup = new FormGroup({
    clave: this.clave,
    cantidad: this.cantidad,
    unidad: this.unidad,
    descripcion: this.descripcion
  });

  gblMSG = "";
  matToShow: any;
  constructor(private edp: EndpointsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.listMaterial()
  }

  ngAfterViewInit() {
    this.allData.paginator = this.paginator;
  }

  listMaterial(){
    this.MAT_DATA = []
    this.edp.listMaterials().subscribe(
      doLP => {
        console.log(doLP)
        doLP.forEach((element: { id: any; clave: any; cantidad: any; unidad: any; descripcion: any; }) => {
          const newMaterialsArray = this.MAT_DATA;
          newMaterialsArray.push({
            id: element.id,
            clave: element.clave,
            cantidad: element.cantidad,
            unidad: element.unidad,
            descripcion: element.descripcion
          });
          this.allData.data = newMaterialsArray;
        })
      },
      notDoLP => console.log(notDoLP)
    )
  }

  addMaterial(){
    if(this.formMaterial.valid){
      this.gblMSG = "";
      const newMaterialsArray = this.MAT_DATA;
      this.Material.clave = this.formMaterial.value.clave
      this.Material.cantidad = this.formMaterial.value.cantidad
      this.Material.unidad = this.formMaterial.value.unidad
      this.Material.descripcion = this.formMaterial.value.descripcion

      this.edp.createMaterial({
        clave: this.formMaterial.value.clave,
        cantidad: this.formMaterial.value.cantidad,
        unidad: this.formMaterial.value.unidad,
        descripcion: this.formMaterial.value.descripcion
      }).subscribe(
        canDo => {
          console.log("Echo", canDo)
          this.listMaterial();
          
          this.formMaterial.reset()
          for (let control in this.formMaterial.controls) {
            this.formMaterial.controls[control].setErrors(null);
          }
        },
        notDo => {
          console.log(notDo)
          this.gblMSG = notDo.error.message
        }
      )

    }else{
      console.log(':-|', 'Invalid input values..!', this.formMaterial)
      
    }
  }

  delete(row_obj:any){
    this.MAT_DATA = this.MAT_DATA.filter((value,key)=>{
      return value.clave != row_obj.clave;
    });
    this.allData.data = [...this.MAT_DATA];//refresh tabla
  }

  openDialog(row_obj:any): void {
    console.log("Opendialog",row_obj)
    
    this.edp.getMaterial(row_obj.id).subscribe(
      user => {
        this.matToShow = user;
        console.log(12,this.matToShow)
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

  afeterC(tipo: String){
    switch(tipo){
      case 'no':
        this.matToShow = null;
        break;
      case 'yes':
        this.updateMaterial();
        break;
      
    }
  }

  updateMaterial(){
    delete this.matToShow.createdAt;
    delete this.matToShow.updatedAt; 
    this.gblMSG = "";
    this.edp.updateMaterial(this.matToShow.id,this.matToShow).subscribe(
      update => {
        console.log(update)
        this.listMaterial()
        
      },
      notUpdate => {
        console.log(notUpdate);
        this.gblMSG = notUpdate.error.message
      }
    )
  }

  getErrorMessage(input: String){
    let info =""
    switch (input) {
      case 'clave':
        if (this.clave.hasError('required')) {
          info = 'El campo clave es requerido';
        }
        break;
      case 'cantidad':
        if (this.cantidad.hasError('required')) {
          info = 'El campo cantidad es requerida';
        }
        break;
      case 'unidad':
        if (this.unidad.hasError('required')) {
          info = 'El campo unidad es requerida';
        }
        break;
      case 'descripcion':
        if (this.descripcion.hasError('required')) {
          info = 'El campo descripcion es requerido';
        }
        break;
    }
    return info;
  }

}
