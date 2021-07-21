import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { SolarComponent } from './solar/solar.component';
import { CryptoComponent } from './crypto/crypto.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TemperatureComponent } from './temperature/temperature.component'
import { CurriculumVitaeComponent } from './curriculum-vitae/curriculum-vitae.component'
import { GpsComponent } from './gps/gps.component';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'curriculumvitae', component: CurriculumVitaeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'solarproject', component: SolarComponent },
  { path: 'cryptoproject', component: CryptoComponent },
  { path: 'temperatureproject', component: TemperatureComponent },
  { path: 'gpsproject', component: GpsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
