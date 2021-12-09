import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";


export class Return implements Instruccion{

    public valor_retur: Expresion; 

    constructor(v:any){
        this.valor_retur = v;
    }

    

    ejecutar(controlador: Controller, ts: TablaSim,ts_u:TablaSim) {
        if(this.valor_retur != null){
            return this.valor_retur.getValor(controlador,ts,ts_u);
        }else{
            return this;
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("Retornar","");
        
        if(this.valor_retur != null){
            let hijo = new Nodo("Valor","")
            hijo.addHijo(this.valor_retur.recorrer())
            padre.addHijo(hijo)
        }

        return padre
    }

}