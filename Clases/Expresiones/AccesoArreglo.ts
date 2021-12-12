import { exists } from "fs";
import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from '../TablaSimbolos/Tipo'
import { Arreglo } from '../Expresiones/Arreglo'

export class AccesoArreglo implements Expresion{

    public identificador: string;
   // public valor: Expresion;
    public niveles: Expresion;
    public linea: number;
    public column: number;

    constructor(identificador: string,accesos: any , linea: number, column: number) {
        this.identificador = identificador;
        this.niveles = accesos;
      //  this.valor = valor;
        this.linea = linea;
        this.column = column;
    }


    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        /*if(ts.existe(this.identificador)){
            let simbolo = ts.getSimbolo(this.identificador);
            if(simbolo?.getTipo()==)

        }*/

        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }

    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            if(id_exists?.tipo.tipo != tipo.ARRAY){
                let error = new Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error)
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`)

            }else{
                let dimension = this.niveles.getValor(controlador,ts,ts_u);
                let array:Arreglo = id_exists.getValor();
               // return array.getValor(dimension, array.valores, this.linea, this.column); 
            }
        }else{

        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("ID", "");
        return padre
    }

}