"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArreglo = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoArreglo {
    constructor(identificador, posicion1, posicion2, tipo, esp, esp2, linea, column) {
        this.identificador = identificador;
        this.posicion1 = posicion1;
        this.posicion2 = posicion2;
        this.tipo = tipo;
        this.especial = esp;
        this.especial2 = esp2;
        this.linea = linea;
        this.column = column;
        this.tipito = -1;
    }
    getTipo(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            if ((id_exists === null || id_exists === void 0 ? void 0 : id_exists.tipo.tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                if (this.tipo == false) {
                    let posi = this.posicion1.getValor(controlador, ts, ts_u);
                    if (typeof posi == "number") {
                        if (this.isInt(Number(posi))) {
                            let res = id_exists.getValor()[posi];
                            this.tipito = this.getTipito(res);
                            return id_exists.getValor()[posi];
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    if (this.especial != null && this.especial2 != null) {
                        this.tipito = Tipo_1.tipo.ARRAY;
                        return id_exists.getValor();
                    }
                    else if (this.especial != null && this.especial2 == null) {
                        let posi = this.posicion2.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                if (posi <= id_exists.getValor().lenth) {
                                    let lista_valores = [];
                                    for (let index = 0; index < posi + 1; index++) {
                                        lista_valores.push(id_exists.getValor()[index]);
                                    }
                                    this.tipito = Tipo_1.tipo.ARRAY;
                                    return lista_valores;
                                }
                                else {
                                    let error = new Errores_1.Errores('Semantico', `El valor ${posi}, sobre pasa el limite del arreglo`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else if (this.especial == null && this.especial2 != null) {
                        let posi = this.posicion1.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                let lista_valores = [];
                                for (let index = posi; index < id_exists.getValor().length; index++) {
                                    lista_valores.push(id_exists.getValor()[index]);
                                }
                                this.tipito = Tipo_1.tipo.ARRAY;
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let posi = this.posicion1.getValor(controlador, ts, ts_u);
                        let posi2 = this.posicion2.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                if (typeof posi2 == "number") {
                                    if (this.isInt(Number(posi2))) {
                                        if (posi2 <= id_exists.getValor().length) {
                                            let lista_valores = [];
                                            for (let index = posi; index < posi2 + 1; index++) {
                                                lista_valores.push(id_exists.getValor()[index]);
                                            }
                                            this.tipito = Tipo_1.tipo.ARRAY;
                                            return lista_valores;
                                        }
                                        else {
                                            let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, sobre pasa el limite del arreglo`, this.linea, this.column);
                                            controlador.errores.push(error);
                                        }
                                    }
                                    else {
                                        let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, tipo de dato incorrecto`, this.linea, this.column);
                                        controlador.errores.push(error);
                                    }
                                }
                                else {
                                    let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, tipo de dato incorrecto`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador.identificador}, no se encuentra definida`, this.linea, this.column);
            controlador.errores.push(error);
        }
    }
    getTipoArreglo(controlador, ts, ts_u) {
        return this.tipito;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    getTipito(lista) {
        if (typeof lista == "number") {
            if (this.isInt(Number(lista))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista === null) {
            return Tipo_1.tipo.NULO;
        }
        else {
            return Tipo_1.tipo.NULO;
        }
    }
}
exports.AccesoArreglo = AccesoArreglo;
