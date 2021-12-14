import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";
import { Primitivo } from "../Expresiones/Primitivo";
import { Arreglo } from "../Expresiones/Arreglo";

export class Declaracion implements Instruccion {

    public tipo: Tipo;
    public stype: any;
    public lista_simbolos: Array<Simbolos>;
    public linea: number;
    public columna: number;

    constructor(tipo: any, lista_simbolos: any, linea: any, columna: any) {
        this.tipo = tipo
        this.lista_simbolos = lista_simbolos
        this.linea = linea
        this.columna = columna

    }


    ejecutar(controlador: Controller, ts: TablaSim,ts_u:TablaSim) {
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo as Simbolos
            // Se verifica que la varaible no exista en la tabla de simbolos actual
            if (ts.existeEnActual(variable.identificador)) {
                let error = new Errores('Semantico', `La variable ${variable.identificador}, ya se declaro anteriormente`, this.linea, this.columna);
                controlador.errores.push(error);
                continue;
            }

            if (variable.valor != null) {
                if( variable.valor instanceof Arreglo){
                    let valor = variable.valor.getValor(controlador, ts,ts_u);
                    let tipo_valor = variable.valor.getTipoArreglo(controlador, ts,ts_u,this.tipo);
                    if (tipo_valor == this.tipo.tipo)  {
                        let nuevo_sim = new Simbolos(variable.simbolo, new Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador,nuevo_sim)
                    }else{
                        let error = new Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }else{
                    let valor = variable.valor.getValor(controlador, ts,ts_u);
                    let tipo_valor = variable.valor.getTipo(controlador, ts,ts_u);
                    if (tipo_valor == this.tipo.tipo || ((tipo_valor == tipo.DOUBLE||tipo_valor == tipo.ENTERO) && (this.tipo.tipo == tipo.ENTERO||this.tipo.tipo == tipo.DOUBLE)) || (tipo_valor == tipo.CADENA && this.tipo.tipo == tipo.CARACTER) )  {
                        let nuevo_sim = new Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador,nuevo_sim)
                    }else{
                        let error = new Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
            } else {
                let nuevo_sim = new Simbolos(variable.simbolo, this.tipo, variable.identificador, null);
                ts.agregar(variable.identificador, nuevo_sim);
                ts_u.agregar(variable.identificador, nuevo_sim);
            }
        }

    }
    recorrer(): Nodo {
        let padre = new Nodo("=", "")
       // let hijo_sim = new Nodo("Simbolos", "")
        padre.addHijo(new Nodo(this.tipo.stype, ""))
        for (let simb of this.lista_simbolos) {
            let varia = simb as Simbolos
            if (varia.valor != null) {
                padre.addHijo(new Nodo(simb.identificador, ""))
               // padre.addHijo(new Nodo("=", ""))
                let aux = simb.valor as Primitivo
                padre.addHijo(aux.recorrer())
            } 

        }
        return padre
    }
}