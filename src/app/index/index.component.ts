import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private restService: RestService, private router: Router,) { }

  ngOnInit() {
    this.restService.get_groups().subscribe(
      res => {
          console.log(res)
      },
      error => {
        console.log(error)
        this.navigate()
      }
    );
  }

  navigate() {
    this.router.navigateByUrl('/');
  }

}
