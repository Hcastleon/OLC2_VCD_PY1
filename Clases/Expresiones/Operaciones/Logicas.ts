import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Simbolos } from "../../TablaSimbolos/Simbolos";
import { Operacion, Operador } from "./Operaciones";
import { Temporales, Temporal, Resultado3D } from "../../AST/Temporales";

export class Logicas extends Operacion implements Expresion {
  constructor(expre1: any, expre2: any, expreU: any, operador: any, linea: any, column: any) {
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

    if (valor1 == (null || undefined) || valor2 == (null || undefined)) return null;
    //-------
    //let resultado = "";
    let result = new Resultado3D();
    //result.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% OP Logica %%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
    result.tipo = tipo.BOOLEAN;
    if (this.operador == Operador.OR) {
      if (valor1.codigo3D != undefined) result.codigo3D += valor1.codigo3D;
      //
      valor1 = this.arreglarBoolean(valor1, result, Temp);
      //
      result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasF);

      if (valor2.codigo3D != undefined) result.codigo3D += valor2.codigo3D;
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
      if (valor1.codigo3D != undefined) result.codigo3D += valor1.codigo3D;

      //
      valor1 = this.arreglarBoolean(valor1, result, Temp);
      //
      result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasV);

      if (valor2.codigo3D != undefined) result.codigo3D += valor2.codigo3D;
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
    } else {
      if (valor2.codigo3D != undefined) result.codigo3D += valor2.codigo3D;
      valor2 = this.arreglarBoolean(valor2, result, Temp);

      let v = valor2.etiquetasV;
      let f = valor2.etiquetasF;

      result.etiquetasF = v;
      result.etiquetasV = f;
      /*if (this.getValor(controlador, ts, ts_u) === true) {
        result.temporal = new Temporal("1");
      } else {
        result.temporal = new Temporal("0");
      }*/
      return result;
    }
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
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
    if (nodo instanceof Simbolos) {
      //console.log(nodo);
      let temp = Temp.temporal();
      let temp2 = Temp.temporal();
      //salida.tipo = tipo.ID;
      salida.codigo3D += temp + " = P + " + nodo.posicion + "; \n";
      salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
      //----------
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoCondicional("(" + temp2 + "== 1 )", v);
      salida.codigo3D += Temp.saltoIncondicional(f);
      //--------------------------------
      /* let temp3: string = Temp.temporal();
      let salto: string = Temp.etiqueta();

      salida.codigo3D += v + ": \n";
      salida.codigo3D += temp3 + " = 1; \n";
      salida.codigo3D += Temp.saltoIncondicional(salto);
      salida.codigo3D += f + ": \n";
      salida.codigo3D += temp3 + " = 0; \n";
      salida.codigo3D += salto + ": \n";
      salida.temporal = new Temporal(temp3);*/
      //---------------------------------------------
      nodo.etiquetasV = [v];
      nodo.etiquetasF = [f];
    } else if (nodo.etiquetasV.length == 0) {
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
      salida.codigo3D += Temp.saltoIncondicional(f);

      nodo.etiquetasV = [v];
      nodo.etiquetasF = [f];
    }
    return nodo;
  }
}
