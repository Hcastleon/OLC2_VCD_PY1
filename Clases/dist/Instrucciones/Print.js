"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
class Print {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor = this.expresion.getValor(controlador, ts, ts_u);
        controlador.append(valor);
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.addHijo(new Nodo_1.Nodo("pint", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.addHijo(this.expresion.recorrer());
        padre.addHijo(hijo);
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;
