import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo } from '../TablaSimbolos/Tipo'
import { Arreglo } from '../Expresiones/Arreglo'

export class AsignacionArray implements Instruccion{

    public identificador: string;
    public valor: Expresion;
    public niveles: Expresion;
    public linea: number;
    public column: number;

    constructor(identificador: string,accesos: any ,valor: Expresion, linea: number, column: number) {
        this.identificador = identificador;
        this.niveles = accesos;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if(simbolo?.getTipo().tipo != tipo.ARRAY){
                let error = new Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error)
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`)

            }else{
                let dimension = this.niveles.getValor(controlador,ts,ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let array:Arreglo = simbolo.getValor();
               // array.valores = array.setValor(dimension, array.valores, valor, this.linea, this.column);
                simbolo.valor = array;
                
                ts.getSimbolo(this.identificador)?.setValor(simbolo);
            }
        }

    }

    recorrer(): Nodo {
        let padre = new Nodo("Asignacion", "");
        return padre
    }
}