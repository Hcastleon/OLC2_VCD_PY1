import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";

export class Nativa extends Operacion implements Expresion {
    constructor(
        expre1: any,
        expre2: any,
        expreU: any,
        operador: any,
        linea: any,
        column: any
    ) {
        super(expre1, expre2, expreU, operador, linea, column);
    }

    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let valor = this.getValor(controlador, ts, ts_u);

        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return tipo.ENTERO;
            }
            return tipo.DOUBLE;
        } else if (typeof valor == "string") {
            if (this.isChar(String(valor))) {
                return tipo.CARACTER;
            }
            return tipo.CADENA;
        } else if (typeof valor == "boolean") {
            return tipo.BOOLEAN;
        } else if (valor === null) {
            return tipo.NULO;
        }
    }

    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let valor_expre1;
        let valor_expre2;

        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        } else {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }

        switch (this.operador) {
            case Operador.POTENCIA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return Math.pow(valor_expre1, valor_expre2);
                    }
                }
                break;
            case Operador.SENO:
                if (typeof valor_expre1 === "number") {
                    return Math.sin(valor_expre1);
                }
                break;
            case Operador.COSENO:
                if (typeof valor_expre1 === "number") {
                    return Math.cos(valor_expre1);
                }
                break;
            case Operador.TANGENTE:
                if (typeof valor_expre1 === "number") {
                    return Math.tan(valor_expre1);
                }
                break;
            case Operador.RAIZ:
                if (typeof valor_expre1 === "number") {
                    return Math.sqrt(valor_expre1);
                }
                break;
            case Operador.LOGARITMO:
                if (typeof valor_expre1 === "number") {
                    return Math.log10(valor_expre1);
                }
                break;
            default:
                break;
        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("Aritmetica", "");

        return padre;
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    isChar(n: string) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
