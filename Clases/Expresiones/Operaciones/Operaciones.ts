import  {Nodo } from "../../AST/Nodo";
import { Temporales } from "../../AST/Temporales";
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
    DIFERENCIACION,
    COSENO,
    SENO,
    TANGENTE,
    LOGARITMO,
    RAIZ,
    CONCATENAR,
    REPETIR
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
        }else if ( op == 'pow'){
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
        }else if ( op == '&'){
            return Operador.CONCATENAR
        }else if ( op == '^'){
            return Operador.REPETIR
        }else if ( op == 'sin'){
            return Operador.SENO
        }else if ( op == 'cos'){
            return Operador.COSENO
        }else if ( op == 'tan'){
            return Operador.TANGENTE
        }else if ( op == 'sqrt'){
            return Operador.RAIZ
        }else if ( op == 'log'){
            return Operador.LOGARITMO
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
        let padre = new Nodo(this.op_string,"")

        if(this.expreU){
          //  padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre1.recorrer())
        }else{
            padre.addHijo(this.expre1.recorrer());
           // padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre2.recorrer());
        }

        return padre
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
        
    }

}