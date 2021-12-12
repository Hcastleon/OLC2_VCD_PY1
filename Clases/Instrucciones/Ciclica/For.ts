import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";

export class For implements Instruccion {
  public asig_decla: Instruccion;
  public condicion: Expresion;
  public actualizacion: Instruccion;
  public lista_ins: Array<Instruccion>;
  public linea: number;
  public columna: number;

  constructor(
    asi: any,
    condi: any,
    acuta: any,
    list: any,
    linea: any,
    col: any
  ) {
    this.asig_decla = asi;
    this.condicion = condi;
    this.actualizacion = acuta;
    this.lista_ins = list;
    this.linea = linea;
    this.columna = col;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    this.asig_decla.ejecutar(controlador, ts, ts_u);
    let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
    if (typeof valor_condi == "boolean") {
      siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
        let ts_local = new TablaSim(ts, "For");
        ts.setSiguiente(ts_local);
        for (let ins of this.lista_ins) {
          let result = ins.ejecutar(controlador, ts_local, ts_u);
          if (ins instanceof Break || result instanceof Break) {
            return result;
          }
          if (ins instanceof Continue || result instanceof Continue) {
            this.actualizacion.ejecutar(controlador, ts, ts_u);
            continue siguiente;
          }
          if (ins instanceof Return) {
            return result;
          }
          if (result != null) {
            return result;
          }
        }

        this.actualizacion.ejecutar(controlador, ts, ts_u);
      }
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("For", "");
    padre.addHijo(new Nodo("for", ""));
    padre.addHijo(new Nodo("(", ""));
    padre.addHijo(this.asig_decla.recorrer());
    padre.addHijo(new Nodo(";", ""));
    padre.addHijo(this.condicion.recorrer());
    padre.addHijo(new Nodo(";", ""));
    padre.addHijo(this.actualizacion.recorrer());
    padre.addHijo(new Nodo("{", ""));
    let hijo_ins = new Nodo("Intrucciones", "");
    for (let ins of this.lista_ins) {
      hijo_ins.addHijo(ins.recorrer());
    }
    padre.addHijo(hijo_ins);
    padre.addHijo(new Nodo("}", ""));
    return padre;
  }
}
