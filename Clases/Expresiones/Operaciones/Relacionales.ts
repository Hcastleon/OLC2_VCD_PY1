import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";
import { Temporales, Temporal, Resultado3D } from "../../AST/Temporales";
import { Simbolos } from "../../TablaSimbolos/Simbolos";

export class Relacionales extends Operacion implements Expresion {
  public constructor(
    expre1: Expresion,
    expre2: Expresion,
    expreU: boolean,
    op: string,
    linea: number,
    columna: number
  ) {
    super(expre1, expre2, expreU, op, linea, columna);
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
      case Operador.MENORQUE:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 < valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 < num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              //  return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            // return `**Error Sematnico -> No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char < valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char < num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii < valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii < num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 < num;
          }
        }
        break;
      case Operador.MAYORQUE:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 > valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 > num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char > valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char > num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii > valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii > num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 > num;
          }
        }

        break;
      case Operador.MENORIGUAL:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 <= valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 <= num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char <= valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char <= num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii <= valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii <= num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 <= num;
          }
        }
        break;
      case Operador.MAYORIGUAL:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 >= valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 >= num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char >= valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char >= num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii >= valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii >= num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 >= num;
          }
        }
        break;
      case Operador.IGUALIGUAL:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 == valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 == num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char == valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char == num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii == valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii == num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 == num;
          }
        }
        break;
      case Operador.DIFERENCIACION:
        if (typeof valor_exp1 == "number") {
          // Primer numero ENTERO, DOUBLE
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            return valor_exp1 != valor_exp2;
          } else if (typeof valor_exp2 == "string") {
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let num_char = valor_exp2.charCodeAt(0);
              return valor_exp1 != num_char;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            //Segundo BOOLEAN
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          }
        } else if (typeof valor_exp1 == "string") {
          if (valor_exp1.length == 1) {
            // Primero CHAR
            let num_char = valor_exp1.charCodeAt(0);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_char != valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let num_char2 = valor_exp2.charCodeAt(0);
                return num_char != num_char2;
              } else {
                //Segundo STRING
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else {
            //Primero String
            let num_ascii = this.codigoAscii(valor_exp1);
            if (typeof valor_exp2 == "number") {
              // Segundo numero ENTERO, DOUBLE
              return num_ascii != valor_exp2;
            } else if (typeof valor_exp2 == "string") {
              // Segundo numero String, Char
              if (valor_exp2.length == 1) {
                //Segundo Numero Char
                let error = new Errores(
                  "Semantico",
                  `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                  this.linea,
                  this.column
                );
                controlador.errores.push(error);
                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
              } else {
                // Segundo Numero String
                let num_ascii2 = this.codigoAscii(valor_exp2);
                return num_ascii != num_ascii2;
              }
            } else if (typeof valor_exp2 == "boolean") {
              // Segundo BOOLEAN
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          }
        } else if (typeof valor_exp1 == "boolean") {
          // Primer Numero BOOLEAN
          let num_exp1 = 1;
          if (valor_exp1 == false) {
            num_exp1 = 0;
          }
          if (typeof valor_exp2 == "number") {
            // Segundo numero ENTERO, DOUBLE
            let error = new Errores(
              "Semantico",
              `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
              this.linea,
              this.column
            );
            controlador.errores.push(error);
            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
          } else if (typeof valor_exp2 == "string") {
            // Segundo numero String, Char
            if (valor_exp2.length == 1) {
              //Segundo Numero Char
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            } else {
              // Segundo Numero String
              let error = new Errores(
                "Semantico",
                `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`,
                this.linea,
                this.column
              );
              controlador.errores.push(error);
              return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
            }
          } else if (typeof valor_exp2 == "boolean") {
            // Segundo BOOLEAN
            let num = 1;
            if (valor_exp2 === false) {
              num = 0;
            }
            return num_exp1 != num;
          }
        }
        break;
      default:
        break;
    }
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
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

    let result = new Resultado3D();
    result.tipo = tipo.BOOLEAN;

    if (valor1.tipo != tipo.BOOLEAN && valor1 instanceof Simbolos == false)
      result.codigo3D += valor1.codigo3D;
    if (valor2.tipo != tipo.BOOLEAN && valor2 instanceof Simbolos == false)
      result.codigo3D += valor2.codigo3D;

    switch (this.operador) {
      case Operador.MAYORQUE:
        return this.comparacion(result, valor1, valor2, ">", Temp, controlador, ts, ts_u);
      case Operador.MENORQUE:
        return this.comparacion(result, valor1, valor2, "<", Temp, controlador, ts, ts_u);
      case Operador.MENORIGUAL:
        return this.comparacion(result, valor1, valor2, "<=", Temp, controlador, ts, ts_u);
      case Operador.MAYORIGUAL:
        return this.comparacion(result, valor1, valor2, ">=", Temp, controlador, ts, ts_u);
      case Operador.DIFERENCIACION:
        return this.comparacion(result, valor1, valor2, "!=", Temp, controlador, ts, ts_u);
      case Operador.IGUALIGUAL:
        return this.comparacion(result, valor1, valor2, "==", Temp, controlador, ts, ts_u);
      default:
        return;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo(this.op_string, "");

    if (this.expreU) {
      // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre1.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
      //  padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre2.recorrer());
    }

    return padre;
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

    if (nodoIzq instanceof Simbolos && nodoDer instanceof Simbolos == false) {
      let temporal = Temp.nuevoTemporal();
      let res = this.relacionalIdAccess(nodoIzq, nodo.codigo3D, temporal, Temp, ts);
      nodo.codigo3D = res.op;

      nodo.codigo3D +=
        "if (" +
        res.val +
        " " +
        signo +
        " " +
        nodoDer.temporal.nombre +
        ") goto " +
        v +
        "; // Si es verdadero salta a " +
        v +
        "\n";
    } else if (nodoDer instanceof Simbolos && nodoIzq instanceof Simbolos == false) {
      let temporal = Temp.nuevoTemporal();
      let res = this.relacionalIdAccess(nodoDer, nodo.codigo3D, temporal, Temp, ts);
      nodo.codigo3D = res.op;

      nodo.codigo3D +=
        "if (" +
        nodoIzq.temporal.nombre +
        " " +
        signo +
        " " +
        res.val +
        ") goto " +
        v +
        "; // Si es verdadero salta a " +
        v +
        "\n";
    } else if (nodoDer instanceof Simbolos && nodoIzq instanceof Simbolos) {
      let temporal = Temp.nuevoTemporal();
      let res = this.relacionalIdAccess(nodoIzq, nodo.codigo3D, temporal, Temp, ts);
      nodo.codigo3D = res.op;
      let temporal2 = Temp.nuevoTemporal();
      let res2 = this.relacionalIdAccess(nodoDer, nodo.codigo3D, temporal2, Temp, ts);
      nodo.codigo3D = res2.op;

      nodo.codigo3D +=
        "if (" +
        res.val +
        " " +
        signo +
        " " +
        res2.val +
        ") goto " +
        v +
        "; // Si es verdadero salta a " +
        v +
        "\n";
    } else {
      console.log(nodoIzq);
      if (nodoIzq.codigo3D != "") nodo.codigo3D += nodoIzq.codigo3D;
      if (nodoDer.codigo3D != "") nodo.codigo3D += nodoDer.codigo3D;
      nodo.codigo3D +=
        "if (" +
        nodoIzq.temporal.nombre +
        " " +
        signo +
        " " +
        nodoDer.temporal.nombre +
        ") goto " +
        v +
        "; // Si es verdadero salta a " +
        v +
        "\n";

      let temp: string = Temp.temporal();
      let etiquetat: string = Temp.etiqueta();
      let etiquetaf: string = Temp.etiqueta();
      let salto: string = Temp.etiqueta();

      nodo.codigo3D += etiquetat + ": \n";
      nodo.codigo3D += temp + " = 1; \n";
      nodo.codigo3D += Temp.saltoIncondicional(salto);
      nodo.codigo3D += etiquetaf + ": \n";
      nodo.codigo3D += temp + " = 0; \n";
      nodo.codigo3D += salto + ": \n";
      nodo.temporal = new Temporal(temp);
    }

    nodo.codigo3D += "goto " + f + "; //si no se cumple salta a: " + f + "\n";
    nodo.etiquetasV = [];
    nodo.etiquetasV.push(v);
    nodo.etiquetasF = [];
    nodo.etiquetasF.push(f);
    return nodo;
  }

  relacionalIdAccess(nodo: any, op: string, temporal: any, Temp: Temporales, ts: TablaSim) {
    let val = Temp.temporal();
    if (ts.nombre != "Global" && nodo != null) {
      if (ts.entorno == 0) {
        ts.entorno = ts.entorno + ts.ant.entorno;
      }
      op += temporal.obtener() + " = P + " + nodo.posicion + "; \n";
      op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
    } else if (ts.nombre == "Global" && nodo != null) {
      op += val + " = stack[(int)" + nodo.posicion + "] ;\n";
    }
    return { op, val };
  }

  codigoAscii(cadena: string): number {
    let aux = 0;
    for (let index = 0; index < cadena.length; index++) {
      aux += cadena.charCodeAt(index);
    }
    return aux;
  }
}
