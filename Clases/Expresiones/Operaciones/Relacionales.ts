import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Temporales } from "../../AST/Temporales";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";

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

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim): void {
      
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

  codigoAscii(cadena: string): number {
    let aux = 0;
    for (let index = 0; index < cadena.length; index++) {
      aux += cadena.charCodeAt(index);
    }
    return aux;
  }
}
