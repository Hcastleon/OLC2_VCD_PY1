import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Break } from "../Transferencia/Break";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";

export class If implements Instruccion{

    public condicion :Expresion;
    public lista_ifs: Array<Instruccion>;
    public lista_elses: Array<Instruccion>;
    public linea: number; 
    public columna: number;

    constructor(condicion: any, lista_ifs: any, lista_elses:any, linea: any, columna: any){
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
        let ts_local = new TablaSim(ts, "If");
        ts.setSiguiente(ts_local);
        let valor_condi = this.condicion.getValor(controlador, ts,ts_u);
        if(this.condicion.getTipo(controlador, ts,ts_u) == tipo.BOOLEAN){
            if(valor_condi){
                for(let ins of this.lista_ifs){
                    let res = ins.ejecutar(controlador,ts_local,ts_u);
                    if(ins instanceof Break || res instanceof Break || ins instanceof  Continue || res instanceof Continue){
                        return  res;
                    }
                    if(ins instanceof Break || res != null){
                        return res;
                    }

                    
                }
            }else{
                for(let ins of this.lista_elses){
                    let res = ins.ejecutar(controlador, ts_local,ts_u);
                    if(ins instanceof Break || res instanceof Break|| ins instanceof  Continue || res instanceof Continue){
                        return  res;
                    }
                    if(ins instanceof Break || res != null){
                        return res;
                    }
                    if(ins instanceof Return || res != null){
                        return res;
                    }
                }
            }
        }
        return null
    }
    recorrer(): Nodo {
        let padre = new Nodo("IF","")
        padre.addHijo(new Nodo("if",""))
        padre.addHijo(new Nodo("(",""))
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo(")",""))
        padre.addHijo(new Nodo("{",""))
        let hijo_ifs = new Nodo("IntruccionesIf","")
        for(let inst of this.lista_ifs){
            hijo_ifs.addHijo(inst.recorrer())
        }
        padre.addHijo(hijo_ifs)
        padre.addHijo(new Nodo("}",""))
        padre.addHijo(new Nodo("else",""))
        padre.addHijo(new Nodo("{",""))
        let hijo_elses = new Nodo("IntruccionElse","")
        for(let inst of this.lista_elses){
            hijo_elses.addHijo(inst.recorrer())
        }
        padre.addHijo(hijo_elses);
        padre.addHijo(new Nodo("}",""))
        return padre
    }
    
}