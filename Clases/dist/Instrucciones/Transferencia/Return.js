"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Return {
    constructor(v) {
        this.valor_retur = v;
    }
    ejecutar(controlador, ts, ts_u) {
        if (this.valor_retur != null) {
            return this.valor_retur.getValor(controlador, ts, ts_u);
        }
        else {
            return this;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Retornar", "");
        if (this.valor_retur != null) {
            padre.addHijo(this.valor_retur.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Return = Return;
