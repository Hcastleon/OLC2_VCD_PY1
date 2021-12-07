"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacionales = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
class Relacionales extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, op, linea, columna) {
        super(expre1, expre2, expreU, op, linea, columna);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == 'number') {
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == 'string') {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == 'boolean') {
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
            case Operaciones_1.Operador.MENORQUE:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 < valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORQUE:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 > valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MENORIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 <= valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 >= valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.IGUALIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 == valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.DIFERENCIACION:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 != valor_exp2;
                    }
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Relacionales", "");
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
exports.Relacionales = Relacionales;
