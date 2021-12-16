"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
class Struct extends Simbolos_1.Simbolos {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_ints, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
        this.linea = linea;
        this.column = columna;
    }
    agregarSimboloStruct(controlador, ts, ts_u) {
        if (!ts.existe(this.identificador)) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        //this.entorno = new TablaSim(ts, this.identificador);
        // ts.setSiguiente(this.entorno);  
        /*
        this.declaraciones.forEach((ins) => {
            ins.ejecutar(controlador, this.entorno, ts_u);
        });*/
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Struct = Struct;
