import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";
import { If } from "./If";
import { Case } from "./Case";

export class Switch implements Instruccion {
  public valor: Expresion;
  public list_cases: Array<Instruccion>;
  public defaulteo: Instruccion;
  public linea: number;
  public columna: number;

  constructor(v: any, l: any, d: any, lin: any, c: any) {
    this.valor = v;
    this.list_cases = l;
    this.defaulteo = d;
    this.linea = lin;
    this.columna = c;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let ts_local = new TablaSim(ts, "Switch");
    ts.setSiguiente(ts_local);
    let aux = false;
    for (let ins of this.list_cases) {
      let caso = ins as Case;
      if (
        this.valor.getValor(controlador, ts, ts_u) ==
        caso.expresion.getValor(controlador, ts, ts_u)
      ) {
        let res = ins.ejecutar(controlador, ts_local, ts_u);
        if (ins instanceof Break || res instanceof Break) {
          aux = true;
          return res;
        }
        if (ins instanceof Return) {
          return res;
        }
        if (res != null) {
          return res;
        }
      }
    }

    if (!aux && this.defaulteo != null) {
      let res = this.defaulteo.ejecutar(controlador, ts, ts_u);
      if (res instanceof Break) {
        aux = true;
        return res;
      }
      if (res instanceof Return) {
        return res;
      }
      if (res != null) {
        return res;
      }
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo("SWITCH", "");
    padre.addHijo(this.valor.recorrer());
    for (let casito of this.list_cases) {
      padre.addHijo(casito.recorrer());
    }
    if (this.defaulteo != null) {
      padre.addHijo(this.defaulteo.recorrer());
    }

    return padre;
  }
}
