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
  Label:string;
  loaded:boolean;

  constructor(private router: Router, private route: ActivatedRoute, private cloud: CloudService){

    this.machines = [];

    this.loaded = false;

    this.route.params.subscribe((params: Params)=>{

      this.user_id = params['user_id'];

      if(this.user_id){

        localStorage.setItem('user', this.user_id);
        this.fetchServers(this.user_id);

      }
      else {
        this.router.navigate(['login'])
      }

    })
    
  }

  fetchServers(user){
    this.cloud.getServers(user).then((response) => {
         
          this.machines = response.machines;
          this.loaded = true;
          console.log(this.machines);

          if(this.machines.length ==0)
            this.Label = "No Machines Found";

        }).catch((err) => {
          if (err.status == 412){
            this.Label = "Please enter API User and Key in Settings";
            this.loaded = true;
          }
          if (err.status ==400) {
            this.Label = "Please enter valid API in settings";
            this.loaded = true;
          }
        });

    this.machines.forEach((machine)=>{

      if(machine.fullname.indexOf("recovery")!==-1){
        let recovered  = {
          id: machine.id,
          hasRecovery: true
        }
        this.cloud.setRecovery(recovered,this.user_id);
      }

    });
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

    this.cloud.setAPIKey(this.user_id,api).then((response) => {
      
      this.fetchServers(this.user_id);

    }).catch((err) => {
      console.log(err);
    });
  }

  setRecoveryOptions(machine_id){
    this.cloud.setMachineId(machine_id);
    this.router.navigate(['/recovery']);
  }


}

