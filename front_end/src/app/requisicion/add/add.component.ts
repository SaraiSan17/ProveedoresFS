import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointsService } from 'src/app/services/endpoints.service';

interface MATERIAL {
  id?: number,
  clave: string,
  cantidad: string,
  unidad: number,
  descripcion: string,
}

interface MATERIALES extends MATERIAL {
  mcantidad: number,
  mnotas: string
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  @ViewChild('callAPIDialog') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ddd = true;
  numero = new FormControl('', [Validators.required]);
  solicitado_por = new FormControl('', [Validators.required]);
  liquidacion = new FormControl('', [Validators.required]);
  proyecto_id = new FormControl('', [Validators.required]);
  fecha_solicitud = new FormControl({ value: '', readonly: true }, [Validators.required]);
  fecha_requerida = new FormControl({ value: '', readonly: true }, [Validators.required]);
  autorizado_por = new FormControl('', [Validators.required]);
  lugar_entrega = new FormControl('', [Validators.required]);
  descripcion = new FormControl('', [Validators.required]);


  id = new FormControl('', [Validators.required]);
  mClave = new FormControl('', [Validators.required]);
  mDescripcion = new FormControl('', [Validators.required]);
  mUnidad = new FormControl({ value: '', readonly: true }, [Validators.required]);
  mCantidad = new FormControl('', [Validators.required]);
  mNotas = new FormControl('', [Validators.required]);

  busqueda = new FormControl('');

  fgMaterial: FormGroup = new FormGroup({
    id: this.id,
    mClave: this.mClave,
    mDescripcion: this.mDescripcion,
    mUnidad: this.mUnidad,
    mCantidad: this.mCantidad,
    mNotas: this.mNotas
  });
  formReq: FormGroup = new FormGroup({
    numero: this.numero,
    solicitado_por: this.solicitado_por,
    liquidacion: this.liquidacion,
    proyecto_id: this.proyecto_id,
    fecha_solicitud: this.fecha_solicitud,
    fecha_requerida: this.fecha_requerida,
    autorizado_por: this.autorizado_por,
    lugar_entrega: this.lugar_entrega,
    descripcion: this.descripcion
  });

  proys: any = [];
  liqs: any = [
    { id: 1, nombre: "Eléctrica" },
    { id: 2, nombre: "Hidráulica" },
    { id: 3, nombre: "Especiales" }
  ];

  columnsToDisplay: string[] = ["clave", "unidad", "descripcion", "selecionar"];
  columnsToDisplayMTS: string[] = ["mClave", "mDescripcion", "mUnidad", "mCantidad", "mNotas", "acciones"];
  public MAT_DATA: MATERIAL[] = [];
  allData = new MatTableDataSource<MATERIAL>(this.MAT_DATA);

  public MATERIALES_DATA: MATERIALES[] = [];
  allDataMATERIALES = new MatTableDataSource<MATERIALES>(this.MATERIALES_DATA);

  selection = new SelectionModel<MATERIAL>(true, []);

  materiales: Array<MATERIALES> = [];

  constructor(private edp: EndpointsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProys()
  }

  ngAfterViewInit() {

  }

  addReq() {
    if (this.formReq.valid) {
      console.log("Create", this.formReq.value)
      this.edp.createRequisicion(this.formReq.value).subscribe(
        canDo => {
          console.log("Echo", canDo)


        },
        notDo => {
          console.log(notDo)
        }
      )


    } else {
      console.log(':-|', 'Invalid input values..!', this.formReq)

    }
  }

  getProys() {
    this.edp.listProyectos().subscribe(
      proys => this.proys = proys,
      notProys => console.log("Error proys", notProys)
    )
  }

  showMateriales() {

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

        this.open({
          width: '450px',
          hasBackdrop: true,
          disableClose: true
        })
        this.allData.paginator = this.paginator;
      },
      notDoLP => console.log(notDoLP)
    )




  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allData.filter = filterValue.trim().toLowerCase();

    if (this.allData.paginator) {
      this.allData.paginator.firstPage();
    }
  }

  selectMat(row_obj: any) {
    console.log("Material", row_obj)

    this.fgMaterial.patchValue({
      id: row_obj.id,
      mClave: row_obj.clave,
      mDescripcion: row_obj.descripcion,
      mUnidad: row_obj.unidad
    })
    this.dialog.closeAll();
  }

  addMaterial() {
    if (this.fgMaterial.valid) {

      console.log("Agregar", this.fgMaterial.value);
      this.materiales.push(this.fgMaterial.value);
      this.allDataMATERIALES.data = this.materiales;
      console.log("On ADD",this.materiales);
      this.fgMaterial.reset()
      for (let control in this.fgMaterial.controls) {
        this.fgMaterial.controls[control].setErrors(null);
      }
    }
  }

  open(config?: MatDialogConfig) {
    return this.dialog.open(this.dialogTemplate, config);
  }

  deleteMATS(row_obj:any){
    this.MATERIALES_DATA = this.MATERIALES_DATA.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    this.allDataMATERIALES.data = this.MATERIALES_DATA;//refresh tabla

    this.materiales = this.allDataMATERIALES.data;
    console.log("Ondelete ",this.materiales);
  }

  getErrorMessage(input: String) {
    let info = ""
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
      case 'mClave':
        if (this.mClave.hasError('required')) {
          info = 'El campo Clave es requerida';
        }
        break;
      case 'mDescripcion':
        if (this.mDescripcion.hasError('required')) {
          info = 'El campo Descripción es requerida';
        }
        break;
      case 'mUnidad':
        if (this.mUnidad.hasError('required')) {
          info = 'El campo Unidad es requerida';
        }
        break;
      case 'mCantidad':
        if (this.mCantidad.hasError('required')) {
          info = 'El campo Cantidad es requerida';
        }
        break;
      case 'mNotas':
        if (this.mNotas.hasError('required')) {
          info = 'El campo Notas particulares es requerida';
        }
        break;
    }
    return info;
  }

}
