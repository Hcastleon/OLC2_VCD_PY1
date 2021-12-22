import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Temporales } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Simbolos } from "../../TablaSimbolos/Simbolos";
import { Resultado3D } from "../../AST/Temporales";
import { Temporal } from "../../AST/Temporales";

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

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}
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
    return n.length === 1 && n.match(/./i);
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

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    if (this.operador == "caracterposition") {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "caracterposition", 0);
    } else if (this.operador == "substring") {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "substring", 0);
    } else if (this.operador == "length") {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "length", 0);
    } else if (this.operador == "touppercase") {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "touppercase", 0);
    } else if (this.operador == "tolowercase") {
      return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "tolowercase", 0);
    }
    //modulo unario concatenar0  repetir
    return "Holiwis";
  }

  generarOperacionBinario(
    Temp: Temporales,
    controlador: Controller,
    ts: TablaSim,
    ts_u: TablaSim,
    signo: any,
    recursivo: any
  ) {
    let valor_expre1;
    let valor_expre2;
    let valor_expre3;
    if (this.expre2 === null) {
      valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
      valor_expre2 = new Resultado3D();
      valor_expre2.codigo3D = "";
      valor_expre2.temporal = new Temporal("0");
      valor_expre2.tipo = tipo.ENTERO;
      valor_expre3 = new Resultado3D();
      valor_expre3.codigo3D = "";
      valor_expre3.temporal = new Temporal("0");
      valor_expre3.tipo = tipo.ENTERO;
    } else {
      if (this.expre3 === null) {
        valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        valor_expre2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        valor_expre3 = new Resultado3D();
        valor_expre3.codigo3D = "";
        valor_expre3.temporal = new Temporal("0");
        valor_expre3.tipo = tipo.ENTERO;
      } else {
        valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        valor_expre2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        valor_expre3 = this.expre3.traducir(Temp, controlador, ts, ts_u);
      }
    }

    if (
      valor_expre1 == (null || undefined) ||
      valor_expre2 == (null || undefined) ||
      valor_expre3 == (null || undefined)
    )
      return null;

    let resultado = valor_expre1.codigo3D;
    if (resultado != "" && valor_expre2.codigo3D && (valor_expre3.codigo3D = "")) {
      resultado = resultado + "\n" + valor_expre2.codigo3D;
    } else if (resultado != "" && valor_expre2.codigo3D && valor_expre3.codigo3D) {
      resultado = resultado + "\n" + valor_expre2.codigo3D + "\n" + valor_expre3.codigo3D;
    } else {
      /* tendria que ir pinshe error culero */
      resultado += valor_expre2.codigo3D;
    }
    if (
      valor_expre1 instanceof Simbolos ||
      valor_expre2 instanceof Simbolos ||
      valor_expre3 instanceof Simbolos
    ) {
      resultado = "";
    }
    if (resultado != "") {
      resultado = resultado + "\n";
    }

    let result = new Resultado3D();
    result.tipo = tipo.CADENA;

    if (this.expre2 === null) {
      if (signo == "length") {
        if (valor_expre1 instanceof Simbolos) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            //----------------
            let temp3 = Temp.temporal();
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += temp3 + " = 0; //inicia el contador\n";
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp2 + "]; //Posicion de inicio de la cadena\n";

            result.codigo3D +=
              Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
              "//Si se cumple es el final de cadena \n";
            result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de contador \n";
            result.codigo3D += Temp.saltoIncondicional(v);
            result.codigo3D += f + ": \n";
            result.tipo = tipo.ENTERO;
            result.temporal = new Temporal(temp3);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp = Temp.temporal();
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            //----------------
            let temp2 = Temp.temporal();
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += temp2 + " = 0; //inicia el contador\n";
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";

            result.codigo3D +=
              Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
              "//Si se cumple es el final de cadena \n";
            result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            result.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de contador \n";
            result.codigo3D += Temp.saltoIncondicional(v);
            result.codigo3D += f + ": \n";
            result.tipo = tipo.ENTERO;
            result.temporal = new Temporal(temp2);
          }
        } else if (valor_expre1.tipo == tipo.CADENA) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            //----------------
            let temp2 = Temp.temporal();
            result.codigo3D += temp2 + "= " + valor_expre1.temporal.nombre + "; \n";
            let temp3 = Temp.temporal();
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += temp3 + " = 0; //inicia el contador\n";
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp2 + "]; //Posicion de inicio de la cadena\n";

            result.codigo3D +=
              Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
              "//Si se cumple es el final de cadena \n";
            result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de contador \n";
            result.codigo3D += Temp.saltoIncondicional(v);
            result.codigo3D += f + ": \n";
            result.tipo = tipo.ENTERO;
            result.temporal = new Temporal(temp3);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp = Temp.temporal();
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            //----------------
            let temp2 = Temp.temporal();
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += temp2 + " = 0; //inicia el contador\n";
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";

            result.codigo3D +=
              Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
              "//Si se cumple es el final de cadena \n";
            result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            result.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de contador \n";
            result.codigo3D += Temp.saltoIncondicional(v);
            result.codigo3D += f + ": \n";
            result.tipo = tipo.ENTERO;
            result.temporal = new Temporal(temp2);
          }
        }
      } else if (signo == "touppercase") {
        if (valor_expre1 instanceof Simbolos) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
            result.codigo3D += aux + " = " + aux + " - 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
            result.codigo3D += aux + " = " + aux + " - 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          }
        } else if (valor_expre1.tipo == tipo.CADENA) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
            result.codigo3D += aux + " = " + aux + " - 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
            result.codigo3D += aux + " = " + aux + " - 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          }
        }
      } else if (signo == "tolowercase") {
        if (valor_expre1 instanceof Simbolos) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
            result.codigo3D += aux + " = " + aux + " + 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
            result.codigo3D += aux + " = " + aux + " + 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          }
        } else if (valor_expre1.tipo == tipo.CADENA) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
            result.codigo3D += aux + " = " + aux + " + 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
            result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
            result.codigo3D += aux + " = " + aux + " + 32; \n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";

            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.temporal = new Temporal(temp0);
          }
        }
      } else {
        console.log("chinga tu madre no se que pedo ");
      }
    } else if (this.expre3 === null) {
      if (signo == "caracterposition") {
        if (valor_expre1 instanceof Simbolos && valor_expre2 instanceof Simbolos == false) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          }
        } else if (valor_expre1 instanceof Simbolos && valor_expre2 instanceof Simbolos) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D += temp2 + " = P + " + valor_expre2.posicion + ";\n";
            result.codigo3D += temp2 + " = stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp3 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = stack[(int)" + valor_expre2.posicion + "];\n";
            result.codigo3D += temp3 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          }
        } else if ((valor_expre1.tipo = tipo.CADENA && valor_expre2 instanceof Simbolos == false)) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D +=
              temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          }
        } else if (valor_expre1.tipo == tipo.CADENA && valor_expre2 instanceof Simbolos) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D +=
              temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
            result.codigo3D += temp2 + " = P + " + valor_expre2.posicion + ";\n";
            result.codigo3D += temp2 + " = stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp3 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = stack[(int)" + valor_expre2.posicion + "];\n";
            result.codigo3D += temp3 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f2 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";

            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
            result.codigo3D += f2 + ": \n";
            result.tipo = tipo.CARACTER;
            result.temporal = new Temporal(temp0);
          }
        }
      }
    } else {
      if (signo == "substring") {
        if (
          valor_expre1 instanceof Simbolos &&
          valor_expre2 instanceof Simbolos == false &&
          valor_expre3 instanceof Simbolos == false
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D +=
              temp3 +
              " = " +
              valor_expre3.temporal.nombre +
              "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1 instanceof Simbolos &&
          valor_expre2 instanceof Simbolos &&
          valor_expre3 instanceof Simbolos == false
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp3 +
              " = " +
              valor_expre3.temporal.nombre +
              "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1 instanceof Simbolos &&
          valor_expre2 instanceof Simbolos == false &&
          valor_expre3 instanceof Simbolos
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D +=
              temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1 instanceof Simbolos &&
          valor_expre2 instanceof Simbolos &&
          valor_expre3 instanceof Simbolos
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
            result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1.tipo == tipo.CADENA &&
          valor_expre2 instanceof Simbolos == false &&
          valor_expre3 instanceof Simbolos == false
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D +=
              temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D +=
              temp3 +
              " = " +
              valor_expre3.temporal.nombre +
              "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1.tipo == tipo.CADENA &&
          valor_expre2 instanceof Simbolos &&
          valor_expre3 instanceof Simbolos == false
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D +=
              temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
            result.codigo3D +=
              temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp3 +
              " = " +
              valor_expre3.temporal.nombre +
              "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1.tipo == tipo.CADENA &&
          valor_expre2 instanceof Simbolos == false &&
          valor_expre3 instanceof Simbolos
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D +=
              temp2 +
              " = " +
              valor_expre2.temporal.nombre +
              ";  // la posicion que quiero obtener\n";
            result.codigo3D +=
              temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        } else if (
          valor_expre1.tipo == tipo.CADENA &&
          valor_expre2 instanceof Simbolos &&
          valor_expre3 instanceof Simbolos
        ) {
          if (ts.nombre != "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D +=
              temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
            result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
            result.codigo3D +=
              temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
            result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
            result.codigo3D += temp4 + " = 0; // contador de posicion \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          } else if (ts.nombre == "Global" && valor_expre1 != null) {
            result.codigo3D += valor_expre1.codigo3D;
            let temp0 = Temp.temporal();
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            let temp4 = Temp.temporal();
            result.codigo3D += temp0 + " = H + 0; \n";
            result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
            result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
            result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
            result.codigo3D += temp4 + " = 0 ; \n";
            //----------------
            let aux: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let v2: string = Temp.etiqueta();
            let v3: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            let f2: string = Temp.etiqueta();
            let f3: string = Temp.etiqueta();
            result.codigo3D += v + ": \n";
            result.codigo3D +=
              aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
            result.codigo3D += f + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v2 + ": \n";
            result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
            result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += temp + " = " + temp + " + 1; \n";
            result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
            result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
            result.codigo3D += f2 + ": \n";
            result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "goto " + f3 + " ; //salimos\n";
            result.codigo3D += v3 + ": \n";
            result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
            result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
            result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
            result.codigo3D += f3 + ": \n";
            result.tipo = tipo.CADENA;
            result.temporal = new Temporal(temp0);
          }
        }
      } else {
        console.log("ni pedo no te tocaba");
      }
    }
    return result;
  }
}
