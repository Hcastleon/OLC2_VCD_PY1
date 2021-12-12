"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Llamada {
    constructor(identificador, para, linea, column) {
        this.identificador = identificador;
        this.parametros = para;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts) {
        if (ts.existe(this.identificador)) {
            let sim_func = ts.getSimbolo(this.identificador);
            return sim_func.tipo.tipo;
        }
        else {
            //TODO error
        }
    }
    getValor(controlador, ts, ts_u) {
        return this.ejecutar(controlador, ts, ts_u);
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let ts_local = new TablaSim_1.TablaSim(ts, this.identificador);
            ts.setSiguiente(ts_local);
            let sim_func = ts.getSimbolo(this.identificador);
            if (this.verificarParams(this.parametros, sim_func.lista_params, controlador, ts, ts_local, ts_u)) {
                let r = sim_func === null || sim_func === void 0 ? void 0 : sim_func.ejecutar(controlador, ts_local, ts_u);
                if (r != null) {
                    return r;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La funcion ${this.identificador}, no existe`, this.linea, this.column);
            controlador.errores.push(error);
            controlador.append(`La funcion ${this.identificador}, no existe En la linea ${this.linea}, y columna ${this.column}`);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Llamada", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        let hijo_para = new Nodo_1.Nodo("Parametros", "");
        if (this.parametros != null) {
            for (let para of this.parametros) {
                let hijo_para2 = new Nodo_1.Nodo("Parametro", "");
                hijo_para2.addHijo(para.recorrer());
                hijo_para.addHijo(hijo_para2);
            }
        }
        padre.addHijo(hijo_para);
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    verificarParams(para_llama, para_func, controlador, ts, ts_local, ts_u) {
        if (para_llama.length == (para_func === null || para_func === void 0 ? void 0 : para_func.length)) {
            let aux;
            let id_aux;
            let tipo_axu;
            let exp_aux;
            let tipo_valor;
            let valor_aux;
            for (let i = 0; i < para_llama.length; i++) {
                aux = para_func[i];
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
            let error = new Errores_1.Errores("Semantico", `Las variables  no son del mismo tipo`, this.linea, this.column);
            controlador.errores.push(error);
            controlador.append(`Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.column}`);
        }
        return false;
    }
}
exports.Llamada = Llamada;
