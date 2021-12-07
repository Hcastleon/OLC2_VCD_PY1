import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";


export class Print implements Instruccion{

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
        controlador.append(valor);

        return null

    }
    recorrer(): Nodo {
        let padre = new Nodo("Print","");
        padre.addHijo(new Nodo("pint",""));
        padre.addHijo(new Nodo("(",""));

        let hijo =  new Nodo("exp","");
        hijo.addHijo(this.expresion.recorrer());
        padre.addHijo(hijo);
        padre.addHijo(new Nodo(")",""));
        return padre
    }
    
}