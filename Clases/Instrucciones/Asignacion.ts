import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Resultado3D } from "../AST/Temporales";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";

export class Asignacion implements Instruccion {
  public identificador: string;
  public valor: Expresion;
  public linea: number;
  public column: number;

  constructor(
    identificador: string,
    valor: Expresion,
    linea: number,
    column: number
  ) {
    this.identificador = identificador;
    this.valor = valor;
    this.linea = linea;
    this.column = column;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    if (ts.existe(this.identificador)) {
      let valor = this.valor.getValor(controlador, ts, ts_u);

      ts.getSimbolo(this.identificador)?.setValor(valor);
    } else {
      let error = new Errores(
        "Semantico",
        `La variable ${this.valor.getValor(
          controlador,
          ts,
          ts_u
        )}, no existe en el entorno`,
        this.linea,
        this.column
      );
      controlador.errores.push(error);
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("=", "");
    padre.addHijo(new Nodo(this.identificador, ""));
    //padre.addHijo(new Nodo("=", ""))
    padre.addHijo(this.valor.recorrer());
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
    let salida: Resultado3D = new Resultado3D();

    //let valor = this.valor.traducir(Temp, controlador, ts, ts_u);
    let simbolo = ts.getSimbolo(this.identificador);

    if (simbolo != null) {

      let nodo: Resultado3D = this.valor.traducir(Temp, controlador, ts, ts_u);



      let ultimoT;
      if (nodo.codigo3D == "") {
        ultimoT = nodo.temporal.nombre
      } else {
        ultimoT = Temp.ultimoTemporal();
      }

      if (!(nodo.tipo == tipo.BOOLEAN)) {
        salida.codigo3D += nodo.codigo3D + "\n";
      } else {
        if(simbolo.valor == true){
            ultimoT = "1"
          }else{
            ultimoT = "0"
          }
      }

      if (ts.nombre != "Global" && simbolo != null) {
         if (ts.entorno == 0) {
            ts.entorno = ts.entorno + ts.ant.entorno;
          }
        let temp = Temp.temporal();
        salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";

        salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n"

        simbolo.posicion = ts.entorno;
        ts.entorno++;
      } else if (ts.nombre == "Global" && simbolo != null) {
        // ts.entorno++;
        salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n"

        simbolo.posicion = ts.entorno;
        ts.entorno++;

      }

    }

    return salida;

  }
}
