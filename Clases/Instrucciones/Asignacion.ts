import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";

export class Asignacion implements Instruccion {

    public identificador: string;
    public valor: Expresion;
    public linea: number;
    public column: number;

    constructor(identificador: string, valor: Expresion, linea: number, column: number) {
        this.identificador = identificador;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }


    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {

        if (ts.existe(this.identificador)) {
            let valor = this.valor.getValor(controlador, ts,ts_u);

            ts.getSimbolo(this.identificador)?.setValor(valor);
        }else {
            let error = new Errores('Semantico', `La variable ${this.valor.getValor(controlador, ts,ts_u)}, no existe en el entorno`, this.linea, this.column);
            controlador.errores.push(error)
            controlador.append(`La variable ${this.valor.getValor(controlador, ts,ts_u)}, no existe en el entorno nn la linea ${this.linea}, y columna ${this.column}`)
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("=", "");
        padre.addHijo(new Nodo(this.identificador, ""))
        //padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.valor.recorrer())
        return padre
    }

}