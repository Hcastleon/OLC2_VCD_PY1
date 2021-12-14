import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolos } from "../TablaSimbolos/Simbolos";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { tipo, Tipo } from "../TablaSimbolos/Tipo";
import { Primitivo } from "../Expresiones/Primitivo";
import { Arreglo } from "../Expresiones/Arreglo";
import { Struct } from "../Expresiones/Struct";
import { Expresion } from "../Interfaces/Expresion";

export class DeclaracionStruct implements Instruccion {

    public id1: string;
    public id2: string;
    public id3: string;
    public lista_valores: Array<Expresion>;
    public linea: number;
    public columna: number;

    constructor(id1: any, id2: any, id3: any, lista_valores: any, linea: any, columna: any) {
        this.id1 = id1
        this.id2 = id2
        this.id3 = id3
        this.lista_valores = lista_valores
        this.linea = linea
        this.columna = columna

    }


    ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        if (ts.existe(this.id3) && !ts.existeEnActual(this.id2)) {
            let ts_local = new TablaSim(ts, this.id2);
            ts.setSiguiente(ts_local);
            let sim_struct = ts_local.getSimbolo(this.id1) as Struct;

            //console.log(sim_struct.lista_param);
            if (this.verificarParams(this.lista_valores,sim_struct.lista_params,controlador,ts,ts_local,ts_u)) {
                let r = sim_struct?.ejecutar(controlador, ts_local, ts_u);

                let nuevo_sim = new Simbolos(1, new Tipo("STRUCT"), this.id2, r);
                ts_local.agregar(this.id2, nuevo_sim);
                ts_u.agregar(this.id2, nuevo_sim);
                if (r != null) {
                    return r;
                }
        }

    }

    }

    verificarParams(
        para_llama: Array<Expresion>,
        para_func: any,
        controlador: any,
        ts: any,
        ts_local: any,
        ts_u: any
    ) {
        console.log(para_func);
        console.log(para_llama);
        if (para_llama.length == para_func?.length) {
            let aux: Simbolos;
            let id_aux: string;
            let tipo_axu;

            let exp_aux: Expresion;
            let tipo_valor;
            let valor_aux;

            for (let i = 0; i < para_llama.length; i++) {
                aux = para_func[i].lista_simbolos[0] as Simbolos;
                id_aux = aux.identificador;
                tipo_axu = aux.tipo.tipo;

                exp_aux = para_llama[i] as Expresion;
                tipo_valor = exp_aux.getTipo(controlador, ts, ts_u);
                valor_aux = exp_aux.getValor(controlador, ts, ts_u);

                if (
                    tipo_axu == tipo_valor ||
                    (tipo_axu == tipo.ENTERO && tipo_valor == tipo.DOUBLE) ||
                    (tipo_valor == tipo.CADENA && tipo_axu == tipo.CARACTER)
                ) {
                    let simbolo = new Simbolos(aux.simbolo, aux.tipo, id_aux, valor_aux);
                    ts_local.agregar(id_aux, simbolo);
                    ts_u.agregar(id_aux, simbolo);
                }
            }
            return true;
        } else {
            let error = new Errores(
                "Semantico",
                `Las variables  no son del mismo tipo`,
                this.linea,
                this.columna
            );
            controlador.errores.push(error);
            controlador.append(
                `Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.columna}`
            );
        }
        return false;
    }

    recorrer(): Nodo {
        let padre = new Nodo("=", "")
        // let hijo_sim = new Nodo("Simbolos", "")
        
        return padre
    }


}