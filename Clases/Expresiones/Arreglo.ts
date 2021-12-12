import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";

export class Arreglo {
  public tipoo: Tipo;
  public tipoObjeto: string;
  public valores: Array<any>;
  // public niveles: Array<Expresion>;
  // public linea: number;
  // public column: number;

  constructor(tipoo: any, tipoObjeto: string, valores: any) {
    this.tipoo = tipoo;
    this.tipoObjeto = tipoObjeto;
    this.valores = valores;
  }

  getValor(posicion: any, niveles: Array<any>, linea: any, columna: any) {
    let nivel = posicion;
    if (nivel > niveles.length - 1) {
      //Error posicion inexistente
      return niveles
    } else {
      return niveles[nivel];
    }
  }

  setValor(posicion: any, niveles: Array<any>,value: any ,linea: any, columna: any) {
    let nivel = posicion;
    if(nivel > niveles.length-1){
        //Error
        return niveles
    }else{
        niveles[nivel] = value;
        return niveles;
    }
  }
}
