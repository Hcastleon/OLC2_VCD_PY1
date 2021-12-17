"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Temporales_1 = require("../../AST/Temporales");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
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
        padre.addHijo(this.valor.recorrer());
        for (let casito of this.list_cases) {
            padre.addHijo(casito.recorrer());
        }
        if (this.defaulteo != null) {
            padre.addHijo(this.defaulteo.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let v = [];
        let f = [];
        let nodo = this.valor.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += nodo.codigo3D + "\n";
        //
        this.list_cases.forEach((element) => {
            let caso = element;
            let der = caso.expresion.traducir(Temp, controlador, ts, ts_u);
            let comp = this.comparacion(salida, nodo, der, "==", Temp, controlador, ts, ts_u);
            comp = this.arreglarBoolean(comp, salida, Temp);
            v = comp.etiquetasV;
            f = comp.etiquetasF;
            salida.codigo3D += "//#############3Verdaderas##################3 \n";
            salida.codigo3D += Temp.escribirEtiquetas(v);
            //console.log(this.lista_ifs);
            caso.list_inst.forEach((element) => {
                let temp = element.traducir(Temp, controlador, ts, ts_u);
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
            let salto = Temp.etiqueta();
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.saltos.push(salto);
            salida.codigo3D += "//#####################Falssa###########3 \n";
            salida.codigo3D += Temp.escribirEtiquetas(f);
        });
        //--------------------Default
        let temp = this.defaulteo.traducir(Temp, controlador, ts, ts_u);
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
        //----------------
        salida.codigo3D += "//#################### Saltos de Salida############## \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.saltos = [];
        salida.codigo3D += "//#################### BREAKS############## \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.breaks = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            //console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
    comparacion(nodo, nodoIzq, nodoDer, signo, Temp, controlador, ts, ts_u) {
        nodo.tipo = Tipo_1.tipo.BOOLEAN;
        let v = Temp.etiqueta();
        let f = Temp.etiqueta();
        nodo.codigo3D += Temp.crearLinea("if (" +
            nodoIzq.temporal.nombre +
            " " +
            signo +
            " " +
            nodoDer.temporal.nombre +
            ") goto " +
            v, "Si es verdadero salta a " + v);
        nodo.codigo3D += Temp.crearLinea("goto " + f, "si no se cumple salta a: " + f);
        nodo.etiquetasV = [];
        nodo.etiquetasV.push(v);
        nodo.etiquetasF = [];
        nodo.etiquetasF.push(f);
        return nodo;
    }
}
exports.Switch = Switch;
