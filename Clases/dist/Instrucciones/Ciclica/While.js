"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class While {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "While");
                ts.setSiguiente(ts_local);
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
        let padre = new Nodo_1.Nodo("While", "");
        padre.addHijo(new Nodo_1.Nodo("while", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_inst = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_inst.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_inst);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.While = While;
