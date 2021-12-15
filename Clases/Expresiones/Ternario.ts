import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";


export class Ternario implements Expresion {

    public condicion : Expresion;
    public verdadero: Expresion;
    public falso: Expresion;
    public linea: number; 
    public columna : number;

    constructor(condicion: any, verdadero: any, falso: any, linea: any, columna: any){
        this.verdadero = verdadero;
        this.condicion = condicion;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {

        let valor_condi = this.condicion.getValor(controlador, ts,ts_u);

        if(typeof valor_condi == 'boolean'){
            return valor_condi ? this.verdadero.getTipo(controlador, ts,ts_u) : this.falso.getTipo(controlador, ts,ts_u)
        }else{
            let error = new Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error)
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`)
        }
    }
    getValor(controlador: Controller, ts: TablaSim,ts_u: TablaSim) {
        let valor_condi = this.condicion.getValor(controlador, ts,ts_u);
        
        if(typeof valor_condi == 'boolean'){
            return valor_condi ? this.verdadero.getValor(controlador, ts,ts_u) : this.falso.getValor(controlador, ts,ts_u)
        }else{
            let error = new Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error)
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`)
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("TERNARIO","")
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo("=",""))
        padre.addHijo(this.verdadero.recorrer())
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo("?",""))
        padre.addHijo(this.falso.recorrer())
        return padre
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim) {
        
    }

}