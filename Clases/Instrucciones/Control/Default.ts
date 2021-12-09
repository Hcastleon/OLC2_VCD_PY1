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
        padre.addHijo(new Nodo("default",""))
        padre.addHijo(new Nodo(":",""))
        let hijo_ins = new Nodo("Instrucciones","")
        for(let ins of this.list_ins){
            hijo_ins.addHijo(ins.recorrer())
        }
        padre.addHijo(hijo_ins)
        return padre
    }

}