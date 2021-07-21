import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input, SimpleChanges } from '@angular/core';
import { NavbarSharedService } from '../services/navbar-shared.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavMenuComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();

  toggledSolar: boolean = false;

  activeItemCV: string = "none";
  activeItemSolar: string = "none";
  activeItemHome: string = "none";
  activeItemCrypto : string = "none";
  activeItemTemperature : string = "none";
  activeItemGPS: string = "none";

  pageName: string = null;
  pathString: string = null;


  constructor(private _navbarSharedService: NavbarSharedService,
    private router: Router) { }

  ngOnInit() {
    this._navbarSharedService.currentPage.subscribe((page) => {
      this.pageName = page;
      
      //console.log("Sidenav: " + this.pageName);

      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          this.pathString = e.url.toString();
          if (this.pathString == "/") {
            this.pathString = "home";
          }
          else {
            this.pathString = this.pathString.substring(1);
          }
          //console.log("URL: " + this.pathString);

          //console.log("Toolbar 1: " + this.pageName);

          if (this.pageName != this.pathString) {
            switch (this.pathString) {

              case "curriculumvitae" :
                this.setActiveItemCV('curriculumvitae');
                break;

              case "solarproject":
                this.setActiveItemSolar('solarproject');
                //console.log("Inside switch 1: " + this.pathString);
                break;

              case "cryptoproject":
                this.setActiveItemCrypto('cryptoproject');
                //console.log("Inside switch 2: " + this.pathString);
                break;

              case "temperatureproject":
                this.setActiveItemTemperature('temperatureproject');
                //console.log("Inside switch 3: " + this.pathString);
                break;

                case "gpsproject":
                this.setActiveItemGPS('gpsproject');
                //console.log("Inside switch 3: " + this.pathString);
                break;

              default:
                this.setHome('home');
                //console.log("Inside default: " + this.pathString);
                break;

            }
          }
          else {
            switch (this.pageName) {

              case "curriculumvitae" :
                this.setActiveItemCV('curriculumvitae');
                break;

              case "solarproject":
                this.setActiveItemSolar('solarproject');
                //console.log("Inside switch 1: " + this.pageName);
                break;

              case "cryptoproject":
                this.setActiveItemCrypto('cryptoproject');
                //console.log("Inside switch 2: " + this.pageName);
                break;

              case "temperatureproject":
                this.setActiveItemTemperature('temperatureproject');
                //console.log("Inside switch 3: " + this.pageName);
                break;

                case "gpsproject":
                this.setActiveItemGPS('gpsproject');
                //console.log("Inside switch 3: " + this.pathString);
                break;

              default:
                this.setHome('home');
                //console.log("Inside default: " + this.pageName);
                break;

            }
          }
        }
      });

    });
  }



  public onSidenavClose = () => {
    this.sidenavClose.emit();
    this.toggledSolar = false;
  }


  setActiveItemSolar(page: string) {
    this.onSidenavClose();
    this.activeItemSolar = page;
    if (page == "solarproject") {
      this.activeItemCrypto = "none";
      this.activeItemHome = "none";
      this.activeItemTemperature = "none";
      this.activeItemCV = "none";
      this.activeItemGPS = "none";
    }
    //console.log(this.activeItemSolar);
  }


  setActiveItemCrypto(page: string) {
    this.onSidenavClose();
    this.activeItemCrypto = page;
    if (page == "cryptoproject") {
      this.activeItemSolar = "none";
      this.activeItemHome = "none";
      this.activeItemTemperature = "none";
      this.activeItemCV = "none";
      this.activeItemGPS = "none";
    }
    //console.log(this.activeItemTemp);
  }

  setActiveItemTemperature(page: string) {
    this.onSidenavClose();
    this.activeItemTemperature = page;
    if (page == "temperatureproject") {
      this.activeItemSolar = "none";
      this.activeItemHome = "none";
      this.activeItemCrypto = "none";
      this.activeItemCV = "none";
      this.activeItemGPS = "none";
    }
    //console.log(this.activeItemTemp);
  }

  setActiveItemCV(page: string) {
    this.onSidenavClose();
    this.activeItemCV = page;
    if (page == "curriculumvitae") {
      this.activeItemSolar = "none";
      this.activeItemHome = "none";
      this.activeItemCrypto = "none";
      this.activeItemTemperature = "none";
      this.activeItemGPS = "none";
    }
    //console.log(this.activeItemTemp);
  }

  setActiveItemGPS(page: string) {
    this.onSidenavClose();
    this.activeItemGPS = page;
    if (page == "gpsproject") {
      this.activeItemSolar = "none";
      this.activeItemHome = "none";
      this.activeItemCrypto = "none";
      this.activeItemTemperature = "none";
      this.activeItemCV = "none";
    }
    //console.log(this.activeItemTemp);
  }


  setHome(page: string) {
    this.activeItemSolar = "none";
    this.activeItemCrypto = "none";
    this.activeItemTemperature = "none";
    this.activeItemCV = "none";
    this.activeItemGPS = "none";
    this.activeItemHome = page;
    this.onSidenavClose();
    //console.log(this.activeItemHome);
  }



  addHomeStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemHome === 'home' ? 'bold' : 'normal'
    }
    return style;
  }

  addSolarStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemSolar === 'solarproject' ? 'bold' : 'normal'
    }
    return style;
  }


  addCryptoStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemCrypto === 'cryptoproject' ? 'bold' : 'normal'
    }
    return style;
  }

  addTemperatureStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemTemperature === 'temperatureproject' ? 'bold' : 'normal'
    }
    return style;
  }

  addCVStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemCV === 'curriculumvitae' ? 'bold' : 'normal'
    }
    return style;
  }

  addGPSStyleWhenActive() {
    let style = {
      'font-weight': this.activeItemGPS === 'gpsproject' ? 'bold' : 'normal'
    }
    return style;
  }


  changePageMethod(page: string) {
    this._navbarSharedService.changePage(page);
    //console.log("Inside sidebar Change page method");
  }

}
