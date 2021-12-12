import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";


export class DoWhile implements Instruccion{

    public condicion: Expresion;
    public lista_ins: Array<Instruccion>
    public linea: number;
    public columna: number;

    constructor(condicion: any, lista_ins: any, linea: any, columna: any){
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let valor_condicion = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condicion == 'boolean') {

            let ts_local = new TablaSim(ts, "DoWhile");
            ts.setSiguiente(ts_local);
            for (let ins of this.lista_ins) {
                let res = ins.ejecutar(controlador, ts_local, ts_u);
                if (ins instanceof Break || res instanceof Break) {
                    return res;
                }
                if (ins instanceof Continue || res instanceof Continue) {

                }
                if (ins instanceof Return || res != null) {
                    return res;
                }
            }

            siguiente:
            while (this.condicion.getValor(controlador, ts, ts_u)) {


                for (let ins of this.lista_ins) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break || res instanceof Break) {
                        return res;
                    }
                    if (ins instanceof Continue || res instanceof Continue) {
                        continue  siguiente;
                    } if (ins instanceof Return || res != null) {
                        return res;
                    }
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("DoWhile", "")
        padre.addHijo(new Nodo("Do", ""))
        padre.addHijo(new Nodo("{", ""))
        let hijo_ins = new Nodo("Intrucciones", "")
        for (let ins of this.lista_ins) {
            hijo_ins.addHijo(ins.recorrer())
        }
        padre.addHijo(new Nodo("}", ""))
        padre.addHijo(new Nodo("While", ""))
        padre.addHijo(new Nodo("(", ""))
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo(")", ""))
        return padre
    }
}