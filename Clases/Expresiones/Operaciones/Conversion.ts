import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { tipo, Tipo } from "../../TablaSimbolos/Tipo";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Temporales } from "../../AST/Temporales";

export class Conversion implements Expresion {
  public tipo: Tipo;
  public expre2: Expresion;
  public operador: any;
  public linea: number;
  public column: number;

  constructor(
    tipo: any,
    expre2: Expresion,
    operador: any,
    linea: number,
    column: number
  ) {
    this.tipo = tipo;
    this.expre2 = expre2;
    this.linea = linea;
    this.column = column;
    this.operador = operador;
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_expre2;
    valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);

    switch (this.operador) {
      case "parse":
        if (this.tipo.tipo == tipo.DOUBLE || this.tipo.tipo == tipo.ENTERO) {
          if (typeof valor_expre2 === "string") {
            return Number(valor_expre2);
          }
        } else if (this.tipo.tipo == tipo.BOOLEAN) {
          if (typeof valor_expre2 === "string") {
            if (valor_expre2.toLowerCase() == "true") {
              return true;
            }
            return false;
          }
        }
        break;
      case "toint":
        if (typeof valor_expre2 === "number") {
          if (!this.isInt(Number(valor_expre2))) {
            return Math.ceil(valor_expre2);
          }
        }
        break;
      case "todouble":
        if (typeof valor_expre2 === "number") {
          return this.twoDecimal(valor_expre2);
        }
        break;
      case "typeof":
        return typeof valor_expre2;
        break;
      case "tostring":
        if (!(typeof valor_expre2 === null)) {
          return String(valor_expre2);
        }
        break;
      default:
        break;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo(this.operador, "");

    padre.addHijo(this.expre2.recorrer());

    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
      
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/[a-zA-Z]/i);
  }

  twoDecimal(numberInt: number) {
    return Number.parseFloat(numberInt.toFixed(4));
  }
}
