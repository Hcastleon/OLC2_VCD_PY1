import { Nodo } from "../../AST/Nodo";
import { Temporales, Resultado3D } from "../../AST/Temporales";
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

  constructor(asi: any, condi: any, acuta: any, list: any, linea: any, col: any) {
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
    //  padre.addHijo(new Nodo("for", ""));
    // padre.addHijo(new Nodo("(", ""));
    padre.addHijo(this.asig_decla.recorrer());
    // padre.addHijo(new Nodo(";", ""));
    padre.addHijo(this.condicion.recorrer());
    //  padre.addHijo(new Nodo(";", ""));
    padre.addHijo(this.actualizacion.recorrer());
    //  padre.addHijo(new Nodo("{", ""));
    // let hijo_ins = new Nodo("Intrucciones", "");
    for (let ins of this.lista_ins) {
      padre.addHijo(ins.recorrer());
    }
    //padre.addHijo(hijo_ins);
    //padre.addHijo(new Nodo("}", ""));
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida: Resultado3D = new Resultado3D();
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  FOR  %%%%%%%%%%%%%%%%%%%%%%";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";

    let nodoDeclaracion = this.asig_decla.traducir(Temp, controlador, ts, ts_u);
    salida.codigo3D += nodoDeclaracion.codigo3D;

    let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
    let salto = Temp.etiqueta();
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  CONDICION %%%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += salto + ": // Ciclicidad \n";
    salida.codigo3D += nodoCondicion.codigo3D;
    nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);

    let nodoAsignacion = this.actualizacion.traducir(Temp, controlador, ts, ts_u);
    salida.codigo3D +="//%%%%%%%%%%%%%%%%%%%%%%%% VERDADERO FOR %%%%%%%%%%%%%%%%%%%%%%%% \n"
    salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);

    this.lista_ins.forEach(element => {
      let nodo: Resultado3D  = element.traducir(Temp, controlador, ts, ts_u);
      salida.codigo3D += nodo.codigo3D;
      salida.breaks = salida.breaks.concat(nodo.breaks);
      salida.saltos = salida.saltos.concat(nodo.saltos);
      //salida.continues = salida.continues.concat(nodo.continues);
      //salida.returns = salida.returns.concat(nodo.returns);
      /*if(nodo.retornos.length > 0){
                salida.tipo = nodo.tipo;
                salida.valor = nodo.valor;
            }*/
    });

    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% Saltos %%%%%%%%%%%%%%%%%%%%%%%%  \n";
    salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
   // salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
   salida.codigo3D += nodoAsignacion.codigo3D;
    salida.codigo3D += Temp.saltoIncondicional(salto);
   
   salida.codigo3D += "//%%%%%%%%%% FALSAS t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
   salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
   salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);

   salida.saltos = [];
        salida.breaks = [];
      //  salida.continue = [];
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
