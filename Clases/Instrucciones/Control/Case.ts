import { Nodo } from "../../AST/Nodo";
import { Temporales, Resultado3D } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";
import { tipo } from "../../TablaSimbolos/Tipo";

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

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida: Resultado3D = new Resultado3D();
    // let v: Array<string> = [];
    // let f: Array<string> = [];

    //let nodo: Resultado3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
    //salida.codigo3D += nodo.codigo3D;

    this.list_inst.forEach((element) => {
      let temp: Resultado3D = element.traducir(Temp, controlador, ts, ts_u);
      // console.log(temp);
      salida.codigo3D += temp.codigo3D;
      salida.saltos = salida.saltos.concat(temp.saltos);
      salida.breaks = salida.breaks.concat(temp.breaks);
      // salida.codigo3D += temp.continue;
      // salida.codigo3D += temp.retornos;
      /*
       if (temp.retornos.length > 0) {
         salida.tipo = temp.tipo;
         salida.valor = temp.valor;
       }*/
    });

    return salida;
  }
}
