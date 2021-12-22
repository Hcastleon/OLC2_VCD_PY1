"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cadenas = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
const Temporales_1 = require("../../AST/Temporales");
const Temporales_2 = require("../../AST/Temporales");
class Cadenas {
    constructor(expre1, expre2, expre3, operador, linea, column) {
        this.expre1 = expre1;
        this.expre2 = expre2;
        this.expre3 = expre3;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    getTipo(controlador, ts, ts_u) { }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        let valor_expre3;
        if (this.expre2 === null) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }
        else {
            if (this.expre3 === null) {
                valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
                valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
            }
            else {
                valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
                valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
                valor_expre3 = this.expre3.getValor(controlador, ts, ts_u);
            }
        }
        switch (this.operador) {
            case "caracterposition":
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            return valor_expre1.charAt(valor_expre2);
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "substring":
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            if (typeof valor_expre3 === "number") {
                                if (this.isInt(Number(valor_expre3))) {
                                    return valor_expre1.substring(valor_expre2, valor_expre3);
                                }
                                else {
                                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "length":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.length;
                }
                else if (typeof valor_expre1 === "object") {
                    return valor_expre1.length;
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "touppercase":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toUpperCase();
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "tolowercase":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toLowerCase();
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador, "");
        if (this.operador == "caracterposition") {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
        }
        else if (this.operador == "substring") {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
            padre.addHijo(this.expre3.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    getTipoArray(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipoDato(dato) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof dato == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (dato === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == "caracterposition") {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "caracterposition", 0);
        }
        else if (this.operador == "substring") {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "substring", 0);
        }
        else if (this.operador == "length") {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "length", 0);
        }
        else if (this.operador == "touppercase") {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "touppercase", 0);
        }
        else if (this.operador == "tolowercase") {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "tolowercase", 0);
        }
        //modulo unario concatenar0  repetir
        return "Holiwis";
    }
    generarOperacionBinario(Temp, controlador, ts, ts_u, signo, recursivo) {
        let valor_expre1;
        let valor_expre2;
        let valor_expre3;
        if (this.expre2 === null) {
            valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor_expre2 = new Temporales_1.Resultado3D();
            valor_expre2.codigo3D = "";
            valor_expre2.temporal = new Temporales_2.Temporal("0");
            valor_expre2.tipo = Tipo_1.tipo.ENTERO;
            valor_expre3 = new Temporales_1.Resultado3D();
            valor_expre3.codigo3D = "";
            valor_expre3.temporal = new Temporales_2.Temporal("0");
            valor_expre3.tipo = Tipo_1.tipo.ENTERO;
        }
        else {
            if (this.expre3 === null) {
                valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
                valor_expre2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
                valor_expre3 = new Temporales_1.Resultado3D();
                valor_expre3.codigo3D = "";
                valor_expre3.temporal = new Temporales_2.Temporal("0");
                valor_expre3.tipo = Tipo_1.tipo.ENTERO;
            }
            else {
                valor_expre1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
                valor_expre2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
                valor_expre3 = this.expre3.traducir(Temp, controlador, ts, ts_u);
            }
        }
        if (valor_expre1 == (null || undefined) ||
            valor_expre2 == (null || undefined) ||
            valor_expre3 == (null || undefined))
            return null;
        let resultado = valor_expre1.codigo3D;
        if (resultado != "" && valor_expre2.codigo3D && (valor_expre3.codigo3D = "")) {
            resultado = resultado + "\n" + valor_expre2.codigo3D;
        }
        else if (resultado != "" && valor_expre2.codigo3D && valor_expre3.codigo3D) {
            resultado = resultado + "\n" + valor_expre2.codigo3D + "\n" + valor_expre3.codigo3D;
        }
        else {
            /* tendria que ir pinshe error culero */
            resultado += valor_expre2.codigo3D;
        }
        if (valor_expre1 instanceof Simbolos_1.Simbolos ||
            valor_expre2 instanceof Simbolos_1.Simbolos ||
            valor_expre3 instanceof Simbolos_1.Simbolos) {
            resultado = "";
        }
        if (resultado != "") {
            resultado = resultado + "\n";
        }
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.CADENA;
        if (this.expre2 === null) {
            if (signo == "length") {
                if (valor_expre1 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        //----------------
                        let temp3 = Temp.temporal();
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += temp3 + " = 0; //inicia el contador\n";
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp2 + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D +=
                            Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                                "//Si se cumple es el final de cadena \n";
                        result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
                        result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de contador \n";
                        result.codigo3D += Temp.saltoIncondicional(v);
                        result.codigo3D += f + ": \n";
                        result.tipo = Tipo_1.tipo.ENTERO;
                        result.temporal = new Temporales_2.Temporal(temp3);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp = Temp.temporal();
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        //----------------
                        let temp2 = Temp.temporal();
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += temp2 + " = 0; //inicia el contador\n";
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D +=
                            Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                                "//Si se cumple es el final de cadena \n";
                        result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
                        result.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
                        result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de contador \n";
                        result.codigo3D += Temp.saltoIncondicional(v);
                        result.codigo3D += f + ": \n";
                        result.tipo = Tipo_1.tipo.ENTERO;
                        result.temporal = new Temporales_2.Temporal(temp2);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        //----------------
                        let temp2 = Temp.temporal();
                        result.codigo3D += temp2 + "= " + valor_expre1.temporal.nombre + "; \n";
                        let temp3 = Temp.temporal();
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += temp3 + " = 0; //inicia el contador\n";
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp2 + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D +=
                            Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                                "//Si se cumple es el final de cadena \n";
                        result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
                        result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de contador \n";
                        result.codigo3D += Temp.saltoIncondicional(v);
                        result.codigo3D += f + ": \n";
                        result.tipo = Tipo_1.tipo.ENTERO;
                        result.temporal = new Temporales_2.Temporal(temp3);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp = Temp.temporal();
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        //----------------
                        let temp2 = Temp.temporal();
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += temp2 + " = 0; //inicia el contador\n";
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D +=
                            Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                                "//Si se cumple es el final de cadena \n";
                        result.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
                        result.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
                        result.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de contador \n";
                        result.codigo3D += Temp.saltoIncondicional(v);
                        result.codigo3D += f + ": \n";
                        result.tipo = Tipo_1.tipo.ENTERO;
                        result.temporal = new Temporales_2.Temporal(temp2);
                    }
                }
            }
            else if (signo == "touppercase") {
                if (valor_expre1 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " - 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " - 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " - 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 97 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 122 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " - 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
            }
            else if (signo == "tolowercase") {
                if (valor_expre1 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " + 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " + 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " + 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " < " + 65 + ")", v2);
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " > " + 90 + ")", v2);
                        result.codigo3D += aux + " = " + aux + " + 32; \n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
            }
            else {
                console.log("chinga tu madre no se que pedo ");
            }
        }
        else if (this.expre3 === null) {
            if (signo == "caracterposition") {
                if (valor_expre1 instanceof Simbolos_1.Simbolos && valor_expre2 instanceof Simbolos_1.Simbolos == false) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1 instanceof Simbolos_1.Simbolos && valor_expre2 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp2 + " = P + " + valor_expre2.posicion + ";\n";
                        result.codigo3D += temp2 + " = stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp3 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = stack[(int)" + valor_expre2.posicion + "];\n";
                        result.codigo3D += temp3 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if ((valor_expre1.tipo = Tipo_1.tipo.CADENA && valor_expre2 instanceof Simbolos_1.Simbolos == false)) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D +=
                            temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA && valor_expre2 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D +=
                            temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
                        result.codigo3D += temp2 + " = P + " + valor_expre2.posicion + ";\n";
                        result.codigo3D += temp2 + " = stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp3 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = stack[(int)" + valor_expre2.posicion + "];\n";
                        result.codigo3D += temp3 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp3 + " = " + temp3 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f2 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp0 + " = heap[(int)" + temp0 + "]; //llevo el dato\n";
                        result.codigo3D += f2 + ": \n";
                        result.tipo = Tipo_1.tipo.CARACTER;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
            }
        }
        else {
            if (signo == "substring") {
                if (valor_expre1 instanceof Simbolos_1.Simbolos &&
                    valor_expre2 instanceof Simbolos_1.Simbolos == false &&
                    valor_expre3 instanceof Simbolos_1.Simbolos == false) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D +=
                            temp3 +
                                " = " +
                                valor_expre3.temporal.nombre +
                                "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1 instanceof Simbolos_1.Simbolos &&
                    valor_expre2 instanceof Simbolos_1.Simbolos &&
                    valor_expre3 instanceof Simbolos_1.Simbolos == false) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp3 +
                                " = " +
                                valor_expre3.temporal.nombre +
                                "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1 instanceof Simbolos_1.Simbolos &&
                    valor_expre2 instanceof Simbolos_1.Simbolos == false &&
                    valor_expre3 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D +=
                            temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1 instanceof Simbolos_1.Simbolos &&
                    valor_expre2 instanceof Simbolos_1.Simbolos &&
                    valor_expre3 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = P + " + valor_expre1.posicion + "; \n";
                        result.codigo3D += temp + "= stack[(int)" + temp + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= stack[(int)" + valor_expre1.posicion + "]; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA &&
                    valor_expre2 instanceof Simbolos_1.Simbolos == false &&
                    valor_expre3 instanceof Simbolos_1.Simbolos == false) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D +=
                            temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D +=
                            temp3 +
                                " = " +
                                valor_expre3.temporal.nombre +
                                "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA &&
                    valor_expre2 instanceof Simbolos_1.Simbolos &&
                    valor_expre3 instanceof Simbolos_1.Simbolos == false) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D +=
                            temp + "= " + valor_expre1.temporal.nombre + "; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp3 +
                                " = " +
                                valor_expre3.temporal.nombre +
                                "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.temporal.nombre + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA &&
                    valor_expre2 instanceof Simbolos_1.Simbolos == false &&
                    valor_expre3 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D +=
                            temp2 +
                                " = " +
                                valor_expre2.temporal.nombre +
                                ";  // la posicion que quiero obtener\n";
                        result.codigo3D +=
                            temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.temporal.nombre + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
                else if (valor_expre1.tipo == Tipo_1.tipo.CADENA &&
                    valor_expre2 instanceof Simbolos_1.Simbolos &&
                    valor_expre3 instanceof Simbolos_1.Simbolos) {
                    if (ts.nombre != "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + " = " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D +=
                            temp2 + " = P + " + valor_expre2.posicion + ";  // la posicion que quiero obtener\n";
                        result.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; // aqui viene mi valor\n";
                        result.codigo3D +=
                            temp3 + " = " + valor_expre3.posicion + "- 1;  // la posicion que quiero obtener\n";
                        result.codigo3D += temp3 + "= stack[(int)" + temp3 + "]; // aqui viene mi valor\n";
                        result.codigo3D += temp4 + " = 0; // contador de posicion \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                    else if (ts.nombre == "Global" && valor_expre1 != null) {
                        result.codigo3D += valor_expre1.codigo3D;
                        let temp0 = Temp.temporal();
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        let temp3 = Temp.temporal();
                        let temp4 = Temp.temporal();
                        result.codigo3D += temp0 + " = H + 0; \n";
                        result.codigo3D += temp + "= " + valor_expre1.temporal.nombre + "; \n";
                        result.codigo3D += temp2 + " = " + valor_expre2.posicion + "; \n";
                        result.codigo3D += temp3 + " = " + valor_expre3.posicion + " - 1; \n";
                        result.codigo3D += temp4 + " = 0 ; \n";
                        //----------------
                        let aux = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let v2 = Temp.etiqueta();
                        let v3 = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        let f2 = Temp.etiqueta();
                        let f3 = Temp.etiqueta();
                        result.codigo3D += v + ": \n";
                        result.codigo3D +=
                            aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp2 + ")", v2);
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v + " ; //regresamos a comparar\n";
                        result.codigo3D += f + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v2 + ": \n";
                        result.codigo3D += Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f2);
                        result.codigo3D += Temp.saltoCondicional("(" + temp4 + " == " + temp3 + ")", v3);
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += temp + " = " + temp + " + 1; \n";
                        result.codigo3D += temp4 + " = " + temp4 + " + 1; \n";
                        result.codigo3D += "goto " + v2 + " ; //regresamos a comparar\n";
                        result.codigo3D += f2 + ": \n";
                        result.codigo3D += "heap[(int)H] = 0; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "goto " + f3 + " ; //salimos\n";
                        result.codigo3D += v3 + ": \n";
                        result.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de la cadena\n";
                        result.codigo3D += "heap[(int)H] = " + aux + "; //Posicion de cadena\n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += "heap[(int)H] = 0; //Termina cadena \n";
                        result.codigo3D += "H = H + 1; //Posicion de cadena nueva\n";
                        result.codigo3D += f3 + ": \n";
                        result.tipo = Tipo_1.tipo.CADENA;
                        result.temporal = new Temporales_2.Temporal(temp0);
                    }
                }
            }
            else {
                console.log("ni pedo no te tocaba");
            }
        }
        return result;
    }
}
exports.Cadenas = Cadenas;
