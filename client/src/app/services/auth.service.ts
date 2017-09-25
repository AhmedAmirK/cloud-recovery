import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  //private BASE_URL: string = 'http://localhost:3000';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

  login(): Promise<any> {
    let url: string = '/login';
    return this.http.get(url, {headers: this.headers}).map((response)=> response.json()).toPromise();
  }

}
