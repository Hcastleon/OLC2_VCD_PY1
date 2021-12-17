"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Break_1 = require("./Transferencia/Break");
const Continue_1 = require("./Transferencia/Continue");
const Return_1 = require("./Transferencia/Return");
class Funcion extends Simbolos_1.Simbolos {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_ints, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
        this.linea = linea;
        this.column = columna;
        this.etiqueta = "";
    }
    agregarSimboloFunc(controlador, ts, ts_u) {
        if (!ts.existe(this.identificador)) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, this.identificador);
        ts.setSiguiente(ts_local);
        let valor_type = this.tipo.stype;
        let tipo_aux = "";
        if (valor_type == "ENTERO" || valor_type == "DECIMAL") {
            tipo_aux = "number";
        }
        else if (valor_type == "STRING" || valor_type == "CHAR") {
            tipo_aux = "string";
        }
        else if (valor_type == "BOOLEAN") {
            tipo_aux = "boolean";
        }
        for (let ins of this.lista_ints) {
            let result = ins.ejecutar(controlador, ts_local, ts_u);
            if (result != null) {
                if (result instanceof Errores_1.Errores) {
                    return result;
                }
                else {
                    if (ins instanceof Break_1.Break || result instanceof Continue_1.Continue) {
                        let error = new Errores_1.Errores("Semantico", ` No se acepta el tipo en el entorno`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (tipo_aux == "VOID") {
                        return;
                    }
                    else {
                        if (typeof result == tipo_aux) {
                            return result;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", ` La funcion no concuerda con el tipo`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        this.lista_ints.forEach((element) => {
            padre.addHijo(element.recorrer());
        });
        return padre;
    }
    inicializar() { }
    traducir(Temp, controlador, ts, ts_u) {
        // controlador.appendT("\n"+ this.etiqueta + ":"+"#"+this.identificador);
        for (let ins of this.lista_ints) {
            let a = ins.traducir(Temp, controlador, ts, ts_u);
            if (a != undefined) {
                controlador.appendT("\n" + a.codigo3D);
            }
        }
    }
}
exports.Funcion = Funcion;
