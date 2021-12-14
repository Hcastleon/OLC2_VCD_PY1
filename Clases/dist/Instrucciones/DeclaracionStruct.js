"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class DeclaracionStruct {
    constructor(id1, id2, id3, lista_valores, linea, columna) {
        this.id1 = id1;
        this.id2 = id2;
        this.id3 = id3;
        this.lista_valores = lista_valores;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.id3) && !ts.existeEnActual(this.id2)) {
            let ts_local = new TablaSim_1.TablaSim(ts, this.id2);
            ts.setSiguiente(ts_local);
            let sim_struct = ts_local.getSimbolo(this.id1);
            //console.log(sim_struct.lista_param);
            if (this.verificarParams(this.lista_valores, sim_struct.lista_params, controlador, ts, ts_local, ts_u)) {
                let r = sim_struct === null || sim_struct === void 0 ? void 0 : sim_struct.ejecutar(controlador, ts_local, ts_u);
                let nuevo_sim = new Simbolos_1.Simbolos(1, new Tipo_1.Tipo("STRUCT"), this.id2, r);
                ts_local.agregar(this.id2, nuevo_sim);
                ts_u.agregar(this.id2, nuevo_sim);
                if (r != null) {
                    return r;
                }
            }
        }
    }
    verificarParams(para_llama, para_func, controlador, ts, ts_local, ts_u) {
        console.log(para_func);
        console.log(para_llama);
        if (para_llama.length == (para_func === null || para_func === void 0 ? void 0 : para_func.length)) {
            let aux;
            let id_aux;
            let tipo_axu;
            let exp_aux;
            let tipo_valor;
            let valor_aux;
            for (let i = 0; i < para_llama.length; i++) {
                aux = para_func[i].lista_simbolos[0];
                id_aux = aux.identificador;
                tipo_axu = aux.tipo.tipo;
                exp_aux = para_llama[i];
                tipo_valor = exp_aux.getTipo(controlador, ts, ts_u);
                valor_aux = exp_aux.getValor(controlador, ts, ts_u);
                if (tipo_axu == tipo_valor ||
                    (tipo_axu == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOUBLE) ||
                    (tipo_valor == Tipo_1.tipo.CADENA && tipo_axu == Tipo_1.tipo.CARACTER)) {
                    let simbolo = new Simbolos_1.Simbolos(aux.simbolo, aux.tipo, id_aux, valor_aux);
                    ts_local.agregar(id_aux, simbolo);
                    ts_u.agregar(id_aux, simbolo);
                }
            }
            return true;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `Las variables  no son del mismo tipo`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.columna}`);
        }
        return false;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        // let hijo_sim = new Nodo("Simbolos", "")
        return padre;
    }
}
exports.DeclaracionStruct = DeclaracionStruct;
