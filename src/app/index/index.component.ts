import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Router} from '@angular/router';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  public groups: Group[]
  public albums: Album[]
  public songs: Song[]
  public song_source: string

  constructor(private restService: RestService, private router: Router, private audioService : AudioService) { }

  public go_group(group: Group){
    this.restService.get_albums(group).subscribe(
      res => {
          this.albums = res.albums
      },
      error => {
        console.log(error)
        this.navigate()
      }
    );
  }

  public go_album(album: Album){
    this.restService.get_songs(album).subscribe(
      res => {
          this.songs = res.songs
      },
      error => {
        console.log(error)
        this.navigate()
      }
    );
  }

  public go_song(song: Song){
    this.song_source = this.restService.endpoint + 'group/' + song.album.group.name + '/' + song.album.name + '/' + song.name
    this.audioService.setAudio(this.song_source)
  }

  ngOnInit() {
    this.restService.get_groups().subscribe(
      res => {
          this.groups = res.groups
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
