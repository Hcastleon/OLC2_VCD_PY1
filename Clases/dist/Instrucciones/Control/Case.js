"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
class Case {
    constructor(e, l, li, c) {
        this.expresion = e;
        this.list_inst = l;
        this.linea = li;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let ins of this.list_inst) {
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
        let padre = new Nodo_1.Nodo("CASE", "");
        padre.addHijo(new Nodo_1.Nodo("case", ""));
        padre.addHijo(this.expresion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(":", ""));
        let hijo_ins = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.list_inst) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        return padre;
    }
}
exports.Case = Case;
