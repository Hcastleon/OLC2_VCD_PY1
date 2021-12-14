"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForEsp = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Errores_1 = require("../../AST/Errores");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ForEsp {
    constructor(asi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a, _b;
        let variable = this.asig_decla;
        let valor_condi = this.actualizacion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "string") {
            variable.tipo = this.actualizacion.getTipo(controlador, ts, ts_u);
            // Se mete a la tabla de simbolos la variable
            let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
            let tamno = valor_condi.length;
            let contador = 0;
            siguiente: while (contador < tamno) {
                let ts_local = new TablaSim_1.TablaSim(ts, "ForIn");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    if (ts.existe(variable.identificador)) {
                        let valor = valor_condi.charAt(contador);
                        (_a = ts.getSimbolo(variable.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        contador += 1;
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                contador += 1;
            }
        }
        else if (typeof valor_condi == "object") {
            variable.tipo = this.getTipoArray(valor_condi);
            // Se mete a la tabla de simbolos la variable
            let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
            let tamno = valor_condi.length;
            let contador = 0;
            siguiente: while (contador < tamno) {
                let ts_local = new TablaSim_1.TablaSim(ts, "ForIn");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    if (ts.existe(variable.identificador)) {
                        let valor = valor_condi[contador];
                        (_b = ts.getSimbolo(variable.identificador)) === null || _b === void 0 ? void 0 : _b.setValor(valor);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        contador += 1;
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                contador += 1;
            }
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${this.actualizacion.getValor(controlador, ts, ts_u)}, no se permite este tipo de dato`, this.linea, this.columna);
            controlador.errores.push(error);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ForIn", "");
        padre.addHijo(this.actualizacion.recorrer());
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    getTipoArray(lista) {
        let tipito;
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                tipito = new Tipo_1.Tipo("ENTERO");
                return tipito;
            }
            tipito = new Tipo_1.Tipo("DOUBLE");
            return tipito;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                tipito = new Tipo_1.Tipo("CARACTER");
                return tipito;
            }
            tipito = new Tipo_1.Tipo("CADENA");
            return tipito;
        }
        else if (typeof lista[0] == "boolean") {
            tipito = new Tipo_1.Tipo("BOOLEAN");
            return tipito;
        }
        else if (lista[0] === null) {
            tipito = new Tipo_1.Tipo("NULO");
            return tipito;
        }
        else {
            tipito = new Tipo_1.Tipo("NULO");
            return tipito;
        }
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.ForEsp = ForEsp;
