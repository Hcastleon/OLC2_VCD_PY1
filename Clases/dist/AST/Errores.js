"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
class Errores {
    constructor(tipo, descripcion, linea, column) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.column = column;
    }
}
exports.Errores = Errores;
