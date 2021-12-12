import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";

export class Default implements Instruccion{


    public list_ins: Array<Instruccion>;
    public linea: number;
    public columna: number;

    constructor(li:any,l:any,c:any){
        this.list_ins = li;
        this.linea = l;
        this.columna= c;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
        for(let ins of this.list_ins){
            let res = ins.ejecutar(controlador,ts,ts_u);
            if(ins instanceof Break || res instanceof Break){
                return  res;
            }
            if(ins instanceof Return){
                return res;
            }
            if(res != null){
                return res
            }
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("DEFAULT","")
        for(let ins of this.list_ins){
            padre.addHijo(ins.recorrer())
        }
        return padre
    }

}