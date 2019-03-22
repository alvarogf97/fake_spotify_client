import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public wrong_credentials = false
  public unknown_error = false

  constructor(private restService: RestService, private router: Router,) { }

  ngOnInit() {
    
  }

  logIn(username: string, password: string, event: Event) {
    event.preventDefault(); // Avoid default action for the submit button of the login form
    // Calls service to login user to the api rest
    this.restService.login(username, password).subscribe(
      res => {
        console.log(res)
        if (!res.status){
          console.log("bad credentials")
          this.wrong_credentials = true
          this.unknown_error = false
        }else{
          console.log("welcome " + res.name)
          this.wrong_credentials = false
          this.unknown_error = false
          this.router.navigateByUrl('/index')
        }
      },
      error => {
        console.log(error)
        this.wrong_credentials = false
        this.unknown_error = true
      },
    );
  }

  navigate() {
    this.router.navigateByUrl('/');
  }

}
