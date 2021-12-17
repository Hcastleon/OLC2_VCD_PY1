"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
class Break {
    constructor() { }
    ejecutar(controlador, ts, ts_u) {
        return this;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let nodo = new Temporales_1.Resultado3D();
        let salto = Temp.etiqueta();
        nodo.codigo3D += Temp.saltoIncondicional(salto);
        nodo.breaks.push(salto);
        return nodo;
    }
}
exports.Break = Break;
