import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";

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
        let padre = new Nodo("ID", "")
        padre.addHijo(new Nodo(this.identificador, ""))
        return padre
    }

}