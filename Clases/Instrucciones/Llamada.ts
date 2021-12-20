import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo } from "../TablaSimbolos/Tipo";
import { Funcion } from "./Funcion";

export class Llamada implements Instruccion, Expresion {
  public identificador: string;
  public parametros: Array<Expresion>;
  public linea: number;
  public column: number;

  constructor(identificador: any, para: any, linea: any, column: any) {
    this.identificador = identificador;
    this.parametros = para;
    this.linea = linea;
    this.column = column;
  }

  getTipo(controlador: Controller, ts: TablaSim) {
    if (ts.existe(this.identificador)) {
      let sim_func = ts.getSimbolo(this.identificador) as Funcion;
      return sim_func.tipo.tipo;
    } else {
      //TODO error
    }
  }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    return this.ejecutar(controlador, ts, ts_u);
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    if (ts.existe(this.identificador)) {
      let ts_local = new TablaSim(ts, this.identificador);
      ts.setSiguiente(ts_local);
      let sim_func = ts.getSimbolo(this.identificador) as Funcion;

      if (
        this.verificarParams(
          this.parametros,
          sim_func.lista_params,
          controlador,
          ts,
          ts_local,
          ts_u
        )
      ) {
        let r = sim_func?.ejecutar(controlador, ts_local, ts_u);

        if (r != null) {
          return r;
        }
        
      }
    } else {
      let error = new Errores(
        "Semantico",
        `La funcion ${this.identificador}, no existe`,
        this.linea,
        this.column
      );
      controlador.errores.push(error);
      controlador.append(
        `La funcion ${this.identificador}, no existe En la linea ${this.linea}, y columna ${this.column}`
      );
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("Llamada", "");
    padre.addHijo(new Nodo(this.identificador, ""));
    //padre.addHijo(new Nodo("(", ""));
    //let hijo_para = new Nodo("Parametros", "");
    if (this.parametros != null) {
      for (let para of this.parametros) {
       // let hijo_para2 = new Nodo("Parametro", "");
        padre.addHijo(para.recorrer());
       // hijo_para.addHijo(hijo_para2);
      }
    }
  //  padre.addHijo(hijo_para);
  //  padre.addHijo(new Nodo(")", ""));

    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
      
  }

  verificarParams(
    para_llama: Array<Expresion>,
    para_func: any,
    controlador: any,
    ts: any,
    ts_local: any,
    ts_u: any
  ) {
    if (para_llama.length == para_func?.length) {
      let aux: Simbolos;
      let id_aux: string;
      let tipo_axu;

      let exp_aux: Expresion;
      let tipo_valor;
      let valor_aux;

      for (let i = 0; i < para_llama.length; i++) {
        aux = para_func[i] as Simbolos;
        id_aux = aux.identificador;
        tipo_axu = aux.tipo.tipo; //Funcion

        exp_aux = para_llama[i] as Expresion;
        tipo_valor = exp_aux.getTipo(controlador, ts, ts_u); // de la llamada
        valor_aux = exp_aux.getValor(controlador, ts, ts_u);
        if (tipo_axu == tipo_valor||((tipo_axu == tipo.DOUBLE || tipo_axu == tipo.ENTERO) &&
              (tipo_valor == tipo.ENTERO || tipo_valor== tipo.DOUBLE)) ||
            (tipo_axu == tipo.CADENA && tipo_valor== tipo.CARACTER)
        ) {
          let simbolo = new Simbolos(aux.simbolo, aux.tipo, id_aux, valor_aux);
          ts_local.agregar(id_aux, simbolo);
          ts_u.agregar(id_aux, simbolo);
        }
      }
      return true;
    } else {
      let error = new Errores(
        "Semantico",
        `Las variables  no son del mismo tipo`,
        this.linea,
        this.column
      );
      controlador.errores.push(error);
      controlador.append(
        `Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.column}`
      );
    }
    return false;
  }
}
