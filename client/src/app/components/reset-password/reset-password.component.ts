import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private service: AppService, private router: Router) { }

  ngOnInit() {
  }

  password = new FormControl('', [Validators.required, Validators.minLength(6)]); //Password validation
  repeatPassword = new FormControl('', [Validators.required, Validators.minLength(6)]); //repeat passwo

  /**
   * @description Getting password error message
   */
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? "Can't be empty" :
      this.password.hasError('minlength') ? 'Minimum 6 characters' : 
        '';
  }

  /**
   * @description Getting confirm password error message
   */
  getPasswordMatch() {
      return this.repeatPassword.hasError('required') ? "'Can't be empty" :
        this.repeatPassword.hasError('minlength') ? 'Minimum 6 characters' :
         '';
  }
  /**
   * @description Checking if the entered password and repeat password is same or not then calling api 
   * @param password 
   * @param repeatPassword 
   */
  confirmPassword (password, repeatPassword) {
    console.log(password == repeatPassword);
    var tokenObject = {};
    if(password == repeatPassword){
      this.activatedRoute.params.subscribe((params: Params) => {
        var token = params['token'];
        console.log(token);
        tokenObject = {
          "token":token,
          "password":password
        }
      });
      this.service.postRequest(tokenObject, 'reset').subscribe((data:any) => {
        console.log(data);
        this.router.navigate(['']);
      })
    }
  }

}
