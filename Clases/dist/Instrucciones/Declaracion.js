"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Arreglo_1 = require("../Expresiones/Arreglo");
const AritArreglo_1 = require("../Expresiones/Operaciones/AritArreglo");
const Temporales_1 = require("../AST/Temporales");
const Conversion_1 = require("../Expresiones/Operaciones/Conversion");
const AccesoArreglo_1 = require("../Expresiones/AccesoArreglo");
class Declaracion {
    constructor(tipo, lista_simbolos, linea, columna) {
        this.tipo = tipo;
        this.lista_simbolos = lista_simbolos;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo;
            // Se verifica que la varaible no exista en la tabla de simbolos actual
            if (ts.existeEnActual(variable.identificador)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${variable.identificador}, ya se declaro anteriormente`, this.linea, this.columna);
                controlador.errores.push(error);
                continue;
            }
            if (variable.valor != null) {
                if (variable.valor instanceof Arreglo_1.Arreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipoArreglo(controlador, ts, ts_u, this.tipo);
                    if (tipo_valor == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim); // array[0] //arreglo
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else if (variable.valor instanceof AritArreglo_1.AritArreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    if (this.getTipo(valor) == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else if (variable.valor instanceof Conversion_1.Conversion) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_local = variable.valor.getTipo(controlador, ts, ts_u);
                    if (tipo_local == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_local} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else if (variable.valor instanceof AccesoArreglo_1.AccesoArreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_vemaos = variable.valor.getTipoArreglo(controlador, ts, ts_u);
                    if (tipo_vemaos == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
                    if (tipo_valor == this.tipo.tipo ||
                        ((tipo_valor == Tipo_1.tipo.DOUBLE || tipo_valor == Tipo_1.tipo.ENTERO) &&
                            (this.tipo.tipo == Tipo_1.tipo.ENTERO || this.tipo.tipo == Tipo_1.tipo.DOUBLE)) ||
                        (tipo_valor == Tipo_1.tipo.CADENA && this.tipo.tipo == Tipo_1.tipo.CARACTER)) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
            }
            else {
                let value;
                if (this.tipo.tipo == Tipo_1.tipo.ENTERO) {
                    value = 0;
                }
                else if (this.tipo.tipo == Tipo_1.tipo.DOUBLE) {
                    value = 0.0;
                }
                else {
                    value = null;
                }
                let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, value);
                ts.agregar(variable.identificador, nuevo_sim);
                ts_u.agregar(variable.identificador, nuevo_sim);
            }
        }
    }
    getTipo(lista) {
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
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        // let hijo_sim = new Nodo("Simbolos", "")
        padre.addHijo(new Nodo_1.Nodo(this.tipo.stype, ""));
        for (let simb of this.lista_simbolos) {
            let varia = simb;
            if (varia.valor != null) {
                padre.addHijo(new Nodo_1.Nodo(simb.identificador, ""));
                // padre.addHijo(new Nodo("=", ""))
                let aux = simb.valor;
                padre.addHijo(aux.recorrer());
            }
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
        let salida = new Temporales_1.Resultado3D();
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%% DECLARA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% \n";
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo;
            let existe = ts.getSimbolo(variable.identificador);
            if (variable.valor != null) {
                let nodo = variable.valor.traducir(Temp, controlador, ts, ts_u);
                let ultimoT;
                if (nodo.codigo3D == "") {
                    ultimoT = nodo.temporal.nombre;
                }
                else {
                    console.log(nodo);
                    if (nodo.tipo == Tipo_1.tipo.BOOLEAN) {
                        if (nodo instanceof Simbolos_1.Simbolos == false) {
                            salida.codigo3D += nodo.codigo3D + "\n";
                        }
                        salida.etiquetasV = salida.etiquetasV.concat(nodo.etiquetasV);
                        salida.etiquetasF = salida.etiquetasF.concat(nodo.etiquetasF);
                        if (ts.nombre != "Global" && existe != null) {
                            if (ts.entorno == 0) {
                                ts.entorno = ts.entorno + ts.ant.entorno;
                            }
                            let a = Temp.etiqueta();
                            let temp = Temp.temporal();
                            salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
                            salida.codigo3D += "stack[(int)" + temp + "] = 1; \n";
                            salida.codigo3D += "goto " + a + ";\n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
                            salida.codigo3D += "stack[(int)" + temp + "] = 0; \n";
                            salida.codigo3D += a + ": \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                            return salida;
                        }
                        else if (ts.nombre == "Global" && existe != null) {
                            let a = Temp.etiqueta();
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
                            salida.codigo3D += "stack[(int)" + ts.entorno + "] = 1; \n";
                            salida.codigo3D += "goto " + a + ";\n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
                            salida.codigo3D += "stack[(int)" + ts.entorno + "] = 0; \n";
                            salida.codigo3D += a + ": \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                            return salida;
                        }
                        //ultimoT = nodo.temporal.nombre
                    }
                    else if (nodo.tipo == Tipo_1.tipo.ID) {
                        // EL tipo es ID pero lo usacom como referencia del incremneto o decremento
                        if (ts.nombre != "Global" && existe != null) {
                            if (ts.entorno == 0) {
                                ts.entorno = ts.entorno + ts.ant.entorno;
                            }
                            salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                        }
                        else if (ts.nombre == "Global" && existe != null) {
                            // ts.entorno++;
                            salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                        }
                    }
                    else if (nodo.tipo == Tipo_1.tipo.CADENA) {
                        ultimoT = nodo.temporal.nombre;
                    }
                    else if (nodo.tipo == Tipo_1.tipo.DOUBLE) {
                        ultimoT = nodo.temporal.nombre;
                    }
                    else if (variable.valor instanceof Arreglo_1.Arreglo) {
                        let valor = variable.valor.getValor(controlador, ts, ts_u);
                        let aux = this.setArreglo(valor, Temp);
                        salida.codigo3D += aux === null || aux === void 0 ? void 0 : aux.codigo3D;
                        ultimoT = aux.temporal.nombre;
                        //salida.temporal = aux?.temporal;
                    }
                    else {
                        ultimoT = Temp.ultimoTemporal();
                    }
                }
                if (nodo instanceof Simbolos_1.Simbolos == false) {
                    salida.codigo3D += nodo.codigo3D + "\n";
                }
                if (ts.nombre != "Global" && existe != null) {
                    if (ts.entorno == 0) {
                        ts.entorno = ts.entorno + ts.ant.entorno;
                    }
                    let temp = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                    salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
                else if (ts.nombre == "Global" && existe != null) {
                    // ts.entorno++;
                    salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
            }
            else {
                if (ts.nombre != "Global" && existe != null) {
                    if (ts.entorno == 0) {
                        ts.entorno = ts.entorno + ts.ant.entorno;
                    }
                    let temp = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                    salida.codigo3D += "stack[(int)" + temp + "]  = 0; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
                else if (ts.nombre == "Global" && existe != null) {
                    // ts.entorno++;
                    salida.codigo3D += "stack[(int)" + ts.entorno + "]  = 0; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
            }
        }
        return salida;
    }
    setArreglo(array, Temp) {
        let nodo = new Temporales_1.Resultado3D();
        nodo.tipo = Tipo_1.tipo.CADENA;
        let valor = array;
        console.log(array);
        nodo.codigo3D +=
            "//%%%%%%%%%%%%%%%%%%% GUARDAR Arrelgo %%%%%%%%%%%%%%%%%%%% \n";
        let temporal = Temp.temporal();
        nodo.codigo3D += temporal + " = H; \n ";
        array.forEach((element, index) => {
            nodo.codigo3D +=
                "heap[(int) H] = " +
                    element +
                    ";  //Guardamos en el Heap el caracter: " +
                    element +
                    "\n";
            nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
            if (index === 0) {
                nodo.temporal = new Temporales_1.Temporal(temporal);
            }
        });
        /*
             for (let i = 0; i < valor.length -1; i++) {
              nodo.codigo3D +=
                "heap[(int) H] = " +
                valor[i] +
                ";  //Guardamos en el Heap el caracter: " +
                valor[i] +
                "\n";
              nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
        
              if (i === 0) {
                nodo.temporal = new Temporal(temporal);
              }}*/
        /*
        for (let i = 0; i < cadena.length; i++) {
          nodo.codigo3D +=
            "heap[(int) H] = " +
            cadena.charCodeAt(i) +
            ";  //Guardamos en el Heap el caracter: " +
            cadena.charAt(i) +
            "\n";
          nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
    
          if (i === 0) {
            nodo.temporal = new Temporal(temporal);
          }
        }*/
        nodo.codigo3D += "heap[(int) H] = 0; //Fin de la cadena \n";
        nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
        return nodo;
    }
}
exports.Declaracion = Declaracion;
