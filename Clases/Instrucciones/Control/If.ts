import { Nodo } from "../../AST/Nodo";
import { Temporales, Resultado3D } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Break } from "../Transferencia/Break";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";

export class If implements Instruccion {
  public condicion: Expresion;
  public lista_ifs: Array<Instruccion>;
  public lista_elses: Array<Instruccion>;
  public linea: number;
  public columna: number;
  public entornoTrad: TablaSim;

  constructor(condicion: any, lista_ifs: any, lista_elses: any, linea: any, columna: any) {
    this.condicion = condicion;
    this.lista_ifs = lista_ifs;
    this.lista_elses = lista_elses;
    this.linea = linea;
    this.columna = columna;
    this.entornoTrad = new TablaSim(null, "");
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let ts_local = new TablaSim(ts, "If");
    ts.setSiguiente(ts_local);
    this.entornoTrad = ts_local;
    let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
    if (this.condicion.getTipo(controlador, ts, ts_u) == tipo.BOOLEAN) {
      if (valor_condi) {
        for (let ins of this.lista_ifs) {
          let res = ins.ejecutar(controlador, ts_local, ts_u);
          if (
            ins instanceof Break ||
            res instanceof Break ||
            ins instanceof Continue ||
            res instanceof Continue
          ) {
            return res;
          }
          if (ins instanceof Break || res != null) {
            return res;
          }
        }
      } else {
        for (let ins of this.lista_elses) {
          let res = ins.ejecutar(controlador, ts_local, ts_u);
          if (
            ins instanceof Break ||
            res instanceof Break ||
            ins instanceof Continue ||
            res instanceof Continue
          ) {
            return res;
          }
          if (ins instanceof Break || res != null) {
            return res;
          }
          if (ins instanceof Return || res != null) {
            return res;
          }
        }
      }
    }
    return null;
  }
  recorrer(): Nodo {
    let padre = new Nodo("IF", "");
    padre.addHijo(this.condicion.recorrer());
    let ifs = new Nodo("IFS", "");
    for (let inst of this.lista_ifs) {
      ifs.addHijo(inst.recorrer());
    }
    padre.addHijo(ifs);

    let elses = new Nodo("ELSES", "");
    for (let inst of this.lista_elses) {
      elses.addHijo(inst.recorrer());
    }
    padre.addHijo(elses);

    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida = new Resultado3D();
    let v: Array<string> = [];
    let f: Array<string> = [];

    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%% IF %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";

    let nodo: Resultado3D = this.condicion.traducir(Temp, controlador, this.entornoTrad, ts_u);
    salida.codigo3D += nodo.codigo3D + "\n";

    nodo = this.arreglarBoolean(nodo, salida, Temp);
    v = nodo.etiquetasV;
    f = nodo.etiquetasF;

    salida.codigo3D += "//%%%%%%%%%%%%%%%%%5Verdaderas%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += Temp.escribirEtiquetas(v);
    console.log(this.lista_ifs);
    this.lista_ifs.forEach((element) => {
      let temp: Resultado3D = element.traducir(Temp, controlador, this.entornoTrad, ts_u);

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

    salida.codigo3D += "//%%%%%%%%%%%%%%%%Falssa%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += Temp.escribirEtiquetas(f);

    //Ejecucion del resto de else ifs ------------------
    this.lista_elses.forEach((element) => {
      let nodo: Resultado3D = element.traducir(Temp, controlador, this.entornoTrad, ts_u);
      salida.codigo3D += nodo.codigo3D;
      salida.codigo3D += nodo.saltos;
      // salida.codigo3D += temp.breaks;
      // salida.codigo3D += temp.continue;
      // salida.codigo3D += temp.retornos;
      /*
       if (temp.retornos.length > 0) {
         salida.tipo = temp.tipo;
         salida.valor = temp.valor;
       }*/
    });

    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%Saltos de Salida############## \n";
    salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
    salida.saltos = [];

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
}
