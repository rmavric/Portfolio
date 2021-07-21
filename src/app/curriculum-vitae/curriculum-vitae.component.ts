import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-curriculum-vitae',
  templateUrl: './curriculum-vitae.component.html',
  styleUrls: ['./curriculum-vitae.component.scss']
})
export class CurriculumVitaeComponent implements OnInit {

  show:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleSpecialization(){
    this.show = !this.show;
  }

}
