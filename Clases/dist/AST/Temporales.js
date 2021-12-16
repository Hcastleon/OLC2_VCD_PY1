"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temporales = exports.Resultado3D = exports.Temporal = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Temporal {
    constructor(nombre) {
        this.nombre = nombre;
        this.utilizado = false;
    }
    obtener() {
        return this.nombre;
    }
    utilizar() {
        this.utilizado = true;
        return this.nombre;
    }
}
exports.Temporal = Temporal;
class Resultado3D {
    constructor() {
        this.etiquetasV = [];
        this.etiquetasF = [];
        this.codigo3D = "";
        this.temporal = null;
        this.tipo = Tipo_1.tipo.NULO;
    }
}
exports.Resultado3D = Resultado3D;
class Temporales {
    constructor() {
        this.lista_temporales = [];
        this.contador_temporales = -1;
        this.contador_parametro = -1;
        this.contador_etiquetas = -1;
        this.etiquetaV = "";
        this.etiquetaF = "";
        this.etiquetasV = [];
        this.etiquetasF = [];
    }
    nuevoTemporal() {
        let temp = new Temporal(this.temporal());
        this.lista_temporales.push(temp);
        return temp;
    }
    temporal() {
        this.contador_temporales = this.contador_temporales + 1;
        return "t" + this.contador_temporales;
    }
    parametro() {
        this.contador_parametro = this.contador_parametro + 1;
        return "a" + this.contador_parametro;
    }
    etiqueta() {
        this.contador_etiquetas = this.contador_etiquetas + 1;
        return "L" + this.contador_etiquetas;
    }
    escribirEtiquetas(etiquetas) {
        let res = "";
        etiquetas.forEach((element) => {
            res += element + ":";
        });
        return res + "\n";
    }
    ultimaEtiqueta() {
        return "L" + this.contador_etiquetas;
    }
    saltoCondicional(condicion, etiqueta) {
        return "if " + condicion + " goto " + etiqueta + ";\n";
    }
    saltoIncondicional(etiqueta) {
        return "goto " + etiqueta + ";\n";
    }
    crearLinea(linea, comentario) {
        return linea + "; //" + comentario + "\n";
    }
}
exports.Temporales = Temporales;
