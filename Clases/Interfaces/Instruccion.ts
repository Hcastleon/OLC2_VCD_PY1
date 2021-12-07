import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { TablaSim } from "../TablaSimbolos/TablaSim";



export interface Instruccion{

    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim): any;

    recorrer(): Nodo; 
}