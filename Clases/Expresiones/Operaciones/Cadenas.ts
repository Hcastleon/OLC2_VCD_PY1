import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Temporales } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from '../../TablaSimbolos/Tipo';

export class Cadenas implements Expresion {
  public expre1: Expresion;
  public expre2: Expresion;
  public expre3: Expresion;
  public operador: any;
  public linea: number;
  public column: number;

  constructor(
    expre1: Expresion,
    expre2: Expresion,
    expre3: Expresion,
    operador: any,
    linea: number,
    column: number
  ) {
    this.expre1 = expre1;
    this.expre2 = expre2;
    this.expre3 = expre3;
    this.linea = linea;
    this.column = column;
    this.operador = operador;
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) { }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_expre1;
    let valor_expre2;
    let valor_expre3;

    if (this.expre2 === null) {
      valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
    } else {
      if (this.expre3 === null) {
        valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
      } else {
        valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        valor_expre3 = this.expre3.getValor(controlador, ts, ts_u);
      }
    }

    switch (this.operador) {
      case "caracterposition":
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "number") {
            if (this.isInt(Number(valor_expre2))) {
              return valor_expre1.charAt(valor_expre2);
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${valor_expre2}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores(
              "Semantico",
              `El valor ${valor_expre2}, tipo de dato incorrecto`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores(
            "Semantico",
            `El valor ${valor_expre1}, tipo de dato incorrecto`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
        }
        break;
      case "substring":
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "number") {
            if (this.isInt(Number(valor_expre2))) {
              if (typeof valor_expre3 === "number") {
                if (this.isInt(Number(valor_expre3))) {
                  return valor_expre1.substring(valor_expre2, valor_expre3);
                } else {
                  let error = new Errores(
                    "Semantico",
                    `El valor ${valor_expre3}, tipo de dato incorrecto`,
                    this.linea,
                    this.column
                  );
                  controlador.errores.push(error);
                }
              } else {
                let error = new Errores(
                  "Semantico",
                  `El valor ${valor_expre3}, tipo de dato incorrecto`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${valor_expre2}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores(
              "Semantico",
              `El valor ${valor_expre2}, tipo de dato incorrecto`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores(
            "Semantico",
            `El valor ${valor_expre1}, tipo de dato incorrecto`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
        }
        break;
      case "length":
        if (typeof valor_expre1 === "string") {
          return valor_expre1.length;
        } else if (typeof valor_expre1 === "object") {
          return valor_expre1.length;
        } else {
          let error = new Errores(
            "Semantico",
            `El valor ${valor_expre1}, tipo de dato incorrecto`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
        }
        break;
      case "touppercase":
        if (typeof valor_expre1 === "string") {
          return valor_expre1.toUpperCase();
        } else {
          let error = new Errores(
            "Semantico",
            `El valor ${valor_expre1}, tipo de dato incorrecto`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
        }
        break;
      case "tolowercase":
        if (typeof valor_expre1 === "string") {
          return valor_expre1.toLowerCase();
        } else {
          let error = new Errores(
            "Semantico",
            `El valor ${valor_expre1}, tipo de dato incorrecto`,
            this.linea,
            this.column
          );
          controlador.errores.push(error);
        }
        break;
      default:
        break;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo(this.operador, "");
    if (this.operador == "caracterposition") {
      padre.addHijo(this.expre1.recorrer());
      padre.addHijo(this.expre2.recorrer());
    } else if (this.operador == "substring") {
      padre.addHijo(this.expre1.recorrer());
      padre.addHijo(this.expre2.recorrer());
      padre.addHijo(this.expre3.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
    }

    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/[a-zA-Z]/i);
  }

  getTipoArray(lista: any) {
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

  getTipoDato(dato: any) {
    if (typeof dato == "number") {
      if (this.isInt(Number(dato))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof dato == "string") {
      if (this.isChar(String(dato))) {
        return tipo.CARACTER;
      }
      return tipo.CADENA;
    } else if (typeof dato == "boolean") {
      return tipo.BOOLEAN;
    } else if (dato === null) {
      return tipo.NULO;
    }
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
      
  }
}
