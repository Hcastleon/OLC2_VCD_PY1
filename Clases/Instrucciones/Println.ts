import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";


export class Println implements Instruccion{

    public expresion: Expresion;
    public linea: number;
    public columna: number;

    constructor(expresion:any, linea: any, columna: any){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    
    ejecutar(controlador: Controller, ts: TablaSim,ts_u:TablaSim) {
        
        let valor = this.expresion.getValor(controlador, ts,ts_u);
        controlador.append(valor + '\n');

        return null;

    }
    recorrer(): Nodo {
        let padre = new Nodo("PrintLn","");
       // padre.addHijo(new Nodo("int",""));
       // padre.addHijo(new Nodo("(",""));

        //let hijo =  new Nodo("exp","");
        padre.addHijo(this.expresion.recorrer());
       // padre.addHijo(hijo);
//padre.addHijo(new Nodo(")",""));
        return padre
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
        
    }
    
}