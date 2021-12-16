import { Nodo } from "../../AST/Nodo";
import { Temporales } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";

export class Case implements Instruccion {
  public expresion: Expresion;
  public list_inst: Array<Instruccion>;
  public linea: number;
  public columna: number;

  constructor(e: any, l: any, li: any, c: any) {
    this.expresion = e;
    this.list_inst = l;
    this.linea = li;
    this.columna = c;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    for (let ins of this.list_inst) {
      let res = ins.ejecutar(controlador, ts, ts_u);
      if (ins instanceof Break || res instanceof Break) {
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
  recorrer(): Nodo {
    let padre = new Nodo("CASE", "");
    padre.addHijo(this.expresion.recorrer());
    for (let ins of this.list_inst) {
      padre.addHijo(ins.recorrer());
    }
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {}
}
