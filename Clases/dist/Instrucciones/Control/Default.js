"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
class Default {
    constructor(li, l, c) {
        this.list_ins = li;
        this.linea = l;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let ins of this.list_ins) {
            let res = ins.ejecutar(controlador, ts, ts_u);
            if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                return res;
            }
            if (ins instanceof Return_1.Return) {
                return res;
            }
            if (res != null) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DEFAULT", "");
        padre.addHijo(new Nodo_1.Nodo("default", ""));
        padre.addHijo(new Nodo_1.Nodo(":", ""));
        let hijo_ins = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.list_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        return padre;
    }
}
exports.Default = Default;
