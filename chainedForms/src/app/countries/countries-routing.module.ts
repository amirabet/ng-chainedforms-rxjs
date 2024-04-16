/*
* Todo el bolierplate de este archivo se genera mediante
* ng-router (hay varias opciones) => Angular snippets
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';

/*
* Routing para un Módulo: 
* Generamos un archivo nombreDelMódulo-routing.module.ts
* Podemos anidar todas las rutas hija en el array children
* del path raíz
*/
const routes: Routes = [
    { 
        path: '', 
        children: [
            {
                path:'selector',
                component: SelectorPageComponent
            },
            {
                path:'**',
                redirectTo: 'selector'
            }
        ] 
    },
];

/*
* imports: 
* usar RouterModule.forChild => puesto que no estamos en
* la raíz del aplicativo, donde usaríamos RouterModule.forRoot(routes)
*/
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CountriesRoutingModule {}
