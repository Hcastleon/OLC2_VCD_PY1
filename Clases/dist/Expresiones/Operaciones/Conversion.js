"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversion = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Conversion {
    constructor(tipo, expre2, operador, linea, column) {
        this.tipo = tipo;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    getTipo(controlador, ts, ts_u) {
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre2;
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        switch (this.operador) {
            case 'parse':
                if (this.tipo.tipo == Tipo_1.tipo.DOUBLE || this.tipo.tipo == Tipo_1.tipo.ENTERO) {
                    if (typeof valor_expre2 === "string") {
                        return Number(valor_expre2);
                    }
                }
                else if (this.tipo.tipo == Tipo_1.tipo.BOOLEAN) {
                    if (typeof valor_expre2 === "string") {
                        if (valor_expre2.toLowerCase() == "true") {
                            return true;
                        }
                        return false;
                    }
                }
                break;
            case 'toint':
                if (typeof valor_expre2 === "number") {
                    if (!(this.isInt(Number(valor_expre2)))) {
                        return Math.round(valor_expre2);
                    }
                }
                break;
            /*case 'todouble':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.length;
                }
                break;
            case 'typeof':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toUpperCase();
                }
                break;
            case 'tostring':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toLowerCase();
                }
                break;*/
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Aritmetica", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
    twoDecimal(numberInt) {
        return Number((numberInt).toFixed(2));
    }
}
exports.Conversion = Conversion;
