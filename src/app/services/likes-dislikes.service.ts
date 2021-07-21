import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILikesDislikesData } from '../models/likes-dislikes-data.model';


@Injectable({
  providedIn: 'root'
})
export class LikesDislikesService {

  constructor(private _httpClient: HttpClient) { }

  baseUrl = '..............................';

  putLikesDislikes(likesDislikes: ILikesDislikesData): Observable<void> {

    return this._httpClient.put<void>(`${this.baseUrl}/${likesDislikes.id}`, likesDislikes);
  }

  getLikesDislikes(id: number): Observable<ILikesDislikesData> {

    return this._httpClient.get<ILikesDislikesData>('..............................' + id);
 
  }

}
