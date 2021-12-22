"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
class Aritmetica extends Operaciones_1.Operacion {
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
        let valor_U;
        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_U = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.SUMA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 + valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 + valor_expre2.charCodeAt(0);
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
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) + valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) + valor_expre2.charCodeAt(0);
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
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.RESTA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 - valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 - valor_expre2.charCodeAt(0);
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
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) - valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) - valor_expre2.charCodeAt(0);
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
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.MULT:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 * valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 * valor_expre2.charCodeAt(0);
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
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) * valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) * valor_expre2.charCodeAt(0);
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
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.DIV:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 / valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 / valor_expre2.charCodeAt(0);
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
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) / valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) / valor_expre2.charCodeAt(0);
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
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.MODULO:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 % valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 % valor_expre2.charCodeAt(0);
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
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) % valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) % valor_expre2.charCodeAt(0);
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
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.UNARIO:
                if (typeof valor_U === "number") {
                    return -valor_U;
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.CONCATENAR:
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1 + valor_expre2;
                    }
                    else if (typeof valor_expre2 === "number") {
                        return valor_expre1 + valor_expre2.toString();
                    }
                    else if (typeof valor_expre2 === "boolean") {
                        return valor_expre1 + valor_expre2.toString();
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1.toString() + valor_expre2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "boolean") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1.toString() + valor_expre2;
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
            case Operaciones_1.Operador.REPETIR:
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            var sum_concat = "";
                            for (var _i = 0; _i < valor_expre2; _i++) {
                                sum_concat = sum_concat + valor_expre1;
                            }
                            return sum_concat;
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
            default:
                break;
        }
    }
    validarLados(recursivo, controlador, ts, ts_u) {
        if (recursivo == 0 && this.expre1.getTipo(controlador, ts, ts_u) == Tipo_1.tipo.ENTERO) {
            return true;
        }
        return false;
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
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
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
        /*if(recursivo==0){
          let temporal = new Temporal(valor1.temporal.utilizar() + " "+ signo+ " "+valor2.temporal.utilizar());
          result.codigo3D = resultado;
          result.temporal = temporal;
          return result;
        }*/
        let temporal = Temp.nuevoTemporal();
        let op = "";
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
            if (signo == "%") {
                op =
                    temporal.obtener() +
                        "= fmod(" +
                        valor1.temporal.utilizar() +
                        "," +
                        valor2.temporal.utilizar() +
                        ");";
            }
            else {
                op =
                    temporal.obtener() +
                        "=" +
                        valor1.temporal.utilizar() +
                        " " +
                        signo +
                        " " +
                        valor2.temporal.utilizar() +
                        ";";
            }
        }
        resultado += op;
        result.codigo3D = resultado;
        result.temporal = temporal;
        return result;
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == Operaciones_1.Operador.SUMA) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "+", 0);
        }
        else if (this.operador == Operaciones_1.Operador.RESTA) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "-", 0);
        }
        else if (this.operador == Operaciones_1.Operador.MULT) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "*", 0);
        }
        else if (this.operador == Operaciones_1.Operador.DIV) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "/", 0);
        }
        else if (this.operador == Operaciones_1.Operador.MODULO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "%", 0);
        }
        else if (this.operador == Operaciones_1.Operador.UNARIO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "-", 0);
        }
        else if (this.operador == Operaciones_1.Operador.CONCATENAR) {
            return this.generarConcat(Temp, controlador, ts, ts_u);
        }
        else if (this.operador == Operaciones_1.Operador.REPETIR) {
            return this.generarRepetido(Temp, controlador, ts, ts_u);
        }
        //modulo unario concatenar0  repetir
        return "Holiwis";
    }
    generarConcat(Temp, controlador, ts, ts_u) {
        let valor1;
        let valor2;
        let valor_U;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
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
        let salida = new Temporales_1.Resultado3D();
        salida.temporal = new Temporales_1.Temporal("");
        salida.tipo = Tipo_1.tipo.CADENA;
        if (valor1 instanceof Simbolos_1.Simbolos == false) {
            salida.codigo3D += valor1.codigo3D;
        }
        if (valor2 instanceof Simbolos_1.Simbolos == false) {
            salida.codigo3D += valor2.codigo3D;
        }
        let temporal = Temp.temporal();
        salida.codigo3D += temporal + " = H + 0; // Inicion de nueva cadena \n";
        salida.codigo3D += this.concatenar(valor1, Temp).codigo3D;
        salida.codigo3D += this.concatenar(valor2, Temp).codigo3D;
        salida.codigo3D += "heap[(int)H] = 0 ; // Fin cadena \n";
        salida.codigo3D += "H = H + 1; // incremenar heap \n";
        salida.temporal.nombre = temporal;
        return salida;
    }
    generarRepetido(Temp, controlador, ts, ts_u) {
        let valor1;
        let valor2;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
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
        let salida = new Temporales_1.Resultado3D();
        salida.temporal = new Temporales_1.Temporal("");
        salida.tipo = Tipo_1.tipo.CADENA;
        if (valor1 instanceof Simbolos_1.Simbolos == false) {
            salida.codigo3D += valor1.codigo3D;
        }
        if (valor2 instanceof Simbolos_1.Simbolos == false) {
            salida.codigo3D += valor2.codigo3D;
        }
        let temporal = Temp.temporal();
        salida.codigo3D += temporal + " = H + 0; // Inicion de nueva cadena \n";
        salida.codigo3D += this.repetir(valor1, valor2, Temp).codigo3D;
        salida.codigo3D += "heap[(int)H] = 0 ; // Fin cadena \n";
        salida.codigo3D += "H = H + 1; // incremenar heap \n";
        salida.temporal.nombre = temporal;
        return salida;
    }
    repetir(nodito, nodito2, Temp) {
        let nodo = new Temporales_1.Resultado3D();
        nodo.temporal = new Temporales_1.Temporal("");
        if (nodito instanceof Simbolos_1.Simbolos && nodito2 instanceof Simbolos_1.Simbolos == false) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp + " = P + " + nodito.posicion + "; \n";
            nodo.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            nodo.codigo3D += temp2 + " = " + nodito2.temporal.nombre + "; \n";
            //----------------
            let aux = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let v2 = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += temp3 + " = 0; //contador inicial = 0 \n";
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", v2) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // incrementar heap \n";
            nodo.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += v2 + ": \n";
            nodo.codigo3D += temp + " = P + " + nodito.posicion + "; \n";
            nodo.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        else if (nodito instanceof Simbolos_1.Simbolos && nodito2 instanceof Simbolos_1.Simbolos) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp + " = P + " + nodito.posicion + "; \n";
            nodo.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            nodo.codigo3D += temp2 + " = P + " + nodito2.posicion + "; \n";
            nodo.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; \n";
            //----------------
            let aux = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let v2 = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += temp3 + " = 0; //contador inicial = 0 \n";
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", v2) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // incrementar heap \n";
            nodo.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += v2 + ": \n";
            nodo.codigo3D += temp + " = P + " + nodito.posicion + "; \n";
            nodo.codigo3D += temp + "= stack[(int)" + temp + "]; \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        else if (nodito instanceof Simbolos_1.Simbolos == false && nodito2 instanceof Simbolos_1.Simbolos == false) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp + " = " + nodito.temporal.nombre + "; \n";
            nodo.codigo3D += temp2 + " = " + nodito2.temporal.nombre + "; \n";
            //----------------
            let aux = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let v2 = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += temp3 + " = 0; //contador inicial = 0 \n";
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", v2) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // incrementar heap \n";
            nodo.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += v2 + ": \n";
            nodo.codigo3D += temp + " = " + nodito.temporal.nombre + "; \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        else if (nodito instanceof Simbolos_1.Simbolos == false && nodito2 instanceof Simbolos_1.Simbolos) {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            let temp3 = Temp.temporal();
            //salida.tipo = tipo.ID;
            nodo.codigo3D += temp + " = " + nodito.temporal.nombre + "; \n";
            nodo.codigo3D += temp2 + " = P + " + nodito2.posicion + "; \n";
            nodo.codigo3D += temp2 + "= stack[(int)" + temp2 + "]; \n";
            //----------------
            let aux = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let v2 = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += temp3 + " = 0; //contador inicial = 0 \n";
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", v2) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + temp3 + " == " + temp2 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // incrementar heap \n";
            nodo.codigo3D += temp + " = " + temp + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += v2 + ": \n";
            nodo.codigo3D += temp + " = " + nodito.temporal.nombre + "; \n";
            nodo.codigo3D += aux + " = heap[(int)" + temp + "]; //Posicion de inicio de la cadena\n";
            nodo.codigo3D += temp3 + " = " + temp3 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        return nodo;
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
            nodo.codigo3D += "H = H + 1; // incrementar heap \n";
            nodo.codigo3D += temp2 + " = " + temp2 + " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
            nodo.temporal.nombre = temp;
        }
        else {
            //nodo.codigo3D += nodito.codigo3D;
            nodo.codigo3D +=
                "// %%%%%%%%%%%%%%%%%%%% Concatenando cadena " +
                    nodito.temporal.nombre +
                    "%%%%%%%%%%%%% \n";
            let aux = Temp.temporal();
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            nodo.codigo3D += v + ": \n";
            nodo.codigo3D +=
                aux + " = heap[(int)" + nodito.temporal.nombre + "]; // Se almacena primer valor \n";
            nodo.codigo3D +=
                Temp.saltoCondicional("(" + aux + " == " + 0 + ")", f) +
                    "//Si se cumple es el final de cadena \n";
            nodo.codigo3D += "heap[(int)H] =" + aux + "; //Valor de nueva pos \n";
            nodo.codigo3D += "H = H + 1; // invrementar heap \n";
            nodo.codigo3D +=
                nodito.temporal.nombre +
                    " = " +
                    nodito.temporal.nombre +
                    " + 1 ; //incrementar pos de cadena \n";
            nodo.codigo3D += Temp.saltoIncondicional(v);
            nodo.codigo3D += f + ": \n";
        }
        return nodo;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
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
                if (signo == "%") {
                    op += nuevo + "= fmod(" + val + "," + valor2.temporal.nombre + "); \n";
                }
                else {
                    op += nuevo + "=" + val + " " + signo + " " + valor2.temporal.nombre + "; \n";
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
                if (signo == "%") {
                    op += nuevo + "= fmod(" + val + "," + valor2.temporal.nombre + "); \n";
                }
                else {
                    op += nuevo + "=" + val + " " + signo + " " + valor2.temporal.nombre + "; \n";
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
                if (signo == "%") {
                    op += nuevo + "= fmod(" + valor1.temporal.nombre + "," + val + "); \n";
                }
                else {
                    op += nuevo + "=" + valor1.temporal.nombre + " " + signo + " " + val + "; \n";
                }
                temporal.nombre = nuevo;
            }
            else if (ts.nombre == "Global" && valor2 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + ts.entorno + "] ;\n";
                let nuevo = Temp.temporal();
                if (signo == "%") {
                    op += nuevo + "= fmod(" + valor1.temporal.nombre + "," + val + "); \n";
                }
                else {
                    op += nuevo + "=" + valor1.temporal.nombre + " " + signo + " " + val + "; \n";
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
                if (signo == "%") {
                    op += nuevo + "= fmod(" + val + "," + val2 + "); \n";
                }
                else {
                    op += nuevo + "=" + val + " " + signo + " " + val2 + "; \n";
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
                if (signo == "%") {
                    op += nuevo + "= fmod(" + val + "," + val2 + "); \n";
                }
                else {
                    op += nuevo + "=" + val + " " + signo + " " + val2 + "; \n";
                }
                temporal.nombre = nuevo;
            }
        }
        return { op, temporal };
    }
}
exports.Aritmetica = Aritmetica;
