import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";
import { Identificador } from "./Identificador";

export class AccesoArreglo implements Expresion {
  public identificador: Identificador;
  public posicion1: Expresion;
  public posicion2: Expresion;
  public tipo: boolean;
  public especial: string;
  public especial2: string;
  public linea: number;
  public column: number;
  public tipito: tipo;

  constructor(
    identificador: any,
    posicion1: any,
    posicion2: any,
    tipo: boolean,
    esp: any,
    esp2: any,
    linea: number,
    column: number
  ) {
    this.identificador = identificador;
    this.posicion1 = posicion1;
    this.posicion2 = posicion2;
    this.tipo = tipo;
    this.especial = esp;
    this.especial2 = esp2;
    this.linea = linea;
    this.column = column;
    this.tipito = -1;
  }
  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let id_exists = ts.getSimbolo(this.identificador.identificador);
    if (id_exists != null) {
      return id_exists.tipo.tipo;
    }
  }

  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let id_exists = ts.getSimbolo(this.identificador.identificador);
    if (id_exists != null) {
      if (id_exists?.tipo.tipo != tipo.ARRAY) {
        let error = new Errores(
          "Semantico",
          `La variable ${this.identificador.identificador}, no es un Array`,
          this.linea,
          this.column
        );
        controlador.errores.push(error);
      } else {
        if (this.tipo == false) {
          let posi = this.posicion1.getValor(controlador, ts, ts_u);
          if (typeof posi == "number") {
            if (this.isInt(Number(posi))) {
              let res = id_exists.getValor()[posi];
              this.tipito = this.getTipito(res);
              return id_exists.getValor()[posi];
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${posi}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores(
              "Semantico",
              `El valor ${posi}, tipo de dato incorrecto`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
          }
        } else {
          if (this.especial != null && this.especial2 != null) {
            this.tipito = tipo.ARRAY;
            return id_exists.getValor();
          } else if (this.especial != null && this.especial2 == null) {
            let posi = this.posicion2.getValor(controlador, ts, ts_u);
            if (typeof posi == "number") {
              if (this.isInt(Number(posi))) {
                if (posi <= id_exists.getValor().lenth) {
                  let lista_valores: Array<any> = [];
                  for (let index = 0; index < posi + 1; index++) {
                    lista_valores.push(id_exists.getValor()[index]);
                  }
                  this.tipito = tipo.ARRAY;
                  return lista_valores;
                } else {
                  let error = new Errores(
                    "Semantico",
                    `El valor ${posi}, sobre pasa el limite del arreglo`,
                    this.linea,
                    this.column
                  );
                  controlador.errores.push(error);
                }
              } else {
                let error = new Errores(
                  "Semantico",
                  `El valor ${posi}, tipo de dato incorrecto`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${posi}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          } else if (this.especial == null && this.especial2 != null) {
            let posi = this.posicion1.getValor(controlador, ts, ts_u);
            if (typeof posi == "number") {
              if (this.isInt(Number(posi))) {
                let lista_valores: Array<any> = [];
                for (let index = posi; index < id_exists.getValor().length; index++) {
                  lista_valores.push(id_exists.getValor()[index]);
                }
                this.tipito = tipo.ARRAY;
                return lista_valores;
              } else {
                let error = new Errores(
                  "Semantico",
                  `El valor ${posi}, tipo de dato incorrecto`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${posi}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          } else {
            let posi = this.posicion1.getValor(controlador, ts, ts_u);
            let posi2 = this.posicion2.getValor(controlador, ts, ts_u);
            if (typeof posi == "number") {
              if (this.isInt(Number(posi))) {
                if (typeof posi2 == "number") {
                  if (this.isInt(Number(posi2))) {
                    if (posi2 <= id_exists.getValor().length) {
                      let lista_valores: Array<any> = [];
                      for (let index = posi; index < posi2 + 1; index++) {
                        lista_valores.push(id_exists.getValor()[index]);
                      }
                      this.tipito = tipo.ARRAY;
                      return lista_valores;
                    } else {
                      let error = new Errores(
                        "Semantico",
                        `El valor ${posi2}, sobre pasa el limite del arreglo`,
                        this.linea,
                        this.column
                      );
                      controlador.errores.push(error);
                    }
                  } else {
                    let error = new Errores(
                      "Semantico",
                      `El valor ${posi2}, tipo de dato incorrecto`,
                      this.linea,
                      this.column
                    );
                    controlador.errores.push(error);
                  }
                } else {
                  let error = new Errores(
                    "Semantico",
                    `El valor ${posi2}, tipo de dato incorrecto`,
                    this.linea,
                    this.column
                  );
                  controlador.errores.push(error);
                }
              } else {
                let error = new Errores(
                  "Semantico",
                  `El valor ${posi}, tipo de dato incorrecto`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores(
                "Semantico",
                `El valor ${posi}, tipo de dato incorrecto`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
            }
          }
        }
      }
    } else {
      let error = new Errores(
        "Semantico",
        `La variable ${this.identificador.identificador}, no se encuentra definida`,
        this.linea,
        this.column
      );
      controlador.errores.push(error);
    }
  }

  getTipoArreglo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    return this.tipito;
  }

  recorrer(): Nodo {
    let padre = new Nodo("ID", "");
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {}

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }
  isChar(n: string) {
    return n.length === 1 && n.match(/./i);
  }

  getTipito(lista: any) {
    if (typeof lista == "number") {
      if (this.isInt(Number(lista))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof lista == "string") {
      if (this.isChar(String(lista))) {
        return tipo.CARACTER;
      }
      return tipo.CADENA;
    } else if (typeof lista == "boolean") {
      return tipo.BOOLEAN;
    } else if (lista === null) {
      return tipo.NULO;
    } else {
      return tipo.NULO;
    }
  }
}
