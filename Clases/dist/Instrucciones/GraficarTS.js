"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficarTS = void 0;
const Nodo_1 = require("../AST/Nodo");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
class GraficarTS {
    constructor() {
    }
    ejecutar(controlador, ts, ts_u) {
        let aux = ts;
        let nuevaT = new Map(aux.tabla);
        let nueva = new TablaSim_1.TablaSim(null, aux.nombre);
        nueva.ant = aux.ant;
        nueva.tabla = nuevaT;
        if (ts != null)
            controlador.graficarTS.push(nueva);
    }
    ;
    recorrer() {
        let padre = new Nodo_1.Nodo("graficar_ts()", "");
        return padre;
    }
    ;
    traducir(Temp, controlador, ts, ts_u) {
    }
    ;
}
exports.GraficarTS = GraficarTS;
