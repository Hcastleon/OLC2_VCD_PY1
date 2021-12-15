import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Primitivo } from "../Expresiones/Primitivo";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";
import { Break } from "./Transferencia/Break";
import { Continue } from "./Transferencia/Continue";
import { Return } from "./Transferencia/Return";

export class Funcion extends Simbolos implements Instruccion {
  public lista_ints: Array<Instruccion>;
  public linea: number;
  public column: number;

  constructor(
    simbolo: number,
    tipo: Tipo,
    identificador: string,
    lista_params: any,
    metodo: any,
    lista_ints: any,
    linea: any,
    columna: any
  ) {
    super(simbolo, tipo, identificador, null, lista_params, metodo);
    this.lista_ints = lista_ints;
    this.linea = linea;
    this.column = columna;
  }

  agregarSimboloFunc(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    if (!ts.existe(this.identificador)) {
      ts.agregar(this.identificador, this);
      ts_u.agregar(this.identificador, this);
    } else {
      //Erro Semantico
    }
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let ts_local = new TablaSim(ts, this.identificador);
    ts.setSiguiente(ts_local);
    let valor_type = this.tipo.stype;
    let tipo_aux = "";

    if (valor_type == "ENTERO" || valor_type == "DECIMAL") {
      tipo_aux = "number";
    } else if (valor_type == "STRING" || valor_type == "CHAR") {
      tipo_aux = "string";
    } else if (valor_type == "BOOLEAN") {
      tipo_aux = "boolean";
    }

    for (let ins of this.lista_ints) {
      let result = ins.ejecutar(controlador, ts_local, ts_u);
      if (result != null) {
        if (result instanceof Errores) {
          return result;
        } else {
          if (ins instanceof Break || result instanceof Continue) {
            let error = new Errores(
              "Semantico",
              ` No se acepta el tipo en el entorno`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
          }
          if (ins instanceof Return) {
            return result;
          }
          if (tipo_aux == "VOID") {
            return;
          } else {
            if (typeof result == tipo_aux) {
              return result;
            } else {
              let error = new Errores(
                "Semantico",
                ` La funcion no concuerda con el tipo`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          }
        }
      }
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo(this.identificador, "");
    this.lista_ints.forEach(element => {
      padre.addHijo(element.recorrer());
    });

    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
      
  }
}
