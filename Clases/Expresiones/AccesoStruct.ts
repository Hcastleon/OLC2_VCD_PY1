import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { Arreglo } from "../Expresiones/Arreglo";
import { Struct } from "../Expresiones/Struct";
import { Identificador } from "../Expresiones/Identificador";
import { Temporales } from "../AST/Temporales";

export class AccesoStruct implements Expresion {
  //public accesos: Array<string>;
  public acceso1: Identificador;
  public acceso2: Identificador;
  // public identificador: string;
  public linea: number;
  public column: number;

  constructor(acceso1: Identificador, acceso2: Identificador, linea: any, columna: any) {
    this.acceso1 = acceso1;
    this.acceso2 = acceso2;
    this.linea = linea;
    this.column = columna;
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    // let valor = this.getValor(controlador,ts,ts_u);
    let id_exists = ts.getSimbolo(this.acceso1.identificador);
    if (id_exists != null) {
      return id_exists.tipo.tipo;
    }
  }

  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    //busco en global
    let entornos = ts.sig;
    let res;
    /*
    while (entornos.ant != null) {
      // let existe = ts.tabla.get(id.toLowerCase());
      let existe = entornos.tabla.get(this.acceso1.identificador);
      if (existe != null) {
        break;
      }
      entornos = entornos.ant;
    }
*/
    if (entornos instanceof Array) {
      entornos.forEach((entorno) => {
        if (entorno.nombre == this.acceso1.identificador) {
          let valor = entorno.getSimbolo(this.acceso2.identificador);

          if (valor != null) {
            res = valor.valor;
          }
          return valor;
        }
        let error = new Errores(
          "Semantico acces",
          ` El struct ${this.acceso1.identificador} no existe`,
          this.linea,
          this.column
        );
        controlador.errores.push(error);
        return null;
      });
    }

    return res;
  }

  getValorRecursivo(
    obj: Struct,
    accesos: Array<string>,
    controlador: Controller,
    ts: TablaSim,
    ts_u: TablaSim
  ) {
    let temporales = accesos.slice();
    let acceso = temporales[0];
    temporales.shift();
    /*  if(obj.entorno.tabla.size == 0){
            obj.ejecutar(controlador, ts, ts_u);
        }*/
    /*
        if(!obj.entorno.existeEnActual(acceso)){
            let error = new Errores(
                "Semantico",
                ` No existe dentro del struct`,
                this.linea,
                this.column
            );
            controlador.errores.push(error);
            return
        }

        let simbolo = obj.entorno.getSimbolo(acceso);
        if(temporales.length > 0 && simbolo != null){
            if(simbolo.valor instanceof Struct){
                let struct = simbolo.valor;
                this.getValorRecursivo(simbolo.valor, temporales,controlador, ts,ts_u );
            }else{
                let error = new Errores(
                    "Semantico",
                    ` No existe dentro del struct`,
                    this.linea,
                    this.column
                );
                controlador.errores.push(error);
                return
            }
        }else{
            return simbolo?.valor;
        }*/
  }

  recorrer(): Nodo {
    let padre = new Nodo("accesoStruct", "");

    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}
}
