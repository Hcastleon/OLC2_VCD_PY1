"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../AST/Errores");
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
        let entornos = ts;
        let res = "";
        while (entornos.ant != null) {
            // let existe = ts.tabla.get(id.toLowerCase());
            let sigs = entornos.sig;
            if (sigs instanceof Array) {
                sigs.forEach((entorno) => {
                    if (entorno.nombre == this.identificador) {
                        res += "( ";
                        entorno.tabla.forEach((element) => {
                            if (element.valor == null) {
                                return (res = "(null");
                            }
                            res += element.valor + ", ";
                        });
                        res += ") ";
                        //return this.identificador;
                        return res;
                    }
                    // return this.identificador;
                });
                if (res == "") {
                    res = "";
                    let error = new Errores_1.Errores("Semantico", ` La variable ${this.identificador} no existe`, this.linea, this.columna);
                    controlador.errores.push(error);
                }
                return res;
            }
            entornos = entornos.ant;
        }
        return res;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        // padre.addHijo(new Nodo(this.identificador, ""))
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador}, no existe en el entorno`, this.linea, this.columna);
            controlador.errores.push(error);
        }
    }
}
exports.Identificador = Identificador;
