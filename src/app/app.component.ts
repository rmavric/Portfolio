import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'FirstAngularApp';

  pathString: string = "";

  constructor(private router: Router) {
  }


  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.pathString = e.url.toString();
        //console.log(e.url);
      }
    });
  }
}
