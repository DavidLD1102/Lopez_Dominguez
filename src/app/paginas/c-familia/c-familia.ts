import { Component } from '@angular/core';
import { Familia } from '../../servicios/familia';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-familia',
  imports: [CommonModule],
  templateUrl: './c-familia.html',
  styleUrl: './c-familia.css',
})
export class CFamilia {
  datosFamilia : any[] = [];

  constructor(private serviciofamilia : Familia){

  }

  ngOnInit(){
    this.datosFamilia = this.serviciofamilia.consultaFamilia();
    console.log (this.datosFamilia);
    
  }
  

}
