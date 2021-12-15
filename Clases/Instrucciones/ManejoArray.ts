import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo } from '../TablaSimbolos/Tipo';
import { Arreglo } from '../Expresiones/Arreglo';
import { Identificador } from "../Expresiones/Identificador";
import { Temporales } from "../AST/Temporales";

export class ManejoArray implements Instruccion {

    public identificador: string;
    public expre2: Expresion;
    public operador: any;
    public linea: number;
    public column: number;

    constructor(
        identificador: string,
        expre2: Expresion,
        operador: any,
        linea: number,
        column: number
    ) {
        this.identificador = identificador;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if (simbolo?.getTipo().tipo != tipo.ARRAY) {
                let error = new Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);

            } else {
                let valor_expre1;
                let valor_expre2;

                if (this.expre2 === null) {
                    valor_expre1 = simbolo.getValor();
                } else {
                    valor_expre1 = simbolo.getValor();
                    valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
                }

                switch (this.operador) {
                    case "push":
                        if (typeof valor_expre1 === "object") {
                            if (this.getTipoArray(valor_expre1) == this.getTipo(valor_expre2)) {
                                valor_expre1.push(valor_expre2);
                            } else {
                                let error = new Errores(
                                    "Semantico",
                                    `El valor ${valor_expre2}, tipo de dato incorrecto`,
                                    this.linea,
                                    this.column
                                );
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores(
                                "Semantico",
                                `El valor ${valor_expre1}, tipo de dato incorrecto`,
                                this.linea,
                                this.column
                            );
                            controlador.errores.push(error);
                        }
                        break;
                    case "pop":
                        if (typeof valor_expre1 === "object") {
                            valor_expre1.pop();
                        } else {
                            let error = new Errores(
                                "Semantico",
                                `El valor ${valor_expre1}, tipo de dato incorrecto`,
                                this.linea,
                                this.column
                            );
                            controlador.errores.push(error);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

    }

    getTipoArray(lista: any) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return tipo.ENTERO;
            }
            return tipo.DOUBLE;
        } else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return tipo.CARACTER;
            }
            return tipo.CADENA;
        } else if (typeof lista[0] == "boolean") {
            return tipo.BOOLEAN;
        } else if (lista[0] === null) {
            return tipo.NULO;
        }
    }

    getTipo(dato: any) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return tipo.ENTERO;
            }
            return tipo.DOUBLE;
        } else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return tipo.CARACTER;
            }
            return tipo.CADENA;
        } else if (typeof dato == "boolean") {
            return tipo.BOOLEAN;
        } else if (dato === null) {
            return tipo.NULO;
        }
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
        
    }

    recorrer(): Nodo {
        let padre = new Nodo("Asignacion", "");
        return padre
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    isChar(n: string) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}