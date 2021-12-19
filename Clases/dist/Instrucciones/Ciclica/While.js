"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
const Temporales_1 = require("../../AST/Temporales");
class While {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "boolean") {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "While");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                        return res;
                    }
                    if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("While", "");
        padre.addHijo(this.condicion.recorrer());
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let ciclo = Temp.etiqueta();
        salida.codigo3D += ciclo + ": //Etiqueta para controlar el ciclado";
        salida.codigo3D += nodoCondicion.codigo3D;
        //salida.etiquetasF = salida.etiquetasF.concat(nodoCondicion.etiquetasF)
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%% Verdadera %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        this.lista_ins.forEach((element) => {
            let nodo = element.traducir(Temp, controlador, ts, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            // salida.continue = salida.continue.concat(nodo.continue);
            // salida.returns = salida.returns.concat(nodo.returns);
            /*if (nodo.retornos.length > 0) {
                 salida.tipo = nodo.tipo;
                 salida.valor = nodo.valor;
               }*/
        });
        salida.codigo3D += "//%%%%%%%%%% SALTOS y CICLO %%%%%%%%%%%%%%%%%%%% \n";
        //salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.codigo3D += Temp.saltoIncondicional(ciclo);
        salida.codigo3D += "//%%%%%%%%%% FALSas t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.breaks = [];
        salida.saltos = [];
        // salida.continue = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.While = While;
