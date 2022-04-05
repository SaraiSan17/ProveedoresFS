import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EndpointsService } from '../services/endpoints.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent  {

  rfc = new FormControl('', [ Validators.required, Validators.maxLength(13), Validators.minLength(13)]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  remember = new FormControl('');

  haveGblMessage = false;
  gblMessage = "";
  constructor(private Auth: AuthService, private routes: Router) { }
  
  form: FormGroup = new FormGroup({
    rfc: this.rfc,
    password: this.password,
    remember: this.remember
  });


  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.Auth.logIn(this.form.get('rfc').value, this.form.get('password').value)
        .then(sucess => {
          console.log("AAA",sucess)
          this.routes.navigate(['/','home']);
        })
        .catch(notDo => {
          console.log("Error login ",notDo);
          this.haveGblMessage = true;
          this.gblMessage = notDo.error.message
        })
      //this.submitEM.emit(this.form.value);
      /*this.edp.login(this.form.value).subscribe(
        canDo => {
          console.log("canDo login",canDo);
          localStorage.setItem('session', canDo.token)
          this.router.navigate(['/','home']);
        },
        notDo => {
          console.log("Error login ",notDo);
          this.haveGblMessage = true;
          this.gblMessage = notDo.error.message
        }
      )*/
      // this.router.navigate(['/', 'home']);
    }else {
      console.log("Error", this.form)
    }
  }

  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();

  getErrorMessage(input: String){
    switch (input) {
      case 'rfc':
        if (this.rfc.hasError('required')) {
          return 'El rfc es requerido';
        }
        if (this.rfc.hasError('minlength') || this.rfc.hasError('maxlength')) {
          return 'El rfc debe ser de 13 carcteres';
        }
        break;
      case 'pwd':
        if (this.rfc.hasError('required')) {
          return 'La contraseña es requerida';
        }
        if (this.rfc.hasError('minlength')) {
          return 'La contraseña debe tener almenos 8 carcteres';
        }
        break;
      default:
        break;
    }
    return '';
  }
}
