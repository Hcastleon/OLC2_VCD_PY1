import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";
import { Temporales, Temporal, Resultado3D } from "../../AST/Temporales";

export class Logicas extends Operacion implements Expresion {
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

    if (typeof valor == "number") {
      return tipo.DOUBLE;
    } else if (typeof valor == "string") {
      return tipo.CADENA;
    } else if (typeof valor == "boolean") {
      return tipo.BOOLEAN;
    }
  }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_exp1;
    let valor_exp2;
    let valor_expU;

    if (this.expreU == false) {
      valor_exp1 = this.expre1.getValor(controlador, ts, ts_u);
      valor_exp2 = this.expre2.getValor(controlador, ts, ts_u);
    } else {
      valor_expU = this.expre1.getValor(controlador, ts, ts_u);
    }
    switch (this.operador) {
      case Operador.AND:
        if (typeof valor_exp1 == "boolean") {
          if (typeof valor_exp2 == "boolean") {
            return valor_exp1 && valor_exp2;
          }
        }
        break;
      case Operador.OR:
        if (typeof valor_exp1 == "boolean") {
          if (typeof valor_exp2 == "boolean") {
            return valor_exp1 || valor_exp2;
          }
        }
        break;
      case Operador.NOT:
        if (typeof valor_expU == "boolean") {
          return !valor_expU;
        }
        break;
      default:
        break;
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo(this.op_string, "");

    if (this.expreU) {
      //  padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre1.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
      // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre2.recorrer());
    }

    return padre;
  }

  generarOperacionBinario(
    Temp: Temporales,
    controlador: Controller,
    ts: TablaSim,
    ts_u: TablaSim,
    signo: any,
    recursivo: any
  ) {
    let valor1;
    let valor2;
    if (this.expreU === false) {
      valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
      valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
    } else {
      valor1 = new Resultado3D();
      valor1.codigo3D = "";
      valor1.temporal = new Temporal("0");
      valor1.tipo = tipo.ENTERO;
      valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
    }

    if (valor1 == (null || undefined) || valor2 == (null || undefined))
      return null;
    //-------
    //let resultado = "";
    let result = new Resultado3D();
    result.tipo = tipo.BOOLEAN;
    if (this.operador == Operador.OR) {
      result.codigo3D += valor1.codigo3D;
      
      //
      valor1 = this.arreglarBoolean(valor1, result, Temp);
      //
      result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasF);
      
      result.codigo3D += valor2.codigo3D;
      valor2 = this.arreglarBoolean(valor2, result, Temp);
      
      result.etiquetasV = valor1.etiquetasV;
      result.etiquetasV = result.etiquetasV.concat(valor2.etiquetasV);
      result.etiquetasF = valor2.etiquetasF;
      //result.codigo3D = resultado;
      if (this.getValor(controlador, ts, ts_u) === true) {
        result.temporal = new Temporal("true");
      } else {
        result.temporal = new Temporal("false");
      }
      return result;
    } else if (this.operador == Operador.AND) {
      result.codigo3D += valor1.codigo3D;
      
      //
      valor1 = this.arreglarBoolean(valor1, result, Temp);
      //
      result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasV);
      
      result.codigo3D += valor2.codigo3D;
      valor2 = this.arreglarBoolean(valor2, result, Temp);

      result.etiquetasV = valor2.etiquetasV;
      result.etiquetasF = valor1.etiquetasF;
      result.etiquetasF = result.etiquetasF.concat(valor2.etiquetasF);
      //result.codigo3D = resultado;
      if (this.getValor(controlador, ts, ts_u) === true) {
        result.temporal = new Temporal("true");
      } else {
        result.temporal = new Temporal("false");
      }
      return result;
    }else{
       result.codigo3D += valor2.codigo3D;
       valor2 = this.arreglarBoolean(valor2, result, Temp);

       let  v = valor2.etiquetasV;
       let  f = valor2.etiquetasF;

       result.etiquetasF = v;
       result.etiquetasV = f;
       return result;

    }
  }

  traducir(
    Temp: Temporales,
    controlador: Controller,
    ts: TablaSim,
    ts_u: TablaSim
  ) {
    if (this.operador == Operador.AND) {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "&&", 0);
    } else if (this.operador == Operador.OR) {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "||", 0);
    } else if (this.operador == Operador.NOT) {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "!", 0);
    }
    //modulo unario concatenar repetir
    return "Holiwis";
  }

  arreglarBoolean(nodo: Resultado3D, salida: Resultado3D, Temp: Temporales) {
    if (nodo.etiquetasV.length == 0) {
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
      salida.codigo3D += Temp.saltoIncondicional(f);
      console.log("2"+ salida)
      nodo.etiquetasV = [v];
      nodo.etiquetasF = [f];
    }
    return nodo;
  }
}
