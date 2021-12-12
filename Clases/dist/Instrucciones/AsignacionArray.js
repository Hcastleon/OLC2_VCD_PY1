"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AsignacionArray {
    constructor(identificador, accesos, valor, linea, column) {
        this.identificador = identificador;
        this.niveles = accesos;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a;
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`);
            }
            else {
                let dimension = this.niveles.getValor(controlador, ts, ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let array = simbolo.getValor();
                array.valores = array.setValor(dimension, array.valores, valor, this.linea, this.column);
                simbolo.valor = array;
                (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(simbolo);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Asignacion", "");
        return padre;
    }
}
exports.AsignacionArray = AsignacionArray;