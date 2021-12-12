import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";

export class Aritmetica extends Operacion implements Expresion {
  constructor(
    expre1: any,
    expre2: any,
    expreU: any,
    operador: any,
    linea: any,
    column: any
  ) {
    super(expre1, expre2, expreU, operador, linea, column);
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor = this.getValor(controlador, ts, ts_u);

    if (typeof valor == "number") {
      if (this.isInt(Number(valor))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof valor == "string") {
      if (this.isChar(String(valor))) {
        return tipo.CARACTER;
      }
      return tipo.CADENA;
    } else if (typeof valor == "boolean") {
      return tipo.BOOLEAN;
    } else if (valor === null) {
      return tipo.NULO;
    }
  }

  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_expre1;
    let valor_expre2;
    let valor_U;

    if (this.expreU === false) {
      valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
      valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
    } else {
      valor_U = this.expre1.getValor(controlador, ts, ts_u);
    }

    switch (this.operador) {
      case Operador.SUMA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 + valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 + valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) + valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) + valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.RESTA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 - valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 - valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) - valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) - valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.MULT:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 * valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 * valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) * valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) * valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.DIV:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 / valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 / valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) / valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) / valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.MODULO:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 % valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 % valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) % valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) % valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.UNARIO:
        if (typeof valor_U === "number") {
          return -valor_U;
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.CONCATENAR:
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1 + valor_expre2;
          } else if (typeof valor_expre2 === "number") {
            return valor_expre1 + valor_expre2.toString();
          } else if (typeof valor_expre2 === "boolean") {
            return valor_expre1 + valor_expre2.toString();
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1.toString() + valor_expre2;
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "boolean") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1.toString() + valor_expre2;
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.REPETIR:
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "number") {
            if (this.isInt(Number(valor_expre2))) {
              var sum_concat = "";
              for (var _i = 0; _i < valor_expre2; _i++) {
                sum_concat = sum_concat + valor_expre1;
              }
              return sum_concat;
            }else{
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      default:
        break;
    }
  }

  recorrer(): Nodo {
    let padre = new Nodo(this.op_string, "");

    if (this.expreU) {
     // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre1.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
     // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre2.recorrer());
    }

    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/[a-zA-Z]/i);
  }
}
