"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSim = void 0;
class TablaSim {
    constructor(ant, nombre) {
        this.entorno = 0;
        this.ant = ant;
        this.sig = [];
        this.tabla = new Map();
        this.nombre = nombre;
    }
    agregar(id, simbolo) {
        this.tabla.set(id, simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
        //   this.tabla.set(id.toLowerCase(), simbolo);
    }
    setSiguiente(tablita) {
        this.sig.push(tablita);
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            // let existe = ts.tabla.get(id.toLowerCase());
            let existe = ts.tabla.get(id);
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id) {
        let ts = this;
        //let existe = ts.tabla.get(id.toLowerCase());
        let existe = ts.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            //let existe = ts.tabla.get(id.toLowerCase());
            let existe = ts.tabla.get(id);
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
    getEntornoStack() {
        let ts = this;
        let i = 0;
        while (ts != null) {
            ts.tabla.forEach(element => {
                if (element.simbolo == 1 || element.simbolo == 4) {
                    i++;
                }
            });
            ts = ts.ant;
        }
        return i;
    }
}
exports.TablaSim = TablaSim;
