"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AsignacionArray {
    constructor(identificador, posicion, valor, linea, column) {
        this.identificador = identificador;
        this.posicion = posicion;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                let posi = this.posicion.getValor(controlador, ts, ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let valor_U = simbolo.getValor();
                if (typeof posi == "number") {
                    if (this.isInt(Number(posi))) {
                        if (this.getTipoArray(valor_U) == this.getTipo(valor)) {
                            valor_U[posi] = valor;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor}, es un tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
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
    traducir(Temp, controlador, ts, ts_u) { }
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
exports.AsignacionArray = AsignacionArray;
