import { Nodo } from "../AST/Nodo";
import { NodoT } from "../AST/NodoT";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import  { TablaSim }  from "../TablaSimbolos/TablaSim";
import { Tipo,tipo } from "../TablaSimbolos/Tipo";
import { Temporales,Temporal,Resultado3D } from "../AST/Temporales";


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

    getTipoTraduc() {
        if(typeof this.primitivo == 'number'){
            if(this.isInt(Number(this.primitivo))){
                return tipo.ENTERO;
            }
            return tipo.DOUBLE
        }else if (typeof this.primitivo =='string'){
            return tipo.CADENA
        }else if (typeof this.primitivo =='boolean'){
            return tipo.BOOLEAN
        }else if (this.primitivo === null){
            return tipo.NULO
        }

    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        return this.primitivo;
    }
    recorrer(): Nodo  {
        let padre;
        if(this.primitivo ==null){
             padre = new Nodo("Null", "");
        }else{
         padre = new Nodo(this.primitivo.toString(),"");
        //padre.addHijo(new Nodo(this.primitivo.toString(),""));
        
    }
        return padre
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    traducir(Temp:Temporales, controlador: Controller, ts: TablaSim) {
        let resultado3D = new Resultado3D();
        resultado3D.codigo3D="";

        if(typeof this.primitivo == 'number'){
            if(this.isInt(Number(this.primitivo))){
                resultado3D.tipo = tipo.ENTERO;
            }
            resultado3D.tipo = tipo.DOUBLE
        }else if (typeof this.primitivo =='string'){
            resultado3D.tipo = tipo.CADENA
        }else if (typeof this.primitivo =='boolean'){
            resultado3D.tipo = tipo.BOOLEAN
        }else if (this.primitivo === null){
            resultado3D.tipo = tipo.NULO
        }

        resultado3D.temporal = new Temporal(this.primitivo.toString())

        return resultado3D;
    }

}