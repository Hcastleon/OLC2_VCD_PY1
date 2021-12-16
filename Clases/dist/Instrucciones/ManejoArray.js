"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManejoArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class ManejoArray {
    constructor(identificador, expre2, operador, linea, column) {
        this.identificador = identificador;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                let valor_expre1;
                let valor_expre2;
                if (this.expre2 === null) {
                    valor_expre1 = simbolo.getValor();
                }
                else {
                    valor_expre1 = simbolo.getValor();
                    valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
                }
                switch (this.operador) {
                    case "push":
                        if (typeof valor_expre1 === "object") {
                            if (this.getTipoArray(valor_expre1) == this.getTipo(valor_expre2)) {
                                valor_expre1.push(valor_expre2);
                            }
                            else {
                                let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                        break;
                    case "pop":
                        if (typeof valor_expre1 === "object") {
                            valor_expre1.pop();
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    getTipoArray(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipo(dato) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof dato == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (dato === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Asignacion", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.ManejoArray = ManejoArray;
