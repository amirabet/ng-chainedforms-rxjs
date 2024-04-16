import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, combineLatest, map, of, tap } from 'rxjs';

import { Country, Region, SmallCountry } from '../interfaces/country.interface';

/*
* Al ser un servicio "providedIn: 'root'"
* estará disponible en toda la aplicación.
* 
* Esto genera a la vez que, para disponer de HttpClient,
* este se deba de importar de app.module, y no en countries.module
* Además lo inyectamos en este constructor
*/
@Injectable({
  providedIn: 'root'
})

export class CountriesService {

  // https://restcountries.com/v3.1/region/europe?fields=cca3,name,borders
  private _baseUrl = "https://restcountries.com/v3.1/";
  private _regionUrl = "region/";
  private _cca3Url = "alpha/";
  private _fieldsQueryUrl = "?fields=cca3,name,borders";

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];

  constructor(private http: HttpClient) { }

  get regions() {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region)
      return of([]);

    const url = `${this._baseUrl + this._regionUrl + region + this._fieldsQueryUrl}`;

    /*
    * El tipado aquí no es 100% estricto puesto que
    * la petición no retorna exactamente un SmallCountry[] 
    * sino un Country[]
    */
    return this.http.get<Country[]>(url)
      .pipe(
        /* 
        * Con map del pipe adaptamos la info recibida al type SmallCountry
        * y con un segundo map, este propio del array, convertimos
        * cada elemento de la respuesta al formato deseado SmallCountry
        */
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [] // null coalescensce PRETTY => ??
        }))),
        tap(response => console.log({ response }))
      )
  }

  getCountryByCca3(cca3: string): Observable<SmallCountry> {

    const url = `${this._baseUrl + this._cca3Url + cca3 + this._fieldsQueryUrl}`;

    return this.http.get<Country>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })),
        tap(response => console.log({ response }))
      )
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || borders.length === 0)
      return of([]);

    const conturiesRequest: Observable<SmallCountry>[] = [];

    borders.forEach(code => {
      const request = this.getCountryByCca3(code);
      conturiesRequest.push(request);
    });

    /*
    * combineLatest combina todos los Observables que estamos generando
    */
    return combineLatest ( conturiesRequest );
  }
}
