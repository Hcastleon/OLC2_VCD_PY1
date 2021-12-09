"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class DoWhile {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condicion = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condicion == 'boolean') {
            let ts_local = new TablaSim_1.TablaSim(ts);
            for (let ins of this.lista_ins) {
                let res = ins.ejecutar(controlador, ts_local, ts_u);
                if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                    return res;
                }
                if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                }
                if (ins instanceof Return_1.Return || res != null) {
                    return res;
                }
            }
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                for (let ins of this.lista_ins) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                        return res;
                    }
                    if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DoWhile", "");
        padre.addHijo(new Nodo_1.Nodo("Do", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_ins = new Nodo_1.Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        padre.addHijo(new Nodo_1.Nodo("While", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.DoWhile = DoWhile;
