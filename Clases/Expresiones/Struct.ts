import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Primitivo } from "../Expresiones/Primitivo";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";

export class Struct extends Simbolos implements Instruccion {
    public instruccione: Array<Instruccion>;
    //public entorno: TablaSim;
    public identificador: string;
    public linea: number;
    public column: number;

    constructor(
        id:string,
        declaraciones: any,
        lista_params:any,
        linea: any,
        columna: any
    ) {
        super(1, new Tipo('STRUCT'), id, null, lista_params, false);
        this.identificador = id;
        this.declaraciones = declaraciones;
        this.entorno = new TablaSim(null, "");
        this.linea = linea;
        this.column = columna;
    }

    agregarSimboloStruct(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        if (!ts.existe(this.identificador)) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        } else {
            //Erro Semantico
        }
    }

  

    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        //this.entorno = new TablaSim(ts, this.identificador);
       // ts.setSiguiente(this.entorno);  
        /*
        this.declaraciones.forEach((ins) => {
            ins.ejecutar(controlador, this.entorno, ts_u);
        });*/
        return null
    }

    recorrer(): Nodo {
        let padre = new Nodo(this.identificador, "");
        

        return padre;
    }
}
