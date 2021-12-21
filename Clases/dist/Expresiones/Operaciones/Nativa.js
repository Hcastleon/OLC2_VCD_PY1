"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativa = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
const Temporales_2 = require("../../AST/Temporales");
class Nativa extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
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
            if (this.isChar(String(valor))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.POTENCIA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return Math.pow(valor_expre1, valor_expre2);
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
            case Operaciones_1.Operador.SENO:
                if (typeof valor_expre1 === "number") {
                    return Math.sin(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.COSENO:
                if (typeof valor_expre1 === "number") {
                    return Math.cos(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.TANGENTE:
                if (typeof valor_expre1 === "number") {
                    return Math.tan(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.RAIZ:
                if (typeof valor_expre1 === "number") {
                    return Math.sqrt(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.LOGARITMO:
                if (typeof valor_expre1 === "number") {
                    return Math.log10(valor_expre1);
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
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == Operaciones_1.Operador.POTENCIA) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "POTENCIA", 0);
        }
        else if (this.operador == Operaciones_1.Operador.SENO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "SENO", 0);
        }
        else if (this.operador == Operaciones_1.Operador.COSENO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "COSENO", 0);
        }
        else if (this.operador == Operaciones_1.Operador.TANGENTE) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "TANGENTE", 0);
        }
        else if (this.operador == Operaciones_1.Operador.RAIZ) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "RAIZ", 0);
        }
        else if (this.operador == Operaciones_1.Operador.LOGARITMO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "LOGARITMO", 0);
        }
        //modulo unario concatenar0  repetir
        return "Holiwis";
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador.toString(), "");
        if (this.operador == Operaciones_1.Operador.POTENCIA) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
        }
        return padre;
    }
    generarOperacionBinario(Temp, controlador, ts, ts_u, signo, recursivo) {
        let valor1;
        let valor2;
        let valor_U;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = new Temporales_1.Resultado3D();
            valor2.codigo3D = "";
            valor2.temporal = new Temporales_2.Temporal("0");
            valor2.tipo = Tipo_1.tipo.ENTERO;
            // valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        }
        if (valor1 == (null || undefined) || valor2 == (null || undefined))
            return null;
        let resultado = valor1.codigo3D;
        if (resultado != "" && valor2.codigo3D) {
            resultado = resultado + "\n" + valor2.codigo3D;
        }
        else {
            resultado += valor2.codigo3D;
        }
        if (valor1 instanceof Simbolos_1.Simbolos || valor2 instanceof Simbolos_1.Simbolos) {
            resultado = "";
        }
        if (resultado != "") {
            resultado = resultado + "\n";
        }
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.DOUBLE;
        let temporal = Temp.nuevoTemporal();
        let op = "";
        if (this.expreU === false) {
            if (valor1 instanceof Simbolos_1.Simbolos && valor2 instanceof Simbolos_1.Simbolos == false) {
                //todo menos %
                let res = this.operacionSimbolosIzq(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.DOUBLE;
            }
            else if (valor2 instanceof Simbolos_1.Simbolos && valor1 instanceof Simbolos_1.Simbolos == false) {
                let res = this.operacionSimbolosDer(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.DOUBLE;
            }
            else if (valor2 instanceof Simbolos_1.Simbolos && valor1 instanceof Simbolos_1.Simbolos) {
                let res = this.operacionSimbolos(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.DOUBLE;
            }
            else {
                if (signo == "POTENCIA") {
                    op =
                        temporal.obtener() +
                            "= pow(" +
                            valor1.temporal.utilizar() +
                            "," +
                            valor2.temporal.utilizar() +
                            ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
            }
        }
        else {
            if (valor1 instanceof Simbolos_1.Simbolos) {
                //todo menos %
                let res = this.operacionSimbolosIzq(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.DOUBLE;
            }
            else {
                if (signo == "SENO") {
                    op = temporal.obtener() + "= sin(" + valor1.temporal.utilizar() + ");";
                }
                else if (signo == "COSENO") {
                    op = temporal.obtener() + "= cos(" + valor1.temporal.utilizar() + ");";
                }
                else if (signo == "TANGENTE") {
                    op = temporal.obtener() + "= tan(" + valor1.temporal.utilizar() + ");";
                }
                else if (signo == "RAIZ") {
                    op = temporal.obtener() + "= sqrt(" + valor1.temporal.utilizar() + ");";
                }
                else if (signo == "LOGARITMO") {
                    op = temporal.obtener() + "= log10(" + valor1.temporal.utilizar() + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
            }
        }
        resultado += op;
        result.codigo3D = resultado;
        result.temporal = temporal;
        return result;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    operacionSimbolosIzq(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor1 != null) {
            let ultimoT;
            if (valor2.codigo3D == "") {
                ultimoT = valor2.temporal.nombre;
            }
            else {
                ultimoT = Temp.ultimoTemporal();
            }
            if (!(valor2.tipo == Tipo_1.tipo.BOOLEAN)) {
                op += valor2.codigo3D + "\n";
            }
            else {
                if (valor1.valor == true) {
                    ultimoT = "1";
                }
                else {
                    ultimoT = "0";
                }
            }
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                //
                //console.log(valor1);
                op += temporal.obtener() + " = P + " + valor1.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let nuevo = Temp.temporal();
                op += valor2.codigo3D;
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + val + "," + valor2.temporal.nombre + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + val + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + val + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + val + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + val + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + val + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
                //  op += "stack[(int)" + temporal.obtener() + "]  = " + nuevo + "; \n"
                // result.tipo = tipo.ID;
                // valor1.posicion = ts.entorno;
                // ts.entorno++;
            }
            else if (ts.nombre == "Global" && valor1 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + ts.entorno + "] ;\n";
                let nuevo = Temp.temporal();
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + val + "," + valor2.temporal.nombre + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + val + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + val + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + val + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + val + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + val + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
                //  op += "stack[(int)" + ts.entorno + "]  = " + nuevo + "; \n"
                // result.tipo = tipo.ID;
                // valor1.posicion = ts.entorno;
                //ts.entorno++;
            }
        }
        return { op, temporal };
    }
    operacionSimbolosDer(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor2 != null) {
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                op += temporal.obtener() + " = P + " + valor2.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let nuevo = Temp.temporal();
                op += valor1.codigo3D;
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + valor1.temporal.nombre + "," + val + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + valor1.temporal.nombre + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
            }
            else if (ts.nombre == "Global" && valor2 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + ts.entorno + "] ;\n";
                let nuevo = Temp.temporal();
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + valor1.temporal.nombre + "," + val + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + valor1.temporal.nombre + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + valor1.temporal.nombre + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
            }
        }
        return { op, temporal };
    }
    operacionSimbolos(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor2 != null && valor1 != null) {
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                op += temporal.obtener() + " = P + " + valor1.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let temp2 = Temp.temporal();
                op += temp2 + " = P + " + valor2.posicion + "; \n";
                let val2 = Temp.temporal();
                op += val2 + " = stack[(int)" + temp2 + "] ;\n";
                //---------
                let nuevo = Temp.temporal();
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + val + "," + val2 + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + val + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + val + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + val + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + val + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + val + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
            }
            else if (ts.nombre == "Global" && valor2 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + valor1.posicion + "] ;\n";
                let val2 = Temp.temporal();
                op += val2 + " = stack[(int)" + valor2.posicion + "] ;\n";
                //---------
                let nuevo = Temp.temporal();
                if (signo == "POTENCIA") {
                    op += nuevo + "= pow(" + val + "," + val2 + ");";
                }
                else if (signo == "SENO") {
                    op += nuevo + "= sin(" + val + ");";
                }
                else if (signo == "COSENO") {
                    op += nuevo + "= cos(" + val + ");";
                }
                else if (signo == "TANGENTE") {
                    op += nuevo + "= tan(" + val + ");";
                }
                else if (signo == "RAIZ") {
                    op += nuevo + "= sqrt(" + val + ");";
                }
                else if (signo == "LOGARITMO") {
                    op += nuevo + "= log10(" + val + ");";
                }
                else {
                    console.log("ERROR BONTICO");
                }
                temporal.nombre = nuevo;
            }
        }
        return { op, temporal };
    }
}
exports.Nativa = Nativa;
