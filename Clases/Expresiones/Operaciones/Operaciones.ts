import  {Nodo } from "../../AST/Nodo";
import {Controller} from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import  {TablaSim}  from "../../TablaSimbolos/TablaSim";

export enum Operador{
    SUMA,
    RESTA,
    MULT,
    DIV,
    POTENCIA,
    MODULO,
    MENORQUE,
    MAYORQUE,
    AND,
    NOT,
    UNARIO,
    OR,
    MAYORIGUAL,
    MENORIGUAL,
    IGUALIGUAL,
    DIFERENCIACION
}


export class Operacion implements Expresion{

    public expre1 : Expresion
    public expre2 : Expresion
    public expreU : boolean
    public operador :  Operador
    public linea : number
    public column : number
    public op_string: string


    constructor(expre1 : Expresion, expre2 : Expresion, expreU: boolean, operador : any, linea : number, column : number){
        this.expre1 = expre1
        this.expre2 = expre2
        this.expreU = expreU 
        this.linea = linea
        this.column = column
        this.op_string = operador;
        this.operador = this.getOperador(operador)
    }

    getOperador(op : string): Operador{
        if( op === '+' ){
            return Operador.SUMA
        }else if ( op == '-'){
            return Operador.RESTA   
        }else if ( op == '<'){
            return Operador.MENORQUE
        }else if ( op == '>'){
            return Operador.MAYORQUE
        }else if ( op == '&&'){
             return Operador.AND
        }else if ( op == '!'){
            return Operador.NOT
        }else if ( op == '||'){
            return Operador.OR
        }else if ( op == '^'){
            return Operador.POTENCIA
        }else if ( op == 'UNARIO'){
            return Operador.UNARIO
        }else if ( op == '*'){
            return Operador.MULT
        }else if ( op == '/'){
            return Operador.DIV
        }else if ( op == '%'){
            return Operador.MODULO
        }else if ( op == '<='){
            return Operador.MENORIGUAL
        }else if ( op == '>='){
            return Operador.MAYORIGUAL
        }else if ( op == '=='){
            return Operador.IGUALIGUAL
        }else if ( op == '!='){
            return Operador.DIFERENCIACION
        }
        return Operador.SUMA
    }


    getTipo(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        throw new Error("Method not implemented.");
    }
    recorrer(): Nodo {
        let padre = new Nodo("Operaciones","")

        if(this.expreU){
            padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre1.recorrer())
        }else{
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre2.recorrer());
        }

        return padre
    }

}