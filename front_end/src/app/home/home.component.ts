import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  notas = [
    {texto : 'nota 1'}
  ]
  nnota = new FormControl('', [ Validators.required]);
  addNota: FormGroup = new FormGroup({
    nota: this.nnota
  });
  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    if (this.addNota.valid) {
      this.notas.push({texto: this.nnota.value});
      console.log('added')
    }else {
      console.log("Error", this.addNota)
    }
  }

}
