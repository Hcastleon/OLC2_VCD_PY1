"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversion = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Temporales_1 = require("../../AST/Temporales");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
class Conversion {
    constructor(tipo, expre2, operador, linea, column) {
        this.tipo = tipo;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    getTipo(controlador, ts, ts_u) {
        return this.tipo.tipo;
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre2;
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        switch (this.operador) {
            case "parse":
                if (this.tipo.tipo == Tipo_1.tipo.DOUBLE || this.tipo.tipo == Tipo_1.tipo.ENTERO) {
                    if (typeof valor_expre2 === "string") {
                        return Number(valor_expre2);
                    }
                }
                else if (this.tipo.tipo == Tipo_1.tipo.BOOLEAN) {
                    if (typeof valor_expre2 === "string") {
                        if (valor_expre2.toLowerCase() == "true") {
                            return true;
                        }
                        return false;
                    }
                }
                break;
            case "toint":
                if (typeof valor_expre2 === "number") {
                    //if (!this.isInt(Number(valor_expre2))) {
                    return Math.round(valor_expre2);
                    //}
                }
                break;
            case "todouble":
                if (typeof valor_expre2 === "number") {
                    return this.twoDecimal(valor_expre2);
                }
                break;
            case "typeof":
                return typeof valor_expre2;
                break;
            case "tostring":
                if (!(typeof valor_expre2 === null)) {
                    return String(valor_expre2);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador, "");
        padre.addHijo(this.expre2.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        salida.temporal = new Temporales_1.Temporal("");
        let nodo = this.expre2.traducir(Temp, controlador, ts, ts_u);
        if (nodo.codigo3D != undefined)
            salida.codigo3D += nodo.codigo3D;
        // console.log(nodo);
        switch (this.operador) {
            case "parse":
                break;
            case "toint":
                if (nodo.tipo == Tipo_1.tipo.DOUBLE) {
                    nodo.tipo = Tipo_1.tipo.ENTERO;
                }
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%% TOINT %%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                let temp = Temp.temporal();
                if (nodo instanceof Simbolos_1.Simbolos == false) {
                    salida.codigo3D += temp + " = (int)" + nodo.temporal.nombre + ";\n";
                    salida.temporal = new Temporales_1.Temporal(temp);
                }
                else if (nodo instanceof Simbolos_1.Simbolos) {
                    let temp2 = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + nodo.posicion + "; \n";
                    salida.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += temp2 + " = (int)" + temp + ";\n";
                    salida.temporal = new Temporales_1.Temporal(temp2);
                }
                salida.tipo = Tipo_1.tipo.ENTERO;
                return salida;
                break;
            case "todouble":
                if (nodo.tipo == Tipo_1.tipo.DOUBLE) {
                    nodo.tipo = Tipo_1.tipo.ENTERO;
                }
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%% TODOUBLE %%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                let temp0 = Temp.temporal();
                if (nodo instanceof Simbolos_1.Simbolos == false) {
                    salida.codigo3D += temp0 + " = (double)" + nodo.temporal.nombre + ";\n";
                    salida.temporal = new Temporales_1.Temporal(temp0);
                }
                else if (nodo instanceof Simbolos_1.Simbolos) {
                    let temp2 = Temp.temporal();
                    salida.codigo3D += temp0 + " = P + " + nodo.posicion + "; \n";
                    salida.codigo3D += temp0 + "= stack[(int)" + temp0 + "]; \n";
                    salida.codigo3D += temp2 + " = (double)" + temp0 + ";\n";
                    salida.temporal = new Temporales_1.Temporal(temp2);
                }
                salida.tipo = Tipo_1.tipo.DOUBLE;
                return salida;
                break;
            case "typeof":
                break;
            case "tostring":
                if (nodo.tipo == Tipo_1.tipo.CADENA) {
                }
                else if (nodo.tipo == Tipo_1.tipo.BOOLEAN) {
                    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%% TOSTRING %%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
                    let salto = Temp.etiqueta();
                    salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
                    let trues = this.setCadena("true", Temp);
                    salida.codigo3D += trues.codigo3D;
                    salida.codigo3D += Temp.saltoIncondicional(salto);
                    salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
                    let falses = this.setCadena("false", Temp);
                    salida.codigo3D += falses.codigo3D;
                    salida.codigo3D += salto + ": \n";
                    let temporal;
                    if (nodo.temporal != null && nodo.temporal.nombre == "true") {
                        temporal = trues.temporal.nombre;
                    }
                    else if (nodo.temporal != null && nodo.temporal.nombre == "false") {
                        temporal = falses.temporal.nombre;
                    }
                    else {
                        temporal = Temp.temporal();
                    }
                    salida.tipo == Tipo_1.tipo.CADENA;
                    //let temporal: string = Temp.temporal();
                    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%5 TOSTRING %%%%%%%%%%%%%%%%%%%%% \n";
                    // salida.codigo3D += temporal + " = H + 0; // Inicio de la cadena nueva \n";
                    //salida.codigo3D += this.concatenar(nodo, Temp).codigo3D;
                    // salida.codigo3D += "heap[(int)H] = 0 ; //Finde la cadena \n";
                    //salida.codigo3D += "H = H + 1; // Aumento del heap \n";
                    salida.temporal.nombre = temporal;
                    // console.log(nodo);
                }
                else {
                    salida = this.setCadena(nodo.temporal.nombre, Temp);
                    salida.tipo == Tipo_1.tipo.CADENA;
                    let temporal = Temp.temporal();
                    salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%5 TOSTRING %%%%%%%%%%%%%%%%%%%%% \n";
                    salida.codigo3D += temporal + " = H + 0; // Inicio de la cadena nueva \n";
                    salida.codigo3D += this.concatenar(nodo, Temp).codigo3D;
                    salida.codigo3D += "heap[(int)H] = 0 ; //Finde la cadena \n";
                    salida.codigo3D += "H = H + 1; // Aumento del heap \n";
                    salida.temporal.nombre = temporal;
                }
                salida.tipo = Tipo_1.tipo.CADENA;
                return salida;
                break;
            default:
                break;
        }
        salida.tipo == Tipo_1.tipo.CADENA;
        return salida;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    twoDecimal(numberInt) {
        return Number.parseFloat(numberInt.toFixed(4));
    }
    concatenar(nodito, Temp) {
        let nodo = new Temporales_1.Resultado3D();
        nodo.temporal = new Temporales_1.Temporal("");
        if (nodito instanceof Simbolos_1.Simbolos) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp + " = P + " + nodito.posicion + "; \n";
            nodo.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            //----------------
            let aux = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp2 + "]; //Posicion de inicio de la cadena\n";
            nodo.temporal.nombre = aux;
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // invrementar heap \n";
            nodo.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        else {
            //nodo.codigo3D += nodito.codigo3D;
            //console.log(nodito);
            nodo.codigo3D += "// %%%%%%%%%%%%%%%%%%%%5 Concatenando cadena  %%%%%%%%%%%%% \n";
            let temp2 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp2 + "= stack[(int)H]; \n";
            //----------------
            let aux = Temp.temporal();
            //let temp2 = Temp.temporal();
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp2 + "]; // Se almacena primer valor \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // invrementar heap \n";
            nodo.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
        }
        return nodo;
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
            nodo.codigo3D +=
                "heap[(int) H] = " +
                    cadena.charCodeAt(i) +
                    ";  //Guardamos en el Heap el caracter: " +
                    cadena.charAt(i) +
                    "\n";
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
exports.Conversion = Conversion;
