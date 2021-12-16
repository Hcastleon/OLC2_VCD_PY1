import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Primitivo } from "../Expresiones/Primitivo";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";

export class Struct extends Simbolos implements Instruccion {
    public lista_ints: Array<Instruccion>;
  public linea: number;
  public column: number;

    constructor(
        simbolo: number,
    tipo: Tipo,
    identificador: string,
    lista_params: any,
    metodo: any,
    lista_ints: any,
    linea: any,
    columna: any
    ) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
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

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
        
    }
}
