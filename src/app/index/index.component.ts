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
  public is_playing: Boolean

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

  public go_play_album(album: Album){
    this.is_playing = true;
    this.restService.get_songs(album).subscribe(
      res => {
        this.audioService.setPlaylist(res.songs)
      },
      error => {
        console.log(error)
        this.navigate()
      }
    );
  }

  public go_song(song: Song){
    this.is_playing = true;
    this.audioService.setAudio(song)
  }

  public seek(event:any): void{
    this.audioService.seekAudio(event.target.value)
  }

  public change_volume(event:any): void{
    this.audioService.setVolume(event.target.value)
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
  url: string;
}
