"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Temporales_1 = require("../AST/Temporales");
class Primitivo {
    constructor(primitivo, tipo, linea, columna) {
        this.columna = columna;
        this.linea = linea;
        this.primitivo = primitivo;
        this.tipo = tipo;
    }
    getTipo(controlador, ts, ts_u) {
        /*let valor = this.getValor(controlador, ts, ts_u);
    
        if (typeof valor == "number") {
          if (this.isInt(Number(valor))) {
            return tipo.ENTERO;
          }
          return tipo.DOUBLE;
        } else if (typeof valor == "string") {
          if (this.isChar(String(this.primitivo))) {
            return tipo.CARACTER;
          }else{
          return tipo.CADENA;
          }
        } else if (typeof valor == "boolean") {
          return tipo.BOOLEAN;
        } else if (valor === null) {
          return tipo.NULO;
        }*/
        return this.tipo;
    }
    getTipoTraduc() {
        return this.tipo;
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
    isChar(n) {
        return n.length === 1 && n.match(/./i);
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
            if (this.isChar(String(this.primitivo))) {
                resultado3D.tipo = Tipo_1.tipo.CARACTER;
            }
            else {
                resultado3D.tipo = Tipo_1.tipo.CADENA;
            }
        }
        else if (typeof this.primitivo == "boolean") {
            resultado3D.tipo = Tipo_1.tipo.BOOLEAN;
        }
        else if (this.primitivo === null) {
            resultado3D.tipo = Tipo_1.tipo.NULO;
        }
        //-------------------
        if (this.primitivo == true && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("1");
        }
        else if (this.primitivo == false && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("0");
        }
        else if (typeof this.primitivo == "string") {
            if (this.tipo == Tipo_1.tipo.CARACTER) {
                let ascii = this.primitivo.toString().charCodeAt(0);
                let nodo = new Temporales_1.Resultado3D();
                nodo.tipo = Tipo_1.tipo.CARACTER;
                nodo.temporal = new Temporales_1.Temporal(ascii.toString());
                resultado3D = nodo;
            }
            else {
                resultado3D = this.setCadena(this.primitivo.toString(), Temp);
            }
        }
        else {
            resultado3D.temporal = new Temporales_1.Temporal(this.primitivo.toString());
        }
        return resultado3D;
    }
    setCadena(cadena, Temp) {
        let nodo = new Temporales_1.Resultado3D();
        nodo.tipo = Tipo_1.tipo.CADENA;
        let cadenatemp = cadena;
        cadena = cadena.replace("\\n", "\n");
        cadena = cadena.replace("\\t", "\t");
        cadena = cadena.replace('\\"', '"');
        cadena = cadena.replace("\\'", "'");
        nodo.codigo3D +=
            "//%%%%%%%%%%%%%%%%%%% GUARDAR CADENA " + cadenatemp + "%%%%%%%%%%%%%%%%%%%% \n";
        let temporal = Temp.temporal();
        nodo.codigo3D += temporal + " = H; \n ";
        for (let i = 0; i < cadena.length; i++) {
            nodo.codigo3D += "heap[(int) H] = " + cadena.charCodeAt(i) + ";  //Guardamos en el Heap el caracter: " + cadena.charAt(i) + "\n";
            nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
            if (i === 0) {
                nodo.temporal = new Temporales_1.Temporal(temporal);
            }
        }
        nodo.codigo3D += "heap[(int) H] = 0; //Fin de la cadena \n";
        nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
        return nodo;
    }
}
exports.Primitivo = Primitivo;
