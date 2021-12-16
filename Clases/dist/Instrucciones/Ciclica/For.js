"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class For {
    constructor(asi, condi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.condicion = condi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        this.asig_decla.ejecutar(controlador, ts, ts_u);
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "boolean") {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "For");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        this.actualizacion.ejecutar(controlador, ts, ts_u);
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                this.actualizacion.ejecutar(controlador, ts, ts_u);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("For", "");
        //  padre.addHijo(new Nodo("for", ""));
        // padre.addHijo(new Nodo("(", ""));
        padre.addHijo(this.asig_decla.recorrer());
        // padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.condicion.recorrer());
        //  padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.actualizacion.recorrer());
        //  padre.addHijo(new Nodo("{", ""));
        // let hijo_ins = new Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        //padre.addHijo(hijo_ins);
        //padre.addHijo(new Nodo("}", ""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.For = For;
