import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class CloudService {

	//private BASE_URL: string = 'http://localhost:5000';
  private headers: Headers;
  private machine_id;


  constructor(private http: Http) {

    this.headers = new Headers({'Content-Type': 'application/json'});
    

  }


  setMachineId(id){
    this.machine_id = id;
  }

  getMachineId(){
    return this.machine_id;
  }


  setAPIKey(user_id,api){
    let url: string = '/api/'+user_id;
    return this.http.post(url,api,{headers: this.headers}).map((response)=> response.json()).toPromise();
  }

  getServerOptions(user_id){
  	let url :string = '/options/'+ user_id;
  	return this.http.get(url, {headers: this.headers}).map((response)=> response.json()).toPromise();
  }

  setServerOptions(options, user_id){
  	let url :string = '/options/'+ user_id;
  	return this.http.post(url, options, {headers: this.headers}).map((response)=> response.json()).toPromise();
  }

  getServers(user_id){
  	let url: string = '/servers/'+ user_id;
  	return this.http.get(url, {headers: this.headers}).map((response)=> response.json()).toPromise();
  }

 


}
