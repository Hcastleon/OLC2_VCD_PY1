"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSim = void 0;
class TablaSim {
    constructor(ant) {
        this.ant = ant;
        this.tabla = new Map();
    }
    agregar(id, simbolo) {
        this.tabla.set(id.toLowerCase(), simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            // let existe = ts.tabla.get(id);
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id) {
        let ts = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
}
exports.TablaSim = TablaSim;
