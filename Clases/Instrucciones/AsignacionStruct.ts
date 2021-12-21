import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Identificador } from "../Expresiones/Identificador";
import { Temporales } from "../AST/Temporales";

export class AsignacionStruct implements Instruccion {
  public identificador1: Identificador;
  public identificador2: Identificador;
  public valor: Expresion;
  public linea: number;
  public column: number;

  constructor(
    identificador1: Identificador,
    identificador2: Identificador,
    valor: Expresion,
    linea: number,
    column: number
  ) {
    this.identificador1 = identificador1;
    this.identificador2 = identificador2;
    this.valor = valor;
    this.linea = linea;
    this.column = column;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let entornos = ts.sig;
    if (entornos instanceof Array) {
      entornos.forEach((entorno) => {
        if (entorno.nombre == this.identificador1.identificador) {
          // let valor = entorno.getSimbolo(this.identificador2);
          let valor = this.valor.getValor(controlador, ts, ts_u);

          // let valor = vara.getValor();

          entorno.getSimbolo(this.identificador2.identificador)?.setValor(valor);
        } else {
          let error = new Errores(
            "Semantico",
            ` El struct ${this.identificador1.identificador} no existe`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
          return;
        }
      });
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("=", "");
    padre.addHijo(new Nodo(this.identificador1.identificador, ""));
    //padre.addHijo(new Nodo("=", ""))
    padre.addHijo(this.valor.recorrer());
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}
}
