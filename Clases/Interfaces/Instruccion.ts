import { Nodo } from "../AST/Nodo";
import  { NodoT } from "../AST/NodoT";
import { Controller } from "../Controller";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Resultado3D, Temporales } from "../AST/Temporales";


export interface Instruccion{

    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim): any;

    recorrer(): Nodo; 

    traducir(Temp: Temporales, controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;
}