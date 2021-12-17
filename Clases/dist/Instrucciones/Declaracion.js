"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Arreglo_1 = require("../Expresiones/Arreglo");
const AritArreglo_1 = require("../Expresiones/Operaciones/AritArreglo");
class Declaracion {
    constructor(tipo, lista_simbolos, linea, columna) {
        this.tipo = tipo;
        this.lista_simbolos = lista_simbolos;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo;
            // Se verifica que la varaible no exista en la tabla de simbolos actual
            if (ts.existeEnActual(variable.identificador)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${variable.identificador}, ya se declaro anteriormente`, this.linea, this.columna);
                controlador.errores.push(error);
                continue;
            }
            if (variable.valor != null) {
                if (variable.valor instanceof Arreglo_1.Arreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipoArreglo(controlador, ts, ts_u, this.tipo);
                    if (tipo_valor == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else if (variable.valor instanceof AritArreglo_1.AritArreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    if (this.getTipo(valor) == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
                    if (tipo_valor == this.tipo.tipo ||
                        ((tipo_valor == Tipo_1.tipo.DOUBLE || tipo_valor == Tipo_1.tipo.ENTERO) &&
                            (this.tipo.tipo == Tipo_1.tipo.ENTERO || this.tipo.tipo == Tipo_1.tipo.DOUBLE)) ||
                        (tipo_valor == Tipo_1.tipo.CADENA && this.tipo.tipo == Tipo_1.tipo.CARACTER)) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
            }
            else {
                let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, null);
                ts.agregar(variable.identificador, nuevo_sim);
                ts_u.agregar(variable.identificador, nuevo_sim);
            }
        }
    }
    getTipo(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        // let hijo_sim = new Nodo("Simbolos", "")
        padre.addHijo(new Nodo_1.Nodo(this.tipo.stype, ""));
        for (let simb of this.lista_simbolos) {
            let varia = simb;
            if (varia.valor != null) {
                padre.addHijo(new Nodo_1.Nodo(simb.identificador, ""));
                // padre.addHijo(new Nodo("=", ""))
                let aux = simb.valor;
                padre.addHijo(aux.recorrer());
            }
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
    traducir(Temp, controlador, ts, ts_u) { }
}
exports.Declaracion = Declaracion;
