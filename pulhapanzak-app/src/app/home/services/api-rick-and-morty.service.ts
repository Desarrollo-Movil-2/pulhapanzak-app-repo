import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICharacter } from '../models/IPersonaje';

@Injectable({
  providedIn: 'root',
})
export class ApiRickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<{ results: ICharacter[] }> {
    return this.http.get<{ results: ICharacter[] }>(this.apiUrl);
  }
}
