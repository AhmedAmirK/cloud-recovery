import { Component } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { Router,ActivatedRoute, Params  } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './hero-slider-style.css', './tooplate-style.css', './magnific-popup.css', './bootstrap.min.css']
})

export class HomeComponent  {

  machines: any[];
  settings: boolean = false;
  username: string;
  user_id: any;
  nav: string[] = ["machines","settings"];
  APIUser: string;
  APIKey:string;

  constructor(private router: Router, private route: ActivatedRoute, private cloud: CloudService){

    this.machines = [];

    this.route.params.subscribe((params: Params)=>{

      this.user_id = params['user_id'];

      if(this.user_id){

        localStorage.setItem('user', this.user_id);
        this.cloud.getServers(this.user_id).then(function(response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        })
      }
      else {
        this.router.navigate(['login'])
      }

    })
    

  }

  controlNav(view:string){
    switch (view) {
      case "settings":
        this.settings = true;
        break;
      case "machines":
        this.settings = false;
        break;
      default:
        alert('Something went wrong')
        break;
    }
  }

  saveAPIKey(){
    let api = {
      'user': this.APIUser,
      'key': this.APIKey
    };

    this.APIUser = "";
    this.APIKey = "";

    this.cloud.setAPIKey(this.user_id,api).then(function (response) {
      console.log(response);

    }).catch(function (err) {
      console.log(err);
    });
  }

  setRecoveryOptions(machine_id){
    this.cloud.setMachineId(machine_id);
    this.router.navigate(['/recovery']);
  }


}

