import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";
import { Temporales, Resultado3D } from "../../AST/Temporales";

export class While implements Instruccion {
  public condicion: Expresion;
  public lista_ins: Array<Instruccion>;
  public linea: number;
  public columna: number;

  constructor(condicion: any, lista_ins: any, linea: any, columna: any) {
    this.condicion = condicion;
    this.lista_ins = lista_ins;
    this.linea = linea;
    this.columna = columna;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
    if (typeof valor_condi == "boolean") {
      siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
        let ts_local = new TablaSim(ts, "While");
        ts.setSiguiente(ts_local);
        for (let ins of this.lista_ins) {
          let res = ins.ejecutar(controlador, ts_local, ts_u);
          if (ins instanceof Break || res instanceof Break) {
            return res;
          }
          if (ins instanceof Continue || res instanceof Continue) {
            continue siguiente;
          }
          if (ins instanceof Return || res != null) {
            return res;
          }
          if (res != null) {
            return res;
          }
        }
      }
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("While", "");
    padre.addHijo(this.condicion.recorrer());
    for (let ins of this.lista_ins) {
      padre.addHijo(ins.recorrer());
    }
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida: Resultado3D = new Resultado3D();
    let nodoCondicion: Resultado3D = this.condicion.traducir(Temp, controlador, ts, ts_u);
    
    let ciclo: string = Temp.etiqueta();

    salida.codigo3D += ciclo + ": //Etiqueta para controlar el ciclado";
    salida.codigo3D += nodoCondicion.codigo3D;
    //salida.etiquetasF = salida.etiquetasF.concat(nodoCondicion.etiquetasF)
    nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%% Verdadera %%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
    this.lista_ins.forEach((element) => {
      let nodo: Resultado3D = element.traducir(Temp, controlador, ts, ts_u);
      salida.codigo3D += nodo.codigo3D;
      salida.saltos = salida.saltos.concat(nodo.saltos);
      salida.breaks = salida.breaks.concat(nodo.breaks);
      // salida.continue = salida.continue.concat(nodo.continue);
      // salida.returns = salida.returns.concat(nodo.returns);
      /*if (nodo.retornos.length > 0) {
           salida.tipo = nodo.tipo;
           salida.valor = nodo.valor;
         }*/
    });

    salida.codigo3D += "//%%%%%%%%%% SALTOS y CICLO %%%%%%%%%%%%%%%%%%%% \n";
    //salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
    salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
    salida.codigo3D += Temp.saltoIncondicional(ciclo);

    salida.codigo3D += "//%%%%%%%%%% FALSas t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
    salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);

    salida.breaks = [];
    salida.saltos = [];
    // salida.continue = [];
    return salida;
  }

  arreglarBoolean(nodo: Resultado3D, salida: Resultado3D, Temp: Temporales) {
    if (nodo.etiquetasV.length == 0) {
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
      salida.codigo3D += Temp.saltoIncondicional(f);
      console.log("2" + salida);
      nodo.etiquetasV = [v];
      nodo.etiquetasF = [f];
    }
    return nodo;
  }
}
