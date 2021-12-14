"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionStruct = void 0;
const Nodo_1 = require("../AST/Nodo");
class AsignacionStruct {
    constructor(identificador1, identificador2, valor, linea, column) {
        this.identificador1 = identificador1;
        this.identificador2 = identificador2;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        let entornos = ts.sig;
        if (entornos instanceof Array) {
            entornos.forEach(entorno => {
                var _a;
                if (entorno.nombre == this.identificador1.identificador) {
                    // let valor = entorno.getSimbolo(this.identificador2);
                    let valor = this.valor.getValor(controlador, ts, ts_u);
                    // let valor = vara.getValor();
                    (_a = entorno.getSimbolo(this.identificador2.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
                }
            });
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador1.identificador, ""));
        //padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.valor.recorrer());
        return padre;
    }
}
exports.AsignacionStruct = AsignacionStruct;
