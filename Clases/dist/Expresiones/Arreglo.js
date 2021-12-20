"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../AST/Nodo");
class Arreglo {
    // public niveles: Array<Expresion>;
    // public linea: number;
    // public column: number;
    constructor(valores) {
        this.valores = valores;
    }
    getValor(controlador, ts, ts_u) {
        let lista_valores = [];
        this.valores.forEach(element => {
            let valor_condicional = element.getValor(controlador, ts, ts_u);
            lista_valores.push(valor_condicional);
        });
        return lista_valores;
    }
    getTipo(controlador, ts, ts_u) {
    }
    getTipoArreglo(controlador, ts, ts_u, tipoo) {
        let flag = false;
        for (let element of this.valores) {
            //let valor_condicional = element.getValor(controlador, ts, ts_u);
            let valor_tipo = element.getTipo(controlador, ts, ts_u);
            if (valor_tipo != tipoo.tipo) {
                flag = true;
                break;
            }
            /*if (typeof valor_condicional == "number") {
              if (this.isInt(Number(valor_condicional))) {
                if (tipoo.tipo != tipo.ENTERO) {
                  flag = true;
                  break;
                }
              } else {
                if (tipoo.tipo != tipo.DOUBLE) {
                  flag = true;
                  break;
                }
              }
            } else if (typeof valor_condicional == "string") {
              if (this.isChar(String(valor_condicional))) {
                if (tipoo.tipo != tipo.CARACTER) {
                  flag = true;
                  break;
                }
              } else {
                if (tipoo.tipo != tipo.CADENA) {
                  flag = true;
                  break;
                }
              }
            } else if (typeof valor_condicional == "boolean") {
              if (tipoo.tipo != tipo.BOOLEAN) {
                flag = true;
                break;
              }
            } else if (valor_condicional === null) {
              if (tipoo.tipo != tipo.NULO) {
                flag = true;
                break;
              }
            }*/
        }
        if (flag == false) {
            return tipoo.tipo;
        }
        else {
            return -1;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.Arreglo = Arreglo;
