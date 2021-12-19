"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class For {
    constructor(asi, condi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.condicion = condi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        this.asig_decla.ejecutar(controlador, ts, ts_u);
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "boolean") {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "For");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        this.actualizacion.ejecutar(controlador, ts, ts_u);
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                this.actualizacion.ejecutar(controlador, ts, ts_u);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("For", "");
        //  padre.addHijo(new Nodo("for", ""));
        // padre.addHijo(new Nodo("(", ""));
        padre.addHijo(this.asig_decla.recorrer());
        // padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.condicion.recorrer());
        //  padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.actualizacion.recorrer());
        //  padre.addHijo(new Nodo("{", ""));
        // let hijo_ins = new Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        //padre.addHijo(hijo_ins);
        //padre.addHijo(new Nodo("}", ""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  FOR  %%%%%%%%%%%%%%%%%%%%%%";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
        let nodoDeclaracion = this.asig_decla.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += nodoDeclaracion.codigo3D;
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let salto = Temp.etiqueta();
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  CONDICION %%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += salto + ": // Ciclicidad \n";
        salida.codigo3D += nodoCondicion.codigo3D;
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        let nodoAsignacion = this.actualizacion.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% VERDADERO FOR %%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        this.lista_ins.forEach(element => {
            let nodo = element.traducir(Temp, controlador, ts, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            //salida.continues = salida.continues.concat(nodo.continues);
            //salida.returns = salida.returns.concat(nodo.returns);
            /*if(nodo.retornos.length > 0){
                      salida.tipo = nodo.tipo;
                      salida.valor = nodo.valor;
                  }*/
        });
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% Saltos %%%%%%%%%%%%%%%%%%%%%%%%  \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        // salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
        salida.codigo3D += nodoAsignacion.codigo3D;
        salida.codigo3D += Temp.saltoIncondicional(salto);
        salida.codigo3D += "//%%%%%%%%%% FALSAS t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.saltos = [];
        salida.breaks = [];
        //  salida.continue = [];
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
exports.For = For;
