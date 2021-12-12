import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import  { TablaSim }  from "../TablaSimbolos/TablaSim";
import { tipo } from "../TablaSimbolos/Tipo";


export class Primitivo implements Expresion{

    public primitivo : any;
    public linea : number;
    public columna : number;

    constructor(primitivo: any, linea: number, columna : number){
        this.columna = columna
        this.linea = linea
        this.primitivo = primitivo
    }



    getTipo(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        let valor = this.getValor(controlador, ts,ts_u);

        if(typeof valor == 'number'){
            if(this.isInt(Number(valor))){
                return tipo.ENTERO;
            }
            return tipo.DOUBLE
        }else if (typeof valor =='string'){
            return tipo.CADENA
        }else if (typeof valor =='boolean'){
            return tipo.BOOLEAN
        }else if (valor === null){
            return tipo.NULO
        }

    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        return this.primitivo;
    }
    recorrer(): Nodo  {
        let padre = new Nodo(this.primitivo.toString(),"");
        //padre.addHijo(new Nodo(this.primitivo.toString(),""));
        return padre
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

}