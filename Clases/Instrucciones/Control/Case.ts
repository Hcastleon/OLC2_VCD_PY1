import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Return } from "../Transferencia/Return";



export class Case implements Instruccion{

    public expresion: Expresion;
    public list_inst : Array<Instruccion>;
    public linea : number;
    public columna: number;

    constructor(e : any , l : any, li:any, c:any){
        this.expresion = e;
        this.list_inst = l;
        this.linea = li;
        this.columna = c;
    }

    ejecutar(controlador: Controller, ts: TablaSim,ts_u:TablaSim){
        for(let ins of this.list_inst){
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
        let padre = new Nodo("case","")
        padre.addHijo(new Nodo("case",""))
        padre.addHijo(this.expresion.recorrer())
        padre.addHijo(new Nodo(":",""))
        let hijo_ins=new Nodo("Instrucciones","")
        for(let ins of this.list_inst){
            hijo_ins.addHijo(ins.recorrer())
        }
        padre.addHijo(hijo_ins)
        return padre
    }

}