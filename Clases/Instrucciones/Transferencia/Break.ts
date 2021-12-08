import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";


export class Break implements Instruccion{

    constructor(){

    }

    ejecutar(controlador: Controller, ts: TablaSim,ts_u:TablaSim) {
        return this
    }
    recorrer(): Nodo {
        let padre = new Nodo("Break","")

        return padre
    }

}