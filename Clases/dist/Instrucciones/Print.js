"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
class Print {
    constructor(expresion, linea, columna) {
        this.lista_exp = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let expres of this.lista_exp) {
            let result = expres.getValor(controlador, ts, ts_u);
            if (result != null) {
                if (typeof result === "string") {
                    let nuevo_string = this.trae_algo(result, ts);
                    if (nuevo_string != null) {
                        result = nuevo_string;
                    }
                }
                controlador.append(result);
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        this.lista_exp.forEach((element) => {
            padre.addHijo(element.recorrer());
        });
        return padre;
    }
    trae_algo(contiene, ts) {
        let nueva_salida = contiene;
        let condicion = /[.+]?\$(?:\(([^\n\r]+)\)|([^\)\n\r\s]+))/gm;
        if (condicion.test(contiene)) {
            let lista = contiene.match(condicion);
            if (lista) {
                for (let index = 0; index < lista.length; index++) {
                    const element = lista[index];
                    if (element.length <= 2) {
                        let salida = element.replace("$", "");
                        let sim = ts.getSimbolo(salida);
                        let valor = sim === null || sim === void 0 ? void 0 : sim.getValor();
                        nueva_salida = nueva_salida.replace(element, valor);
                    }
                    else {
                        let salida = element.replace("$(", "");
                        salida = salida.substring(0, salida.length - 1);
                        if (salida.includes("[")) {
                            let vari = salida.substring(0, salida.indexOf("["));
                            let posi = salida.substring(salida.indexOf("[") + 1, salida.indexOf("]"));
                            let sim = ts.getSimbolo(vari);
                            let valor = sim === null || sim === void 0 ? void 0 : sim.getValor()[Number(posi)];
                            nueva_salida = nueva_salida.replace(element, valor);
                        }
                        else {
                            let sim = ts.getSimbolo(salida);
                            let valor = sim === null || sim === void 0 ? void 0 : sim.getValor();
                            nueva_salida = nueva_salida.replace(element, valor);
                        }
                    }
                }
            }
            return nueva_salida;
        }
        else {
            return null;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // cadena = cadena.temporal.utilizar();
        //cadena = cadena[1:-1];
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%% PRINTLN %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        for (let expres of this.lista_exp) {
            let exp_3D = expres.traducir(Temp, controlador, ts, ts_u);
            //IDENTIFICADOR------------------------------------------------------------------------------------------
            if (exp_3D instanceof Simbolos_1.Simbolos) {
                if (exp_3D.tipo.stype == "ENTERO") {
                    if (ts.nombre != "Global") {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                        salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        salida.codigo3D += "\n" + 'printf("%d", (int)' + temp2 + ");";
                        // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    }
                    else {
                        let temp = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                        // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                        salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                    }
                }
                else if (exp_3D.tipo.stype == "DECIMAL") {
                    if (ts.nombre != "Global") {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                        salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        salida.codigo3D += "\n" + 'printf("%f", (double)' + temp2 + ");";
                        // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    }
                    else {
                        let temp = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                        // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                        salida.codigo3D += "\n" + 'printf("%f", (double)' + temp + ");";
                    }
                }
                else if (exp_3D.tipo.stype == "CHAR") {
                    if (ts.nombre != "Global") {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                        salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                        // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    }
                    else {
                        let temp = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                        // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                        salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                    }
                }
                else if (exp_3D.tipo.stype == "STRING") {
                    if (ts.nombre != "Global") {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                        salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        //----------------
                        // salida.codigo3D += "\n" + exp_3D.codigo3D;
                        let posicion = Temp.temporal();
                        let valor = Temp.temporal();
                        let v = Temp.etiqueta();
                        let f = Temp.etiqueta();
                        salida.codigo3D += posicion + " = " + temp2 + "; //Posicion de inicio de la cadena\n";
                        salida.codigo3D += f + ":";
                        salida.codigo3D += valor + " = heap[(int)" + posicion + "];\n";
                        salida.codigo3D +=
                            Temp.saltoCondicional("(" + valor + " == 0 )", v) +
                                "// Si esta vacio no imprimimos nada\n";
                        salida.codigo3D += posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
                        salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
                        salida.codigo3D += Temp.saltoIncondicional(f);
                        salida.codigo3D += v + ":";
                        //------------
                        //salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                        // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    }
                    else {
                        let temp = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                        // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                        salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                    }
                }
                else if (exp_3D.tipo.stype == "BOOLEAN") {
                    if (ts.nombre != "Global") {
                        let temp = Temp.temporal();
                        let temp2 = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                        salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                        //---
                        let verdadera = Temp.etiqueta();
                        let salto = Temp.etiqueta();
                        if (exp_3D.valor == true) {
                            salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 1)", verdadera);
                        }
                        else {
                            salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 0)", verdadera);
                        }
                        salida.codigo3D +=
                            'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                        salida.codigo3D += Temp.saltoIncondicional(salto);
                        salida.codigo3D += verdadera + ":";
                        salida.codigo3D +=
                            'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                        salida.codigo3D += salto + ":";
                        // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    }
                    else {
                        let temp = Temp.temporal();
                        salida.tipo = Tipo_1.tipo.ID;
                        salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                        // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                        salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                    }
                }
                return salida;
            }
            // EXPRESIOMES--------------------------------------------------------------------------------------
            //
            if (exp_3D.tipo == Tipo_1.tipo.ENTERO) {
                salida.codigo3D += "\n" + exp_3D.codigo3D;
                salida.codigo3D += "\n" + 'printf("%d", (int)' + exp_3D.temporal.nombre + ");";
            }
            else if (exp_3D.tipo == Tipo_1.tipo.DOUBLE) {
                salida.codigo3D += "\n" + exp_3D.codigo3D;
                salida.codigo3D += "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";
            }
            else if (exp_3D.tipo == Tipo_1.tipo.CARACTER) {
                salida.codigo3D += "\n" + exp_3D.codigo3D;
                salida.codigo3D +=
                    "\n" + 'printf("%c", (char)' + exp_3D.temporal.nombre + "); // Se imprime char";
            }
            else if (exp_3D.tipo == Tipo_1.tipo.CADENA) {
                salida.codigo3D += "\n" + exp_3D.codigo3D;
                let posicion = Temp.temporal();
                let valor = Temp.temporal();
                let v = Temp.etiqueta();
                let f = Temp.etiqueta();
                salida.codigo3D +=
                    posicion + " = " + exp_3D.temporal.nombre + "; //Posicion de inicio de la cadena\n";
                salida.codigo3D += f + ":";
                salida.codigo3D += valor + " = heap[(int)" + posicion + "];\n";
                salida.codigo3D +=
                    Temp.saltoCondicional("(" + valor + " == 0 )", v) +
                        "// Si esta vacio no imprimimos nada\n";
                salida.codigo3D += posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
                salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
                salida.codigo3D += Temp.saltoIncondicional(f);
                salida.codigo3D += v + ":";
            }
            else if (exp_3D.tipo == Tipo_1.tipo.BOOLEAN) {
                controlador.appendT("\n" + exp_3D.codigo3D);
                if (exp_3D.etiquetasV.length == 0) {
                    let verdadera = Temp.etiqueta();
                    let salto = Temp.etiqueta();
                    salida.codigo3D += Temp.saltoCondicional("(" + exp_3D.temporal.nombre + " == 0)", verdadera);
                    salida.codigo3D +=
                        'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                    salida.codigo3D += Temp.saltoIncondicional(salto);
                    salida.codigo3D += verdadera + ":";
                    salida.codigo3D +=
                        'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                    salida.codigo3D += salto + ":";
                }
                else {
                    let salto = Temp.etiqueta();
                    salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasV);
                    salida.codigo3D +=
                        'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                    salida.codigo3D += Temp.saltoIncondicional(salto);
                    salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasF);
                    salida.codigo3D +=
                        'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                    salida.codigo3D += salto + ":";
                }
            }
        }
        return salida;
    }
}
exports.Print = Print;
