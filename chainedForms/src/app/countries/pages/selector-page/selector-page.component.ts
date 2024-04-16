import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})

export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];
  public isLoading: boolean = false;

  public myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) { }

  /*
  * En OnInit vinculamos culaquier cambio en la región
  * al evento de la consulta de países de la API.
    * Este subscribe deberíamos eliminarlo al destruir el componente
  */
  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  /*
  * OJO el null operator => get('region')!
  *
  * Mediante la region disparamos un 2º observable dentro de la pipe
  * con "switchMap", que llamará al http de getCountries con la región seleccionada
  */
  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(() => this.isLoading = true),
      tap(() => this.myForm.get('country')!.setValue('')),
      tap(() => this.borders = [] ),
      switchMap((region) => this.countriesService.getCountriesByRegion(region)),
      // Versión simplificada:
      // Al llamarse de la misma forma "region" (parámetro de la 2ª función):
      //
      //switchMap( this.countriesService.getCountriesByRegion )
      tap(() => this.isLoading = false),
    )
    .subscribe(countries => {
      this.countriesByRegion = countries.sort((a, b) => a.name.localeCompare(b.name));
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.isLoading = true),
      tap(() => this.myForm.get('border')!.setValue('')),
      /*
      * Controlamos petición vacía en este caso con el filter() de pipe
      * (también se podría hacer en getCountryByCca3 de los services).
      * Si no superamos la condición el flujo de la pipe no prosigue
      */
      filter((value: string) => value.length > 0),
      switchMap((alphaCode) => this.countriesService.getCountryByCca3(alphaCode)),
      switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders!)),
      tap(() => this.isLoading = false),
    )
    .subscribe(countries => {
      this.borders = countries;
  })
}
}
