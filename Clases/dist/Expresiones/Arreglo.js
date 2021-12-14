"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
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
            let valor_condicional = element.getValor(controlador, ts, ts_u);
            if (typeof valor_condicional == "number") {
                if (this.isInt(Number(valor_condicional))) {
                    if (tipoo.tipo != Tipo_1.tipo.ENTERO) {
                        flag = true;
                        break;
                    }
                }
                else {
                    if (tipoo.tipo != Tipo_1.tipo.DOUBLE) {
                        flag = true;
                        break;
                    }
                }
            }
            else if (typeof valor_condicional == "string") {
                if (this.isChar(String(valor_condicional))) {
                    if (tipoo.tipo != Tipo_1.tipo.CARACTER) {
                        flag = true;
                        break;
                    }
                }
                else {
                    if (tipoo.tipo != Tipo_1.tipo.CADENA) {
                        flag = true;
                        break;
                    }
                }
            }
            else if (typeof valor_condicional == "boolean") {
                if (tipoo.tipo != Tipo_1.tipo.BOOLEAN) {
                    flag = true;
                    break;
                }
            }
            else if (valor_condicional === null) {
                if (tipoo.tipo != Tipo_1.tipo.NULO) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag == false) {
            return tipoo.tipo;
        }
        else {
            return -1;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Arreglo = Arreglo;
