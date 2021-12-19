"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Ternario {
    constructor(condicion, verdadero, falso, linea, columna) {
        this.verdadero = verdadero;
        this.condicion = condicion;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getTipo(controlador, ts, ts_u) : this.falso.getTipo(controlador, ts, ts_u);
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`);
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getValor(controlador, ts, ts_u) : this.falso.getValor(controlador, ts, ts_u);
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("TERNARIO", "");
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("=", ""));
        padre.addHijo(this.verdadero.recorrer());
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("?", ""));
        padre.addHijo(this.falso.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let izq = this.verdadero.traducir(Temp, controlador, ts, ts_u);
        let der = this.falso.traducir(Temp, controlador, ts, ts_u);
        let salida = new Temporales_1.Resultado3D();
        salida.temporal = new Temporales_1.Temporal("");
        let temporal = Temp.temporal();
        let s = Temp.etiqueta();
        salida.temporal.nombre = temporal;
        salida.tipo = izq.tipo;
        salida.codigo3D += nodoCondicion.codigo3D;
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  TERNARIO %%%%%%%%%%%%%%%%%%%%% \n";
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI VERDADERA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        salida.codigo3D += izq.codigo3D;
        if (izq.tipo === Tipo_1.tipo.BOOLEAN)
            izq = this.arreglarBooleanA(izq, salida, Temp);
        salida.codigo3D += temporal + " = " + izq.temporal.nombre + "; // Si es verdadero esto es su retorno \n";
        salida.codigo3D += Temp.saltoIncondicional(s);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI FALSA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += der.codigo3D;
        if (der.tipo === Tipo_1.tipo.BOOLEAN)
            der = this.arreglarBooleanA(der, salida, Temp);
        salida.codigo3D += temporal + " = " + der.temporal.nombre + "; // Si es falsa aqui se retorna \n";
        salida.codigo3D += s + ": \n";
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
    arreglarBooleanA(nodo, salida, Temp) {
        if (nodo.etiquetasV != null) {
            let temporal = Temp.temporal();
            let salto = Temp.etiqueta();
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
            salida.codigo3D += temporal + " = 1 //Verdadero \n";
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
            salida.codigo3D += temporal + " = 0 //Falsa \n";
            salida.codigo3D += salto + ":";
            nodo.temporal.nombre = temporal;
            nodo.etiquetasV = [];
            nodo.etiquetasF = [];
        }
        return nodo;
    }
}
exports.Ternario = Ternario;
