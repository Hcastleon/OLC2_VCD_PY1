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

    if(typeof valor == 'number'){
      if(this.isInt(Number(valor))){
          return tipo.ENTERO;
        }
        return tipo.DOUBLE
    }else if (typeof valor =='string'){
        return tipo.CADENA
    }else if (typeof valor =='boolean'){
        return tipo.BOOLEAN
    }else if (valor === null){
        return tipo.NULO
    }
  }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_expre1;
    let valor_expre2;
    let valor_U;
    
    if (this.expreU === false) {
      valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
      valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
    } else {
      valor_U = this.expre1.getValor(controlador, ts, ts_u);
    }

    switch (this.operador) {
      case Operador.SUMA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 + valor_expre2;
          }
        }
        break;
      case Operador.RESTA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 - valor_expre2;
          }
        }
        break;
      case Operador.MULT:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 * valor_expre2;
          }
        }
        break;
      case Operador.DIV:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 / valor_expre2;
          }
        }
        break;
      case Operador.MODULO:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 % valor_expre2;
          }
        }
        break;
      default:
        break;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo("Aritmetica", "");

    if (this.expreU) {
      padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre1.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
      padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre2.recorrer());
    }

    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }
}
