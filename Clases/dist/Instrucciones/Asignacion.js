"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Asignacion {
    constructor(identificador, valor, linea, column) {
        this.identificador = identificador;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a;
        if (ts.existe(this.identificador)) {
            let valor = this.valor.getValor(controlador, ts, ts_u);
            (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador}, no existe en el entorno`, this.linea, this.column);
            controlador.errores.push(error);
        }
        if (ts.sig instanceof Array) {
            let entornos = ts.sig;
            entornos.forEach((entorno) => {
                if (entorno.nombre == this.identificador) {
                    entorno.tabla.forEach((element) => {
                        element.valor = null;
                    });
                }
                else {
                    /*
                    let error = new Errores(
                      "Semantico",
                      ` El struct ${this.identificador} no existe`,
                      this.linea,
                      this.column
                    );
                    controlador.errores.push(error);*/
                    //continue;
                }
            });
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        //padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.valor.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let salida = new Temporales_1.Resultado3D();
            salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
            salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ASIGANA %%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
            salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
            //let valor = this.valor.traducir(Temp, controlador, ts, ts_u);
            let simbolo = ts.getSimbolo(this.identificador);
            if (simbolo != null) {
                let nodo = this.valor.traducir(Temp, controlador, ts, ts_u);
                let ultimoT;
                if (nodo.codigo3D == "") {
                    ultimoT = nodo.temporal.nombre;
                }
                else {
                    if (nodo.tipo == Tipo_1.tipo.CADENA) {
                        ultimoT = nodo.temporal.nombre;
                    }
                    else {
                        ultimoT = Temp.ultimoTemporal();
                    }
                }
                if (!(nodo.tipo == Tipo_1.tipo.BOOLEAN)) {
                    salida.codigo3D += nodo.codigo3D + "\n";
                }
                else {
                    if (simbolo.valor == true) {
                        ultimoT = "1";
                    }
                    else {
                        ultimoT = "0";
                    }
                }
                if (ts.nombre != "Global" && simbolo != null) {
                    if (ts.entorno == 0) {
                        ts.entorno = ts.entorno + ts.ant.entorno;
                    }
                    let temp = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + simbolo.posicion + "; \n";
                    salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n";
                    //simbolo.posicion = ts.entorno;
                    //ts.entorno++;
                }
                else if (ts.nombre == "Global" && simbolo != null) {
                    // ts.entorno++;
                    salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                    //simbolo.posicion = ts.entorno;
                    //ts.entorno++;
                }
            }
            return salida;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador}, no existe en el entorno`, this.linea, this.column);
            controlador.errores.push(error);
        }
    }
}
exports.Asignacion = Asignacion;
