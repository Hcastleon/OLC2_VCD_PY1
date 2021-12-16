"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    ejecutar(controlador, ts, ts_u) {
        return this;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Break = Break;
