"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.Operador = void 0;
const Nodo_1 = require("../../AST/Nodo");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULT"] = 2] = "MULT";
    Operador[Operador["DIV"] = 3] = "DIV";
    Operador[Operador["POTENCIA"] = 4] = "POTENCIA";
    Operador[Operador["MODULO"] = 5] = "MODULO";
    Operador[Operador["MENORQUE"] = 6] = "MENORQUE";
    Operador[Operador["MAYORQUE"] = 7] = "MAYORQUE";
    Operador[Operador["AND"] = 8] = "AND";
    Operador[Operador["NOT"] = 9] = "NOT";
    Operador[Operador["OR"] = 10] = "OR";
    Operador[Operador["MAYORIGUAL"] = 11] = "MAYORIGUAL";
    Operador[Operador["MENORIGUAL"] = 12] = "MENORIGUAL";
    Operador[Operador["IGUALIGUAL"] = 13] = "IGUALIGUAL";
    Operador[Operador["DIFERENCIACION"] = 14] = "DIFERENCIACION";
})(Operador = exports.Operador || (exports.Operador = {}));
class Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        this.expre1 = expre1;
        this.expre2 = expre2;
        this.expreU = expreU;
        this.linea = linea;
        this.column = column;
        this.op_string = operador;
        this.operador = this.getOperador(operador);
    }
    getOperador(op) {
        if (op === '+') {
            return Operador.SUMA;
        }
        else if (op == '-') {
            return Operador.RESTA;
        }
        else if (op == '<') {
            return Operador.MENORQUE;
        }
        else if (op == '>') {
            return Operador.MAYORQUE;
        }
        else if (op == '&&') {
            return Operador.AND;
        }
        else if (op == '!') {
            return Operador.NOT;
        }
        else if (op == '||') {
            return Operador.OR;
        }
        else if (op == '^') {
            return Operador.POTENCIA;
        }
        else if (op == '*') {
            return Operador.MULT;
        }
        else if (op == '/') {
            return Operador.DIV;
        }
        else if (op == '%') {
            return Operador.MODULO;
        }
        else if (op == '<=') {
            return Operador.MENORIGUAL;
        }
        else if (op == '>=') {
            return Operador.MAYORIGUAL;
        }
        else if (op == '==') {
            return Operador.IGUALIGUAL;
        }
        else if (op == '!=') {
            return Operador.DIFERENCIACION;
        }
        return Operador.SUMA;
    }
    getTipo(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Operaciones", "");
        if (this.expreU) {
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
}
exports.Operacion = Operacion;
