import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import  { TablaSim }  from "../TablaSimbolos/TablaSim";
import { tipo } from "../TablaSimbolos/Tipo";


export class Primitivo implements Expresion{

    public primitvo : any;
    public linea : number;
    public columna : number;

    constructor(primitivo: any, linea: number, columna : number){
        this.columna = columna
        this.linea = linea
        this.primitvo = primitivo
    }



    getTipo(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        let valor = this.getValor(controlador, ts,ts_u);

        if(typeof valor == 'number'){
            return tipo.DOUBLE
        }else if (typeof valor =='string'){
            return tipo.CADENA
        }else if (typeof valor =='boolean'){
            return tipo.BOOLEAN
        }

    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        return this.primitvo;
    }
    recorrer(): Nodo  {
        let padre = new Nodo("Primitivo","");
        padre.addHijo(new Nodo(this.primitvo.toString(),""));
        return padre
    }

}