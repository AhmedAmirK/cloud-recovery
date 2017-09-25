import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { CloudService } from './services/cloud.service';
import { RecoveryComponent } from './components/recovery/recovery.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RecoveryComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path:'home/:user_id', component: HomeComponent},
    {path: 'recovery', component: RecoveryComponent},
    { path: '**', redirectTo: 'login' }
    ], { useHash: true })
  ],
  providers: [AuthService, CloudService],
  bootstrap: [AppComponent]
})
export class AppModule { }
