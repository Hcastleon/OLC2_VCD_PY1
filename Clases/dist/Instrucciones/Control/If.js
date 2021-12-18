"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class If {
    constructor(condicion, lista_ifs, lista_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.linea = linea;
        this.columna = columna;
        this.entornoTrad = new TablaSim_1.TablaSim(null, "");
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, "If");
        ts.setSiguiente(ts_local);
        this.entornoTrad = ts_local;
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (this.condicion.getTipo(controlador, ts, ts_u) == Tipo_1.tipo.BOOLEAN) {
            if (valor_condi) {
                for (let ins of this.lista_ifs) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break ||
                        res instanceof Break_1.Break ||
                        ins instanceof Continue_1.Continue ||
                        res instanceof Continue_1.Continue) {
                        return res;
                    }
                    if (ins instanceof Break_1.Break || res != null) {
                        return res;
                    }
                }
            }
            else {
                for (let ins of this.lista_elses) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break ||
                        res instanceof Break_1.Break ||
                        ins instanceof Continue_1.Continue ||
                        res instanceof Continue_1.Continue) {
                        return res;
                    }
                    if (ins instanceof Break_1.Break || res != null) {
                        return res;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("IF", "");
        padre.addHijo(this.condicion.recorrer());
        let ifs = new Nodo_1.Nodo("IFS", "");
        for (let inst of this.lista_ifs) {
            ifs.addHijo(inst.recorrer());
        }
        padre.addHijo(ifs);
        let elses = new Nodo_1.Nodo("ELSES", "");
        for (let inst of this.lista_elses) {
            elses.addHijo(inst.recorrer());
        }
        padre.addHijo(elses);
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let v = [];
        let f = [];
        let nodo = this.condicion.traducir(Temp, controlador, this.entornoTrad, ts_u);
        salida.codigo3D += nodo.codigo3D + "\n";
        nodo = this.arreglarBoolean(nodo, salida, Temp);
        v = nodo.etiquetasV;
        f = nodo.etiquetasF;
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%5Verdaderas%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(v);
        console.log(this.lista_ifs);
        this.lista_ifs.forEach((element) => {
            let temp = element.traducir(Temp, controlador, this.entornoTrad, ts_u);
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
        salida.codigo3D += "//%%%%%%%%%%%%%%%%Falssa%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(f);
        //Ejecucion del resto de else ifs ------------------
        this.lista_elses.forEach((element) => {
            let nodo = element.traducir(Temp, controlador, this.entornoTrad, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.codigo3D += nodo.saltos;
            // salida.codigo3D += temp.breaks;
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%Saltos de Salida############## \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.saltos = [];
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
}
exports.If = If;
