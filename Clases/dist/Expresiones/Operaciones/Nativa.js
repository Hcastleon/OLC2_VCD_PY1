"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativa = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
class Nativa extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            if (this.isChar(String(valor))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.POTENCIA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return Math.pow(valor_expre1, valor_expre2);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.SENO:
                if (typeof valor_expre1 === "number") {
                    return Math.sin(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.COSENO:
                if (typeof valor_expre1 === "number") {
                    return Math.cos(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.TANGENTE:
                if (typeof valor_expre1 === "number") {
                    return Math.tan(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.RAIZ:
                if (typeof valor_expre1 === "number") {
                    return Math.sqrt(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.LOGARITMO:
                if (typeof valor_expre1 === "number") {
                    return Math.log10(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador.toString(), "");
        if (this.operador == Operaciones_1.Operador.POTENCIA) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Nativa = Nativa;
