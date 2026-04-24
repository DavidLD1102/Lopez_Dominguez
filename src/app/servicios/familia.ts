import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Familia {
  arregloFamilia : any[] = [
    {
    id : 1,
    nombre: 'Martha Alicia',
    apellidos: 'Dominguez Mendoza',
    fecha_nacimiento : '06/07/1978',
    color_fav : 'Verde'
    },
    {
      id : 2,
      nombre : 'Rogelio',
      apellidos : 'López Castillo',
      fecha_nacimiento : '29/05/1974',
      color_fav : 'Azul'
    },
    {
      id : 3,
      nombre : 'Rogelio Antonio',
      apellidos : 'López Domínguez',
      fecha_nacimiento : '19/2008/01',
      color_fav : 'Negro'
    },
    {
      id : 4,
      nombre : 'David Azael',
      apellidos : 'López Domínguez',
      fecha_nacimiento : '02/03/2005',
      color_fav : 'Rojo'
    },
    {      id : 2,
      nombre : 'Elizabeth',
      apellidos : 'López Domínguez',
      fecha_nacimiento : '14/01/2011',
      color_fav : 'Rojo'
    }


  ];

  constructor() {} 

consultaFamilia(){
  return this.arregloFamilia;
}
  

}
