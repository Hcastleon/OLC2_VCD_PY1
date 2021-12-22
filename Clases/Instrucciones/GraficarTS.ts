
import { Instruccion } from "../Interfaces/Instruccion";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Resultado3D, Temporales } from "../AST/Temporales";
import { Simbolos }  from "../TablaSimbolos/Simbolos";

export class GraficarTS implements Instruccion {

constructor() {
    
  }
    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim){
        let aux = ts;
        let nuevaT = new Map(aux.tabla);
        let nueva = new TablaSim(null, aux.nombre);
        nueva.ant = aux.ant;
        nueva.tabla = nuevaT;
        if (ts != null) controlador.graficarTS.push(nueva);

    };

    recorrer(){
        let padre = new Nodo("graficar_ts()", "");
        return padre;
    }; 

    traducir(Temp: Temporales, controlador : Controller, ts : TablaSim, ts_u:TablaSim): any{

    };

}