"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Struct_1 = require("../Expresiones/Struct");
class AccesoStruct {
    constructor(acceso1, acceso2, linea, columna) {
        this.acceso1 = acceso1;
        this.acceso2 = acceso2;
        this.linea = linea;
        this.column = columna;
    }
    getTipo(controlador, ts, ts_u) {
        // let valor = this.getValor(controlador,ts,ts_u);
        let id_exists = ts.getSimbolo(this.acceso1.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        //busco en global
        let tabla = ts;
        while (tabla.ant != null) {
            tabla = tabla.ant;
        }
        let struct = tabla.getSimbolo(this.acceso1.identificador);
        if (struct != null) {
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
    getValorRecursivo(obj, accesos, controlador, ts, ts_u) {
        let temporales = accesos.slice();
        let acceso = temporales[0];
        temporales.shift();
        /*  if(obj.entorno.tabla.size == 0){
              obj.ejecutar(controlador, ts, ts_u);
          }*/
        if (!obj.entorno.existeEnActual(acceso)) {
            let error = new Errores_1.Errores("Semantico", ` No existe dentro del struct`, this.linea, this.column);
            controlador.errores.push(error);
            return;
        }
        let simbolo = obj.entorno.getSimbolo(acceso);
        if (temporales.length > 0 && simbolo != null) {
            if (simbolo.valor instanceof Struct_1.Struct) {
                let struct = simbolo.valor;
                this.getValorRecursivo(simbolo.valor, temporales, controlador, ts, ts_u);
            }
            else {
                let error = new Errores_1.Errores("Semantico", ` No existe dentro del struct`, this.linea, this.column);
                controlador.errores.push(error);
                return;
            }
        }
        else {
            return simbolo === null || simbolo === void 0 ? void 0 : simbolo.valor;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("accesoStruct", "");
        return padre;
    }
}
exports.AccesoStruct = AccesoStruct;
