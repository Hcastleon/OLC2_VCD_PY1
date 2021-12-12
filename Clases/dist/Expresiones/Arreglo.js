"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
class Arreglo {
    // public niveles: Array<Expresion>;
    // public linea: number;
    // public column: number;
    constructor(tipoo, tipoObjeto, valores) {
        this.tipoo = tipoo;
        this.tipoObjeto = tipoObjeto;
        this.valores = valores;
    }
    getValor(posicion, niveles, linea, columna) {
        let nivel = posicion;
        if (nivel > niveles.length - 1) {
            //Error posicion inexistente
            return niveles;
        }
        else {
            return niveles[nivel];
        }
    }
    setValor(posicion, niveles, value, linea, columna) {
        let nivel = posicion;
        if (nivel > niveles.length - 1) {
            //Error
            return niveles;
        }
        else {
            niveles[nivel] = value;
            return niveles;
        }
    }
}
exports.Arreglo = Arreglo;
