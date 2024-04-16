import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*
* Lazy Load Module: 
* Mediante el método de loadChildren importamos la ruta del módulo 
* que queremos usar para esa ruta. 
* Con el .then (callback) referenciamos al módulo completo
*/
const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import( './countries/countries.module' ).then(m => m.CountriesModule) 
  },
  {
    path: '**',
    redirectTo: 'selector'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
