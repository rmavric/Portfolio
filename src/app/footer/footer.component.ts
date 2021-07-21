import { Component, SimpleChanges, OnChanges, Input, HostListener } from '@angular/core';
import { LikesDislikesService } from '../services/likes-dislikes.service';
import { ILikesDislikesData } from '../models/likes-dislikes-data.model';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnChanges {


  @Input() pathString: string;

  projectData: ILikesDislikesData;
  putObject: ILikesDislikesData;
  currentProjectId: number = 1;
  noOfLikes: number = 0;
  noOfDislikes: number = 0;
  currentPath: string = "";
  flagCurrentPath: boolean = false;
  currentDate: Date;
  currentDateToPrint: string;

  public now: Date = new Date();


  constructor(private _likesDislikesService: LikesDislikesService,
              private _snackBar: MatSnackBar) { 

                setInterval(() => {
                  this.now = new Date();
                }, 1);
              }
              

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];
      //console.log("Change: " + change.currentValue);
      this.currentPath = change.currentValue;
      this.flagCurrentPath = false;

      if (change.currentValue == "/solarproject") {
        this.flagCurrentPath = true;
        this.currentProjectId = 1;
        this._likesDislikesService.getLikesDislikes(this.currentProjectId).subscribe(
          (data) => {
            this.putObject = data;
            this.noOfLikes = this.putObject.likes;
            this.noOfDislikes = this.putObject.dislikes;
          }
        );
      }

      if (change.currentValue == "/cryptoproject") {
        this.flagCurrentPath = true;
        this.currentProjectId = 2;
        this._likesDislikesService.getLikesDislikes(this.currentProjectId).subscribe(
          (data) => {
            this.putObject = data;
            this.noOfLikes = this.putObject.likes;
            this.noOfDislikes = this.putObject.dislikes;
          }
        );
      }

      if (change.currentValue == "/temperatureproject") {
        this.flagCurrentPath = true;
        this.currentProjectId = 3;
        this._likesDislikesService.getLikesDislikes(this.currentProjectId).subscribe(
          (data) => {
            this.putObject = data;
            this.noOfLikes = this.putObject.likes;
            this.noOfDislikes = this.putObject.dislikes;
          }
        );
      }

      if (change.currentValue == "/gpsproject") {
        this.flagCurrentPath = true;
        this.currentProjectId = 4;
        this._likesDislikesService.getLikesDislikes(this.currentProjectId).subscribe(
          (data) => {
            this.putObject = data;
            this.noOfLikes = this.putObject.likes;
            this.noOfDislikes = this.putObject.dislikes;
          }
        );
      }

    }

  }


  likesIncrease(): void {
    if (sessionStorage.getItem(this.putObject.projectName + ' likes') === '1') {
      this.snackBarLike('Like button was already clicked!!', 'Close', 'arduino-snackbar');

    }
    if (sessionStorage.getItem(this.putObject.projectName + ' dislikes') === '1' && sessionStorage.getItem(this.putObject.projectName + ' likes') !== '1') {
      this.noOfDislikes--;
      this.putObject.dislikes = this.noOfDislikes;
      this._likesDislikesService.putLikesDislikes(this.putObject).subscribe(
        () => {
          sessionStorage.setItem(this.putObject.projectName + ' likes', '0');
          sessionStorage.setItem(this.putObject.projectName + ' dislikes', '0');

        }
      );
    }
    if (sessionStorage.getItem(this.putObject.projectName + ' likes') !== '1' && sessionStorage.getItem(this.putObject.projectName + ' dislikes') !== '1') {
      this.noOfLikes++;
      this.putObject.likes = this.noOfLikes;
      this._likesDislikesService.putLikesDislikes(this.putObject).subscribe(
        () => {
          sessionStorage.setItem(this.putObject.projectName + ' likes', '1');

        }
      );
    }
  }

  dislikesIncrease(): void {
    if (sessionStorage.getItem(this.putObject.projectName + ' dislikes') === '1') {
      this.snackBarDislike('Dislike button was already clicked!!', 'Close', 'arduino-snackbar');

    }
    if (sessionStorage.getItem(this.putObject.projectName + ' likes') === '1' && sessionStorage.getItem(this.putObject.projectName + ' dislikes') !== '1') {
      this.noOfLikes--;
      this.putObject.likes = this.noOfLikes;
      
      this._likesDislikesService.putLikesDislikes(this.putObject).subscribe(
        () => {
          sessionStorage.setItem(this.putObject.projectName + ' likes', '0');
          sessionStorage.setItem(this.putObject.projectName + ' dislikes', '0');

        }
      );
    }
    if (sessionStorage.getItem(this.putObject.projectName + ' dislikes') !== '1' && sessionStorage.getItem(this.putObject.projectName + ' likes') !== '1') {
      this.noOfDislikes++;
      this.putObject.dislikes = this.noOfDislikes;
      this._likesDislikesService.putLikesDislikes(this.putObject).subscribe(
        () => {
          sessionStorage.setItem(this.putObject.projectName + ' dislikes', '1');

        }
      );
    }
  }



  snackBarLike(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: [className]
    });
  }

  snackBarDislike(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: [className]
    });
  }

  dateAndTime(): void {
    console.log("Date and time invoked");
    this.currentDateToPrint = this.currentDate.toISOString();
  }
 
}