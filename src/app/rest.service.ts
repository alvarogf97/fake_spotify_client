import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Group, Album, Song } from './index/index.component'

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public endpoint = 'http://localhost:5000/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    withCredentials: true,
  };

  private httpOptionsMP3 = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    withCredentials: true,
    responseType: 'blob' as 'json'
  };

  constructor(private http: HttpClient) { };

  public login(name: string, password: string): Observable<any> {
    return this.http.post(this.endpoint + 'login', {"name": name, "password": password}, this.httpOptions)
  }

  public get_groups(): Observable<any>{
    return this.http.get<Group[]>(this.endpoint + 'group', this.httpOptions)
  }

  public get_albums(group: Group): Observable<any>{
    return this.http.get<Album[]>(this.endpoint + 'group/' + group.name, this.httpOptions)
  }

  public get_songs(album: Album): Observable<any>{
    return this.http.get<Song[]>(this.endpoint + 'group/' + album.group.name + '/' + album.name, this.httpOptions)
  }

  public play_song(song: Song): Observable<any>{
    return this.http.get(this.endpoint + 'group/' + song.album.group.name + '/' + song.album.name + '/' + song.name, this.httpOptionsMP3)
  }

}
