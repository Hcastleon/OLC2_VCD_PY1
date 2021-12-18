"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = exports.Ubicacion = exports.tipo = void 0;
var tipo;
(function (tipo) {
    tipo[tipo["ENTERO"] = 0] = "ENTERO";
    tipo[tipo["DOUBLE"] = 1] = "DOUBLE";
    tipo[tipo["BOOLEAN"] = 2] = "BOOLEAN";
    tipo[tipo["CARACTER"] = 3] = "CARACTER";
    tipo[tipo["CADENA"] = 4] = "CADENA";
    tipo[tipo["NULO"] = 5] = "NULO";
    tipo[tipo["VOID"] = 6] = "VOID";
    tipo[tipo["ARRAY"] = 7] = "ARRAY";
    tipo[tipo["MAIN"] = 8] = "MAIN";
    tipo[tipo["STRUCT"] = 9] = "STRUCT";
    tipo[tipo["ID"] = 10] = "ID";
})(tipo = exports.tipo || (exports.tipo = {}));
var Ubicacion;
(function (Ubicacion) {
    Ubicacion[Ubicacion["HEAP"] = 0] = "HEAP";
    Ubicacion[Ubicacion["STACK"] = 1] = "STACK";
})(Ubicacion = exports.Ubicacion || (exports.Ubicacion = {}));
class Tipo {
    constructor(stype) {
        this.stype = stype;
        this.tipo = this.getTipo(stype);
    }
    getTipo(stype) {
        if (stype == "DECIMAL") {
            return tipo.DOUBLE;
        }
        else if (stype == "ENTERO") {
            return tipo.ENTERO;
        }
        else if (stype == "STRING") {
            return tipo.CADENA;
        }
        else if (stype == "BOOLEAN") {
            return tipo.BOOLEAN;
        }
        else if (stype == "CHAR") {
            return tipo.CARACTER;
        }
        else if (stype == "VOID") {
            return tipo.VOID;
        }
        else if (stype == "ARRAY") {
            return tipo.ARRAY;
        }
        else if (stype == "STRUCT") {
            return tipo.STRUCT;
        }
        return tipo.CADENA;
    }
    getStype() {
        return this.stype;
    }
}
exports.Tipo = Tipo;
