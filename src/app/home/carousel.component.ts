import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from "@angular/animations";
import { CarouselModel } from '../models/carousel-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class CarouselComponent {

  constructor(private router : Router) { }

  public slides = [
    { Src: "assets/SolarProject.jpg", Name: "Solar project" },
    { Src: "assets/CryptoProject.jpg", Name: "Crypto project" },
    { Src: "assets/TemperatureProject.jpg", Name: "Temperature project" },
    { Src: "assets/GPSProject.jpg", Name: "GPS project" },
  ];

  carouselArray: CarouselModel[] = [
    { Src: "assets/SolarProject.jpg", Name: "Solar project" },
    { Src: "assets/CryptoProject.jpg", Name: "Crypto project" },
    { Src: "assets/TemperatureProject.jpg", Name: "Temperature project" },
    { Src: "assets/GPSProject.jpg", Name: "GPS project" },
  ]
   



  nameOfSlide: string = "";
  currentSlide = 0;

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    console.log("previous clicked, new current slide is: ", this.currentSlide);
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    console.log("next clicked, new current slide is: ", this.currentSlide);
  }

  navigateTo(slideName: string): void {
    if (slideName === "Solar project") {
      this.router.navigate(['/solarproject']);
    }
    if (slideName === "Crypto project") {
      this.router.navigate(['/cryptoproject']);
    }
    if (slideName === "Temperature project") {
      this.router.navigate(['/temperatureproject']);
    }
    if (slideName === "GPS project") {
      this.router.navigate(['/gpsproject']);
    }
  }

}
