import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DepFlags } from '@angular/core/src/view';

const endpoint = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { };

  public login(name: string, password: string): Observable<any> {
    return this.http.post(endpoint + 'login', {"name": name, "password": password}, this.httpOptions)
  }

  public get_groups(): Observable<any>{
    return this.http.get(endpoint + 'group', this.httpOptions)
  }

}
