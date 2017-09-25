import { Component } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent  {

	private id= 1;
	private imagename: string;
	private hostname: string;
	private domain: string;
	private missingfield: boolean;

  constructor(private cloud: CloudService, private router: Router) {

  	//this.id = this.cloud.getMachineId();
  	this.missingfield = false;

  }

  saveRecoverySettings(){

  	if(this.id && this.imagename && this.hostname && this.domain){
  		let options= {
  			'id': this.id,
  			'imagename': this.imagename,
  			'hostname': 'recovery'+this.hostname,
  			'domain': this.domain,
  			'hasRecovery': false
  		}

  		let user_id = localStorage.getItem('user_id')



  		this.cloud.setServerOptions(options,user_id).then(function (response) {
  			console.log(response);
  			this.router.navigate(['/home']);
  		})

  	} else {
  		this.missingfield = true;
  	}


  }


}
