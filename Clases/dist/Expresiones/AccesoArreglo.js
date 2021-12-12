"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArreglo = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoArreglo {
    constructor(identificador, accesos, linea, column) {
        this.identificador = identificador;
        this.niveles = accesos;
        //  this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts, ts_u) {
        /*if(ts.existe(this.identificador)){
            let simbolo = ts.getSimbolo(this.identificador);
            if(simbolo?.getTipo()==)

        }*/
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            if ((id_exists === null || id_exists === void 0 ? void 0 : id_exists.tipo.tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`);
            }
            else {
                let dimension = this.niveles.getValor(controlador, ts, ts_u);
                let array = id_exists.getValor();
                return array.getValor(dimension, array.valores, this.linea, this.column);
            }
        }
        else {
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
}
exports.AccesoArreglo = AccesoArreglo;
