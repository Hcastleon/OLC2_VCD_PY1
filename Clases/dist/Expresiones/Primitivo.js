"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Temporales_1 = require("../AST/Temporales");
class Primitivo {
    constructor(primitivo, linea, columna) {
        this.columna = columna;
        this.linea = linea;
        this.primitivo = primitivo;
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipoTraduc() {
        if (typeof this.primitivo == "number") {
            if (this.isInt(Number(this.primitivo))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof this.primitivo == "string") {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof this.primitivo == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (this.primitivo === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        return this.primitivo;
    }
    recorrer() {
        let padre;
        if (this.primitivo == null) {
            padre = new Nodo_1.Nodo("Null", "");
        }
        else {
            padre = new Nodo_1.Nodo(this.primitivo.toString(), "");
            //padre.addHijo(new Nodo(this.primitivo.toString(),""));
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let resultado3D = new Temporales_1.Resultado3D();
        resultado3D.codigo3D = "";
        if (typeof this.primitivo == "number") {
            if (this.isInt(Number(this.primitivo))) {
                resultado3D.tipo = Tipo_1.tipo.ENTERO;
            }
            resultado3D.tipo = Tipo_1.tipo.DOUBLE;
        }
        else if (typeof this.primitivo == "string") {
            resultado3D.tipo = Tipo_1.tipo.CADENA;
        }
        else if (typeof this.primitivo == "boolean") {
            resultado3D.tipo = Tipo_1.tipo.BOOLEAN;
        }
        else if (this.primitivo === null) {
            resultado3D.tipo = Tipo_1.tipo.NULO;
        }
        if (this.primitivo == true && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("1");
        }
        else if (this.primitivo == false && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("0");
        }
        else {
            resultado3D.temporal = new Temporales_1.Temporal(this.primitivo.toString());
        }
        return resultado3D;
    }
}
exports.Primitivo = Primitivo;
