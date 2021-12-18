"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodoT = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
class NodoT {
    constructor(codigo, resultado) {
        this.codigo = [];
        this.resultado = "";
        this.verdaderas = [];
        this.falsas = [];
        this.localizacion = Tipo_1.Ubicacion.HEAP;
        this.posicion = "";
        this.saltos = [];
        this.breaks = [];
        this.continue = [];
        this.retornos = [];
        this.id = "";
        // super(tipo,valor);
        if (codigo != undefined && resultado != undefined) {
            this.codigo = codigo;
            this.resultado = resultado;
        }
    }
}
exports.NodoT = NodoT;
