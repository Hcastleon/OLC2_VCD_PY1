"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
class Switch {
    constructor(v, l, d, lin, c) {
        this.valor = v;
        this.list_cases = l;
        this.defaulteo = d;
        this.linea = lin;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, "Switch");
        ts.setSiguiente(ts_local);
        let aux = false;
        for (let ins of this.list_cases) {
            let caso = ins;
            if (this.valor.getValor(controlador, ts, ts_u) == caso.expresion.getValor(controlador, ts, ts_u)) {
                let res = ins.ejecutar(controlador, ts_local, ts_u);
                if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                    aux = true;
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
        if (!aux && this.defaulteo != null) {
            let res = this.defaulteo.ejecutar(controlador, ts, ts_u);
            if (res instanceof Break_1.Break) {
                aux = true;
                return res;
            }
            if (res instanceof Return_1.Return) {
                return res;
            }
            if (res != null) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SWITCH", "");
        padre.addHijo(new Nodo_1.Nodo("switch", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.valor.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_cases = new Nodo_1.Nodo("Casos", "");
        for (let casito of this.list_cases) {
            let hijito = new Nodo_1.Nodo("Case", "");
            hijito.addHijo(casito.recorrer());
            hijo_cases.addHijo(hijito);
        }
        padre.addHijo(hijo_cases);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Switch = Switch;
