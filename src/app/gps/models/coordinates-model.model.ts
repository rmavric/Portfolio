import { Coordinate } from "./coordinate";
import { Time } from "@angular/common";

export interface ICoordinatesModel {
    date: Date;
    time: Time;
    coordinate: Coordinate;
}
