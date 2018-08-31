import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private service: AppService ) {  }

  ngOnInit() {
  }

  /**
   * @description Hide and show password
   */
  hide = true; 

  /**
   * @description email validation
   */
  email = new FormControl('', [Validators.required, Validators.email]); 

  /**
   * @description Password validation
   */
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  
  /**
   * @description Gets mail error message
   */
  getErrorMessage() {
    return this.email.hasError('required') ?
      'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
  }
  
  /**
   * @description Gets password error message
   */
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? "Can't be empty" : this.password.hasError('minlength') ? 'Wrong password' : '';
  }
  
  /**
   * @description Login after validating the data and checking the database whether the user exists or not
   * @param email 
   * @param password 
   */
  secureLogin(email, password) {
    var user = {
      "email": email,
      "password": password
    }
    console.log(user);
    
    this.service.postRequest(user, 'login').subscribe((data: any)  =>  {
      localStorage.setItem('token', data.token);
      // localStorage.setItem('email', data.email);
      //var a = (this.auth.isAuthenticated());
      if (data != 'undefined') {
        if (data.success) {
           this.router.navigate(['home/notes']);
        } else {
          alert(data.msg)
        }
      }
    });
  }

/**
 * @description Navigates to registration page
 */
  register() { 
    this.router.navigate(['registration']);
  }
  
/**
 * @description Navigates to forgot password page
 */
  forgot() {
    this.router.navigate(['forgot']);
  }
}
