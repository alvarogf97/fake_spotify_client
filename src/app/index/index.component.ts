import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  public groups: Group[]

  constructor(private restService: RestService, private router: Router,) { }

  public go_group(group: Group){
    console.log("clicked: " +group)
  }

  ngOnInit() {
    this.restService.get_groups().subscribe(
      res => {
          this.groups = res.groups
          console.log(this.groups)
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

export interface Group {
  name: string;
}

export interface Album {
  name: string;
  group: Group;
}

export interface Song{
  name: string;
  album: Album;
}
