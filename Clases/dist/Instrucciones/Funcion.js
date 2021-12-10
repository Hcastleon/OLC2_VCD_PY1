"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Break_1 = require("./Transferencia/Break");
const Return_1 = require("./Transferencia/Return");
class Funcion extends Simbolos_1.Simbolos {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_ints, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
        this.linea = linea;
        this.column = columna;
    }
    agregarSimboloFunc(controlador, ts, ts_u) {
        if (!(ts.existe(this.identificador))) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts);
        let valor_type = this.tipo.stype;
        let tipo_aux = "";
        if (valor_type == "ENTERO" || valor_type == "DECIMAL") {
            tipo_aux = 'number';
        }
        else if (valor_type == "STRING" || valor_type == "CHAR") {
            tipo_aux = 'string';
        }
        else if (valor_type == "BOOLEAN") {
            tipo_aux = 'boolean';
        }
        for (let ins of this.lista_ints) {
            let result = ins.ejecutar(controlador, ts_local, ts_u);
            if (result != null) {
                if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                    continue;
                }
                if (ins instanceof Return_1.Return) {
                    return result;
                }
                if (tipo_aux == 'VOID') {
                    return;
                }
                else {
                    if (typeof result == tipo_aux) {
                        return result;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', ` La variable no concuerda con el tipo`, this.linea, this.column);
                        controlador.errores.push(error);
                        controlador.append(`La variable no concuerda con el tipo, En la linea ${this.linea}, y columna ${this.column}`);
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Funcion", "");
        return padre;
    }
}
exports.Funcion = Funcion;
