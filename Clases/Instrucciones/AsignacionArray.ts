import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo } from '../TablaSimbolos/Tipo';
import { Arreglo } from '../Expresiones/Arreglo';
import { Identificador } from "../Expresiones/Identificador";

export class AsignacionArray implements Instruccion{

    public identificador: string;
    public valor: Expresion;
    public posicion: Expresion;
    public linea: number;
    public column: number;

    constructor(identificador: string,posicion: any ,valor: Expresion, linea: number, column: number) {
        this.identificador = identificador;
        this.posicion = posicion;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if(simbolo?.getTipo().tipo != tipo.ARRAY){
                let error = new Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);

            }else{
                let posi = this.posicion.getValor(controlador,ts,ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let valor_U = simbolo.getValor();
                if (typeof posi == "number") {
                    if (this.isInt(Number(posi))) {
                        if(this.getTipoArray(valor_U) == this.getTipo(valor)){
                            valor_U[posi] = valor;
                        }else{
                            let error = new Errores('Semantico', `El valor ${valor}, es un tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
            }
        }

    }

    getTipoArray(lista:any){
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return  tipo.ENTERO;
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

    getTipo(dato:any){
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return  tipo.ENTERO;
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