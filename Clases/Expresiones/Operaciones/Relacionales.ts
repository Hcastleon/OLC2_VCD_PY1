import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from '../../TablaSimbolos/TablaSim'
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";

export class Relacionales extends Operacion implements Expresion {

    public constructor(expre1: Expresion, expre2: Expresion, expreU: boolean, op: string, linea: number, columna: number) {
        super(expre1, expre2, expreU, op, linea, columna)
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
            case Operador.MENORQUE:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 < valor_exp2
                    }
                } 
                break;
            case Operador.MAYORQUE:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 > valor_exp2
                    } 
                } 

                break;
            case Operador.MENORIGUAL:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 <= valor_exp2
                    } 
                }  
                break;
            case Operador.MAYORIGUAL:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 >= valor_exp2
                    } 
                } 
                break;
            case Operador.IGUALIGUAL:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 == valor_exp2
                    }
                } 
                break;
            case Operador.DIFERENCIACION:
                if (typeof valor_exp1 == 'number') {                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') {                // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 != valor_exp2
                    } 
                }  
                break;
            default:
                break;
        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("Relacionales", "")

        if (this.expreU) {
            padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer())
        } else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }

        return padre
    }


}