import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";

export class Aritmetica extends Operacion implements Expresion {
  constructor(
    expre1: any,
    expre2: any,
    expreU: any,
    operador: any,
    linea: any,
    column: any
  ) {
    super(expre1, expre2, expreU, operador, linea, column);
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor = this.getValor(controlador, ts, ts_u);

    if (typeof valor === "number") {
      return tipo.DOUBLE;
    } else if (typeof valor === "string") {
      return tipo.CADENA;
    } else if (typeof valor === "boolean") {
      return tipo.BOOLEAN;
    }
  }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}

  recorrer(): Nodo {
    return null;
  }
}
