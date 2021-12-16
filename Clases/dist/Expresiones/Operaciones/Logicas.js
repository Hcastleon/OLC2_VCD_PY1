"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
class Logicas extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expreU == false) {
            valor_exp1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_exp2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expU = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.AND:
                if (typeof valor_exp1 == "boolean") {
                    if (typeof valor_exp2 == "boolean") {
                        return valor_exp1 && valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.OR:
                if (typeof valor_exp1 == "boolean") {
                    if (typeof valor_exp2 == "boolean") {
                        return valor_exp1 || valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.NOT:
                if (typeof valor_expU == "boolean") {
                    return !valor_expU;
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            //  padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
    generarOperacionBinario(Temp, controlador, ts, ts_u, signo, recursivo) {
        let valor1;
        let valor2;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        }
        if (valor1 == (null || undefined) || valor2 == (null || undefined))
            return null;
        //-------
        //let resultado = "";
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.BOOLEAN;
        if (this.operador == Operaciones_1.Operador.OR) {
            result.codigo3D += valor1.codigo3D;
            //
            valor1 = this.arreglarBoolean(valor1, result, Temp);
            //
            result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasF);
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            result.etiquetasV = valor1.etiquetasV;
            result.etiquetasV = result.etiquetasV.concat(valor2.etiquetasV);
            result.etiquetasF = valor2.etiquetasF;
            //result.codigo3D = resultado;
            if (this.getValor(controlador, ts, ts_u) === true) {
                result.temporal = new Temporales_1.Temporal("true");
            }
            else {
                result.temporal = new Temporales_1.Temporal("false");
            }
            return result;
        }
        else if (this.operador == Operaciones_1.Operador.AND) {
            result.codigo3D += valor1.codigo3D;
            //
            valor1 = this.arreglarBoolean(valor1, result, Temp);
            //
            result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasV);
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            result.etiquetasV = valor2.etiquetasV;
            result.etiquetasF = valor1.etiquetasF;
            result.etiquetasF = result.etiquetasF.concat(valor2.etiquetasF);
            //result.codigo3D = resultado;
            if (this.getValor(controlador, ts, ts_u) === true) {
                result.temporal = new Temporales_1.Temporal("true");
            }
            else {
                result.temporal = new Temporales_1.Temporal("false");
            }
            return result;
        }
        else {
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            let v = valor2.etiquetasV;
            let f = valor2.etiquetasF;
            result.etiquetasF = v;
            result.etiquetasV = f;
            return result;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == Operaciones_1.Operador.AND) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "&&", 0);
        }
        else if (this.operador == Operaciones_1.Operador.OR) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "||", 0);
        }
        else if (this.operador == Operaciones_1.Operador.NOT) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "!", 0);
        }
        //modulo unario concatenar repetir
        return "Holiwis";
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
exports.Logicas = Logicas;
