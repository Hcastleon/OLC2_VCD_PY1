import  { Nodo } from "../AST/Nodo";
import  { Controller } from "../Controller";
import  { TablaSim}   from "../TablaSimbolos/TablaSim";


export interface Expresion{

    getTipo(controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;

    getValor(controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;

    recorrer(): Nodo;

}