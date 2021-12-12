import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";


export class Logicas extends Operacion implements Expresion {

    constructor(expre1: any, expre2: any, expreU: any, operador: any, linea: any, column: any) {
        super(expre1, expre2, expreU, operador, linea, column)
    }


    getTipo(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        let valor = this.getValor(controlador, ts,ts_u);

        if (typeof valor == 'number') {
            return tipo.DOUBLE;
        } else if (typeof valor == 'string') {
            return tipo.CADENA;
        } else if (typeof valor == 'boolean') {
            return tipo.BOOLEAN;
        }
    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        if (this.expreU == false) {
            valor_exp1 = this.expre1.getValor(controlador, ts,ts_u);
            valor_exp2 = this.expre2.getValor(controlador, ts,ts_u);
        } else {
            valor_expU = this.expre1.getValor(controlador, ts,ts_u);
        }
        switch (this.operador) {
            case Operador.AND:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 && valor_exp2
                    } 
                }
                break;
            case Operador.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 || valor_exp2
                    } 
                } 
                break;
            case Operador.NOT:
                if (typeof valor_expU == 'boolean') {
                    return !valor_expU
                } 
                break;
            default:
                break;
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo(this.op_string, "")

        if (this.expreU) {
          //  padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer())
        } else {
            padre.addHijo(this.expre1.recorrer());
           // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }

        return padre
    }

}