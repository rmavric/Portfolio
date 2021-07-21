import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatInkBar } from '@angular/material';
import { NavbarSharedService } from 'src/app/services/navbar-shared.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarMenuComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
 
  activeLink : string = null;
  pageName : string = null;
  pathString : string = null;

  constructor(private _navbarSharedService : NavbarSharedService,
              private router: Router) { }

  ngOnInit() {
    

    this._navbarSharedService.currentPage.subscribe((page) => {
      this.pageName = page;
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          this.pathString = e.url.toString();
          if(this.pathString=="/") {
            this.pathString="home";
          }
          else{
            this.pathString = this.pathString.substring(1);
          }
          //console.log("URL: " + this.pathString);
         
          //console.log("Toolbar 1: " + this.pageName);

          if(this.pageName!=this.pathString){
            this.setActiveItem(this.pathString);
          }
          else{
            this.setActiveItem(this.pageName);
          }
        }
      });
      
      

    }) 
  }
 
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  setActiveItem(projectName : string) {
    this.activeLink = projectName;
    //console.log("Toolbar 2: " + this.activeLink);
    //console.log(this.activeLink);
  }

  changePageMethod(page: string){
    this._navbarSharedService.changePage(page);
    //console.log("Inside toolbar Change page method");
  }

}

