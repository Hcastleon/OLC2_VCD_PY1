import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Resultado3D } from "../AST/Temporales";
import { tipo } from "../TablaSimbolos/Tipo";

export class Identificador implements Expresion {

    public identificador: string;
    public linea: number;
    public columna: number;

    constructor(identificador: any, linea: any, columna: any) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }


    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let id_exists = ts.getSimbolo(this.identificador);

        if (id_exists != null) {
            return id_exists.valor;
        } 
    }
    recorrer(): Nodo {
        let padre = new Nodo(this.identificador, "");
       // padre.addHijo(new Nodo(this.identificador, ""))
        return padre
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
        let id_exists = ts.getSimbolo(this.identificador);

        if (id_exists != null) {
            return id_exists;
        }
    }

}