import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from '../TablaSimbolos/Tipo'
import { Simbolos } from '../TablaSimbolos/Simbolos'
import { Arreglo } from '../Expresiones/Arreglo'
import { Struct } from '../Expresiones/Struct'
import { Identificador } from '../Expresiones/Identificador'

export class AccesoStruct implements Expresion {

    //public accesos: Array<string>;
    public acceso1: Identificador;
    public acceso2: Identificador;
   // public identificador: string;
    public linea: number;
    public column: number;

    constructor(
        acceso1: Identificador,
        acceso2: Identificador,
        linea: any,
        columna: any
    ) {
        this.acceso1 = acceso1;
        this.acceso2 = acceso2;
        this.linea = linea;
        this.column = columna;
    }

    
    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim){
       // let valor = this.getValor(controlador,ts,ts_u);
        let id_exists = ts.getSimbolo(this.acceso1.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }

    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim){
        //busco en global
        let tabla: TablaSim = ts;
        while (tabla.ant != null) {
            tabla = tabla.ant;
        }
        let struct = tabla.getSimbolo(this.acceso1.identificador);
        if(struct != null){
            
            let entornoStruct = struct.valor.entorno;

            let variable = entornoStruct.getSimbolo(this.acceso2.identificador);
            return variable.valor;
        }
        

/*
        if (struct != null){
            if(struct instanceof Struct){
                //return simbolo.getValor(controlador, ts, ts_u);
            }
        }*/
    }

    getValorRecursivo(obj: Struct, accesos: Array<string>, controlador: Controller, ts: TablaSim, ts_u: TablaSim ){
        let temporales = accesos.slice();
        let acceso = temporales[0];
        temporales.shift();
      /*  if(obj.entorno.tabla.size == 0){
            obj.ejecutar(controlador, ts, ts_u);
        }*/

        if(!obj.entorno.existeEnActual(acceso)){
            let error = new Errores(
                "Semantico",
                ` No existe dentro del struct`,
                this.linea,
                this.column
            );
            controlador.errores.push(error);
            return
        }

        let simbolo = obj.entorno.getSimbolo(acceso);
        if(temporales.length > 0 && simbolo != null){
            if(simbolo.valor instanceof Struct){
                let struct = simbolo.valor;
                this.getValorRecursivo(simbolo.valor, temporales,controlador, ts,ts_u );
            }else{
                let error = new Errores(
                    "Semantico",
                    ` No existe dentro del struct`,
                    this.linea,
                    this.column
                );
                controlador.errores.push(error);
                return
            }
        }else{
            return simbolo?.valor;
        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("accesoStruct", "");

        return padre;
    }

}