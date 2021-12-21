import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";
import { Primitivo } from "../Expresiones/Primitivo";
import { Arreglo } from "../Expresiones/Arreglo";
import { AritArreglo } from "../Expresiones/Operaciones/AritArreglo";
import { Temporales, Resultado3D } from "../AST/Temporales";
import { Conversion } from "../Expresiones/Operaciones/Conversion";
import { AccesoArreglo } from "../Expresiones/AccesoArreglo";

export class Declaracion implements Instruccion {
  public tipo: Tipo;
  public stype: any;
  public lista_simbolos: Array<Simbolos>;
  public linea: number;
  public columna: number;

  constructor(tipo: any, lista_simbolos: any, linea: any, columna: any) {
    this.tipo = tipo;
    this.lista_simbolos = lista_simbolos;
    this.linea = linea;
    this.columna = columna;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    for (let simbolo of this.lista_simbolos) {
      let variable = simbolo as Simbolos;
      // Se verifica que la varaible no exista en la tabla de simbolos actual
      if (ts.existeEnActual(variable.identificador)) {
        let error = new Errores(
          "Semantico",
          `La variable ${variable.identificador}, ya se declaro anteriormente`,
          this.linea,
          this.columna
        );
        controlador.errores.push(error);
        continue;
      }

      if (variable.valor != null) {
        if (variable.valor instanceof Arreglo) {
          let valor = variable.valor.getValor(controlador, ts, ts_u);
          let tipo_valor = variable.valor.getTipoArreglo(controlador, ts, ts_u, this.tipo);
          if (tipo_valor == this.tipo.tipo) {
            let nuevo_sim = new Simbolos(
              variable.simbolo,
              new Tipo("ARRAY"),
              variable.identificador,
              valor
            );
            ts.agregar(variable.identificador, nuevo_sim); // array[0] //arreglo
            ts_u.agregar(variable.identificador, nuevo_sim);
          } else {
            let error = new Errores(
              "Semantico",
              `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`,
              this.linea,
              this.columna
            );
            controlador.errores.push(error);
          }
        } else if (variable.valor instanceof AritArreglo) {
          let valor = variable.valor.getValor(controlador, ts, ts_u);
          if (this.getTipo(valor) == this.tipo.tipo) {
            let nuevo_sim = new Simbolos(
              variable.simbolo,
              new Tipo("ARRAY"),
              variable.identificador,
              valor
            );
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
          } else {
            let error = new Errores(
              "Semantico",
              `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`,
              this.linea,
              this.columna
            );
            controlador.errores.push(error);
          }
        } else if (variable.valor instanceof Conversion) {
          let valor = variable.valor.getValor(controlador, ts, ts_u);
          let tipo_local = variable.valor.getTipo(controlador, ts, ts_u);
          if (tipo_local == this.tipo.tipo) {
            let nuevo_sim = new Simbolos(
              variable.simbolo,
              this.tipo,
              variable.identificador,
              valor
            );
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
          } else {
            let error = new Errores(
              "Semantico",
              `Las variables ${tipo_local} y ${this.tipo.tipo} no son del mismo tipo`,
              this.linea,
              this.columna
            );
            controlador.errores.push(error);
          }
        } else if (variable.valor instanceof AccesoArreglo) {
          let valor = variable.valor.getValor(controlador, ts, ts_u);
          let tipo_vemaos = variable.valor.getTipoArreglo(controlador, ts, ts_u);
          if (tipo_vemaos == this.tipo.tipo) {
            let nuevo_sim = new Simbolos(
              variable.simbolo,
              this.tipo,
              variable.identificador,
              valor
            );
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
          } else {
            let error = new Errores(
              "Semantico",
              `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`,
              this.linea,
              this.columna
            );
            controlador.errores.push(error);
          }
        } else {
          let valor = variable.valor.getValor(controlador, ts, ts_u);
          let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
          if (
            tipo_valor == this.tipo.tipo ||
            ((tipo_valor == tipo.DOUBLE || tipo_valor == tipo.ENTERO) &&
              (this.tipo.tipo == tipo.ENTERO || this.tipo.tipo == tipo.DOUBLE)) ||
            (tipo_valor == tipo.CADENA && this.tipo.tipo == tipo.CARACTER)
          ) {
            let nuevo_sim = new Simbolos(
              variable.simbolo,
              this.tipo,
              variable.identificador,
              valor
            );
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
          } else {
            let error = new Errores(
              "Semantico",
              `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`,
              this.linea,
              this.columna
            );
            controlador.errores.push(error);
          }
        }
      } else {
        let value: any;
        if (this.tipo.tipo == tipo.ENTERO) {
          value = 0;
        } else if (this.tipo.tipo == tipo.DOUBLE) {
          value = 0.0;
        } else {
          value = null;
        }
        let nuevo_sim = new Simbolos(variable.simbolo, this.tipo, variable.identificador, value);
        ts.agregar(variable.identificador, nuevo_sim);
        ts_u.agregar(variable.identificador, nuevo_sim);
      }
    }
  }

  getTipo(lista: any) {
    if (typeof lista[0] == "number") {
      if (this.isInt(Number(lista[0]))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof lista[0] == "string") {
      if (this.isChar(String(lista[0]))) {
        return tipo.CARACTER;
      }
      return tipo.CADENA;
    } else if (typeof lista[0] == "boolean") {
      return tipo.BOOLEAN;
    } else if (lista[0] === null) {
      return tipo.NULO;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo("=", "");
    // let hijo_sim = new Nodo("Simbolos", "")
    padre.addHijo(new Nodo(this.tipo.stype, ""));
    for (let simb of this.lista_simbolos) {
      let varia = simb as Simbolos;
      if (varia.valor != null) {
        padre.addHijo(new Nodo(simb.identificador, ""));
        // padre.addHijo(new Nodo("=", ""))
        let aux = simb.valor as Primitivo;
        padre.addHijo(aux.recorrer());
      }
    }
    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/./i);
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let salida: Resultado3D = new Resultado3D();

    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%% DECLARA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";

    for (let simbolo of this.lista_simbolos) {
      let variable = simbolo as Simbolos;

      let existe = ts.getSimbolo(variable.identificador);

      if (variable.valor != null) {
        let nodo: Resultado3D = variable.valor.traducir(Temp, controlador, ts, ts_u);

        let ultimoT;
        if (nodo.codigo3D == "") {
          ultimoT = nodo.temporal.nombre;
        } else {
          console.log(nodo);
          if (nodo.tipo == tipo.BOOLEAN) {
            if (nodo instanceof Simbolos == false) {
              salida.codigo3D += nodo.codigo3D + "\n";
            }

            salida.etiquetasV = salida.etiquetasV.concat(nodo.etiquetasV);
            salida.etiquetasF = salida.etiquetasF.concat(nodo.etiquetasF);

            if (ts.nombre != "Global" && existe != null) {
              if (ts.entorno == 0) {
                ts.entorno = ts.entorno + ts.ant.entorno;
              }
              let a = Temp.etiqueta();
              let temp = Temp.temporal();
              salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
              salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
              salida.codigo3D += "stack[(int)" + temp + "] = 1; \n";
              salida.codigo3D += "goto " + a + ";\n";
              salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
              salida.codigo3D += "stack[(int)" + temp + "] = 0; \n";
              salida.codigo3D += a + ": \n";
              existe.posicion = ts.entorno;
              ts.entorno++;
              return salida;
            } else if (ts.nombre == "Global" && existe != null) {
              let a = Temp.etiqueta();
              salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
              salida.codigo3D += "stack[(int)" + ts.entorno + "] = 1; \n";
              salida.codigo3D += "goto " + a + ";\n";
              salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
              salida.codigo3D += "stack[(int)" + ts.entorno + "] = 0; \n";
              salida.codigo3D += a + ": \n";
              existe.posicion = ts.entorno;
              ts.entorno++;
              return salida;
            }

            //ultimoT = nodo.temporal.nombre
          } else if (nodo.tipo == tipo.ID) {
            // EL tipo es ID pero lo usacom como referencia del incremneto o decremento
            if (ts.nombre != "Global" && existe != null) {
              if (ts.entorno == 0) {
                ts.entorno = ts.entorno + ts.ant.entorno;
              }

              salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";

              existe.posicion = ts.entorno;
              ts.entorno++;
            } else if (ts.nombre == "Global" && existe != null) {
              // ts.entorno++;
              salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";

              existe.posicion = ts.entorno;
              ts.entorno++;
            }
          } else if (nodo.tipo == tipo.CADENA) {
            ultimoT = nodo.temporal.nombre;
          } else if (nodo.tipo == tipo.DOUBLE) {
            ultimoT = nodo.temporal.nombre;
          } else {
            ultimoT = Temp.ultimoTemporal();
          }
        }

        if (nodo instanceof Simbolos == false) {
          salida.codigo3D += nodo.codigo3D + "\n";
        }

        if (ts.nombre != "Global" && existe != null) {
          if (ts.entorno == 0) {
            ts.entorno = ts.entorno + ts.ant.entorno;
          }

          let temp = Temp.temporal();
          salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";

          salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n";

          existe.posicion = ts.entorno;
          ts.entorno++;
        } else if (ts.nombre == "Global" && existe != null) {
          // ts.entorno++;
          salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";

          existe.posicion = ts.entorno;
          ts.entorno++;
        }
      } else {
        if (ts.nombre != "Global" && existe != null) {
          if (ts.entorno == 0) {
            ts.entorno = ts.entorno + ts.ant.entorno;
          }

          let temp = Temp.temporal();
          salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
          salida.codigo3D += "stack[(int)" + temp + "]  = 0; \n";

          existe.posicion = ts.entorno;
          ts.entorno++;
        } else if (ts.nombre == "Global" && existe != null) {
          // ts.entorno++;
          salida.codigo3D += "stack[(int)" + ts.entorno + "]  = 0; \n";

          existe.posicion = ts.entorno;
          ts.entorno++;
        }
      }
    }

    return salida;
  }
}
