"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
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
        padre.addHijo(this.expresion.recorrer());
        for (let ins of this.list_inst) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // let v: Array<string> = [];
        // let f: Array<string> = [];
        //let nodo: Resultado3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        //salida.codigo3D += nodo.codigo3D;
        this.list_inst.forEach((element) => {
            let temp = element.traducir(Temp, controlador, ts, ts_u);
            // console.log(temp);
            salida.codigo3D += temp.codigo3D;
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        return salida;
    }
}
exports.Case = Case;
