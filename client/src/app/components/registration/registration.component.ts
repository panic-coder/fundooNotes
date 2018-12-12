import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  maxDate = new Date();

  constructor(private service : AppService, private router : Router) { }

  ngOnInit() {
  }
  name = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
  email = new FormControl('', [Validators.required, Validators.email]); //Email validation
  phone = new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12), Validators.minLength(10)]);
  dob = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]); //Password validation
  repeatPassword = new FormControl('', [Validators.required, Validators.minLength(6)]); //repeat password validation

  /**
   * Getting email error message
   */
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  getNameErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a name' :
      this.name.hasError('pattern') ? 'Enter a valid name' :
        '';
  }

  getDateErrorMessage() {
    return this.dob.hasError('required') ? 'You must enter date of birth' :
      '';
  }


  getPhoneErrorMessage() {
    return this.phone.hasError('required') ? 'You must enter a phone number' :
      this.phone.hasError('pattern') ? 'Invalid phone number' :
        this.phone.hasError('minlenth') ? 'Enter a valid phone number' :
          this.phone.hasError('maxlength') ? 'Enter a valid phone number' :
            '';
  }

  /**
   * Getting password error message
   */
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? "Can't be empty" :
      this.password.hasError('minlength') ? 'Minimum 6 characters' : 
        '';
  }

  /**
   * Getting confirm password error message
   */
  getPasswordMatch() {
      return this.repeatPassword.hasError('required') ? "'Can't be empty" :
        this.repeatPassword.hasError('minlength') ? 'Minimum 6 characters' :
         '';
  }

  /**
   * Getting values and sending it to backend
   * @param email 
   * @param password 
   * @param repeatPassword 
   */
   getValues (name, email, phone, dob, password, repeatPassword){
    //console.log(name+" "+email+" "+password+" "+repeatPassword);
    var user = {
      "name":name,
      "email":email,
      "phone":phone,
      "password":password,
      "dob":dob
    }
    console.log(user);
    
    if(password == repeatPassword){
      this.service.postRequest(user,'register').subscribe((data:any) => {
        console.log(data);
        if(data.success){
          this.router.navigate(['']);
        } else {
          alert('Something went wrong');
        }
      })
    } else {
        alert('Failed to match password ')
    }
   }
}
