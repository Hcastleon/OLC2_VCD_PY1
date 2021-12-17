import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";
import { If } from "./If";
import { Case } from "./Case";
import { Temporales, Resultado3D } from "../../AST/Temporales";
import { tipo } from "../../TablaSimbolos/Tipo";

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
        this.valor.getValor(controlador, ts, ts_u) == caso.expresion.getValor(controlador, ts, ts_u)
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

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida = new Resultado3D();
    let v: Array<string> = [];
    let f: Array<string> = [];

    let nodo: Resultado3D = this.valor.traducir(Temp, controlador, ts, ts_u);
    salida.codigo3D += nodo.codigo3D + "\n";

    //

    this.list_cases.forEach((element) => {
      let caso = element as Case;
      let der = caso.expresion.traducir(Temp, controlador, ts, ts_u);

      let comp = this.comparacion(salida, nodo, der, "==", Temp, controlador, ts, ts_u);
      comp = this.arreglarBoolean(comp, salida, Temp);
      v = comp.etiquetasV;
      f = comp.etiquetasF;

      salida.codigo3D += "//#############3Verdaderas##################3 \n";
      salida.codigo3D += Temp.escribirEtiquetas(v);

      //console.log(this.lista_ifs);
      caso.list_inst.forEach((element) => {
        let temp: Resultado3D = element.traducir(Temp, controlador, ts, ts_u);

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

      let salto: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoIncondicional(salto);
      salida.saltos.push(salto);

      salida.codigo3D += "//#####################Falssa###########3 \n";
      salida.codigo3D += Temp.escribirEtiquetas(f);
    });

    //--------------------Default

    let temp: Resultado3D = this.defaulteo.traducir(Temp, controlador, ts, ts_u);

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
    //----------------
    salida.codigo3D += "//#################### Saltos de Salida############## \n";
    salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
    salida.saltos = [];
    salida.codigo3D += "//#################### BREAKS############## \n";
    salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
    salida.breaks = [];

    return salida;
  }

  arreglarBoolean(nodo: Resultado3D, salida: Resultado3D, Temp: Temporales) {
    if (nodo.etiquetasV.length == 0) {
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();
      salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
      salida.codigo3D += Temp.saltoIncondicional(f);
      //console.log("2" + salida);
      nodo.etiquetasV = [v];
      nodo.etiquetasF = [f];
    }
    return nodo;
  }

  comparacion(
    nodo: Resultado3D,
    nodoIzq: Resultado3D,
    nodoDer: Resultado3D,
    signo: string,
    Temp: Temporales,
    controlador: Controller,
    ts: TablaSim,
    ts_u: TablaSim
  ) {
    nodo.tipo = tipo.BOOLEAN;
    let v: string = Temp.etiqueta();
    let f: string = Temp.etiqueta();
    nodo.codigo3D += Temp.crearLinea(
      "if (" +
        nodoIzq.temporal.nombre +
        " " +
        signo +
        " " +
        nodoDer.temporal.nombre +
        ") goto " +
        v,
      "Si es verdadero salta a " + v
    );

    nodo.codigo3D += Temp.crearLinea("goto " + f, "si no se cumple salta a: " + f);
    nodo.etiquetasV = [];
    nodo.etiquetasV.push(v);
    nodo.etiquetasF = [];
    nodo.etiquetasF.push(f);
    return nodo;
  }
}
