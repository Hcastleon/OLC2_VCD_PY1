"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Nodo_1 = require("../AST/Nodo");
class Identificador {
    constructor(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.valor;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        // padre.addHijo(new Nodo(this.identificador, ""))
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Identificador = Identificador;
