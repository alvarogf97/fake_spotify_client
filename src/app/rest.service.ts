import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Group } from './index/index.component'

const endpoint = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) { };

  public login(name: string, password: string): Observable<any> {
    return this.http.post(endpoint + 'login', {"name": name, "password": password}, this.httpOptions)
  }

  public get_groups(): Observable<any>{
    return this.http.get<Group[]>(endpoint + 'group', this.httpOptions)
  }

}
