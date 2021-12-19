import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Resultado3D,Temporal } from "../AST/Temporales";
import { tipo } from "../TablaSimbolos/Tipo";



export class Ternario implements Expresion {

    public condicion: Expresion;
    public verdadero: Expresion;
    public falso: Expresion;
    public linea: number;
    public columna: number;

    constructor(condicion: any, verdadero: any, falso: any, linea: any, columna: any) {
        this.verdadero = verdadero;
        this.condicion = condicion;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {

        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);

        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getTipo(controlador, ts, ts_u) : this.falso.getTipo(controlador, ts, ts_u)
        } else {
            let error = new Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error)
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`)
        }
    }
    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);

        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getValor(controlador, ts, ts_u) : this.falso.getValor(controlador, ts, ts_u)
        } else {
            let error = new Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error)
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`)
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("TERNARIO", "")
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.verdadero.recorrer())
        padre.addHijo(this.condicion.recorrer())
        padre.addHijo(new Nodo("?", ""))
        padre.addHijo(this.falso.recorrer())
        return padre
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let nodoCondicion: Resultado3D = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let izq: Resultado3D = this.verdadero.traducir(Temp, controlador, ts, ts_u);
        let der: Resultado3D = this.falso.traducir(Temp, controlador, ts, ts_u);

        let salida: Resultado3D = new Resultado3D();
        salida.temporal = new Temporal("");

        let temporal: string = Temp.temporal();
        let s: string = Temp.etiqueta();
        salida.temporal.nombre = temporal;
        salida.tipo = izq.tipo;
        salida.codigo3D += nodoCondicion.codigo3D;
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  TERNARIO %%%%%%%%%%%%%%%%%%%%% \n";
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI VERDADERA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        salida.codigo3D += izq.codigo3D;
        if (izq.tipo === tipo.BOOLEAN) izq = this.arreglarBooleanA(izq, salida, Temp);
        salida.codigo3D += temporal + " = " + izq.temporal.nombre + "; // Si es verdadero esto es su retorno \n";
        salida.codigo3D += Temp.saltoIncondicional(s);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI FALSA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += der.codigo3D;
        if (der.tipo === tipo.BOOLEAN) der = this.arreglarBooleanA(der, salida, Temp);
        salida.codigo3D += temporal + " = " + der.temporal.nombre + "; // Si es falsa aqui se retorna \n";
        salida.codigo3D += s + ": \n";
        return salida;

    }

    arreglarBoolean(nodo: Resultado3D, salida: Resultado3D, Temp: Temporales) {
        if (nodo.etiquetasV.length == 0) {
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }

    arreglarBooleanA(nodo: Resultado3D, salida: Resultado3D, Temp: Temporales) {
        if (nodo.etiquetasV != null) {
            let temporal = Temp.temporal();
            let salto: string = Temp.etiqueta();
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
            salida.codigo3D += temporal + " = 1 //Verdadero \n";
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
            salida.codigo3D += temporal + " = 0 //Falsa \n";
            salida.codigo3D += salto + ":";
            nodo.temporal.nombre = temporal;
            nodo.etiquetasV = [];
            nodo.etiquetasF = [];
        }
        return nodo;
    }
}