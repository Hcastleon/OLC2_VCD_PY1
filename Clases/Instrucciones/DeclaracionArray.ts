import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";
import { Primitivo } from "../Expresiones/Primitivo";

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
                controlador.errores.push(error)
                controlador.append(`**Error Sematnico -> La variable ${variable.identificador},  ya se declaro anteriormente en la linea ${this.linea}, y columna ${this.columna} **`)
                continue;
            }

            if (variable.valor != null) {
                let valor;
                let tipo_valor;

               
                variable.valor.forEach((element: Primitivo) => {
                     valor = element.getValor(controlador, ts,ts_u);
                      tipo_valor = element.getTipo(controlador, ts,ts_u);

                    if (tipo_valor != this.tipo.tipo || (tipo_valor != tipo.DOUBLE && this.tipo.tipo != tipo.ENTERO) || (tipo_valor != tipo.CADENA && this.tipo.tipo != tipo.CARACTER) )  {
                      let error = new Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                    controlador.errores.push(error)
                    controlador.append(`**Error Sematnico -> Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo, en la linea ${this.linea}, y columna ${this.columna} **` )
               
                }
                });

            } /*else {
                let nuevo_sim = new Simbolos(variable.simbolo, this.tipo, variable.identificador, null);
                ts.agregar(variable.identificador, nuevo_sim);
                ts_u.agregar(variable.identificador, nuevo_sim);
            }*/
        }


    }
    recorrer(): Nodo {
        let padre = new Nodo("Declaracion", "")
        let hijo_sim = new Nodo("Simbolos", "")
        padre.addHijo(new Nodo(this.tipo.stype, ""))
        for (let simb of this.lista_simbolos) {
            let varia = simb as Simbolos
            if (varia.valor != null) {
                hijo_sim.addHijo(new Nodo(simb.identificador, ""))
                hijo_sim.addHijo(new Nodo("=", ""))
                let aux = simb.valor as Primitivo
                hijo_sim.addHijo(aux.recorrer())
            } else {
                hijo_sim.addHijo(new Nodo(";", ""))
            }

        }
        padre.addHijo(hijo_sim);
        return padre
    }
}