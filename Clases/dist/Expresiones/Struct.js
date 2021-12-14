"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Struct extends Simbolos_1.Simbolos {
    constructor(id, declaraciones, lista_params, linea, columna) {
        super(1, new Tipo_1.Tipo('STRUCT'), id, null, lista_params, false);
        this.identificador = id;
        this.declaraciones = declaraciones;
        this.entorno = new TablaSim_1.TablaSim(null, "");
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
}
exports.Struct = Struct;
