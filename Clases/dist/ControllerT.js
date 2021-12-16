"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerT = void 0;
const NodoT_1 = require("./AST/NodoT");
class ControllerT {
    constructor() {
        this.temporal = 0;
        this.posicion = 0;
        this.etiqueta = 0;
    }
    generarTemporal() {
        let n = this.temporal;
        this.temporal++;
        return "t" + n;
    }
    crearLinea(linea, comentario) {
        return linea + "                ;" + comentario;
    }
    generarEtiqueta() {
        let i = this.etiqueta;
        this.etiqueta++;
        return "L" + i;
    }
    /*
       agregarError(error: Errores) {
        Errores(
          error.tipo,
          error.descripcion,
          error.linea,
          error.columna
        );
      }*/
    posicionAbsoluta() {
        let i = this.posicion;
        this.posicion++;
        return i;
    }
    saltoCondicional(condicion, etiqueta) {
        return "if " + condicion + " then goto " + etiqueta;
    }
    saltoIncondicional(etiqueta) {
        return "goto " + etiqueta;
    }
    escribirEtiquetas(etiquetas) {
        let nodo = new NodoT_1.NodoT();
        nodo.codigo = [];
        etiquetas.forEach((element) => {
            nodo.codigo.push(element + ":");
        });
        return nodo;
    }
}
exports.ControllerT = ControllerT;
