"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const Funcion_1 = require("./Instrucciones/Funcion");
const Declaracion_1 = require("./Instrucciones/Declaracion");
const Asignacion_1 = require("./Instrucciones/Asignacion");
const Nodo_1 = require("./AST/Nodo");
const Arbol_1 = require("./AST/Arbol");
const Temporales_1 = require("./AST/Temporales");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    const salida = gramatica.parse(entrada);
    const instrucciones = salida.arbol;
    let listaErrores = salida.errores;
    let reportGramar = salida.reportg;
    let controlador = new Controller_1.Controller();
    const entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
    let entornoU = new TablaSim_1.TablaSim(null, "Global");
    controlador.errores = listaErrores.slice();
    let Temp = new Temporales_1.Temporales();
    const ast = new Ast_1.AST(instrucciones);
    instrucciones.forEach((ins) => {
        if (ins instanceof Funcion_1.Funcion) {
            let funcion = ins;
            funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
        }
        if (ins instanceof Declaracion_1.Declaracion || ins instanceof Asignacion_1.Asignacion) {
            ins.ejecutar(controlador, entornoGlobal, entornoU);
        }
    });
    instrucciones.forEach((element) => {
        if (element instanceof Funcion_1.Funcion) {
            let funcion = element;
            if (funcion.getIdentificador() == "main") {
                element.ejecutar(controlador, entornoGlobal, entornoU);
            }
        }
    });
    let raiz = new Nodo_1.Nodo("Inicio", "");
    instrucciones.forEach((element) => {
        raiz.addHijo(element.recorrer());
    });
    let grafo = new Arbol_1.Arbol();
    let res = grafo.tour(raiz);
    return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0), ast: res, tradu: controlador.texto, gramar: reportGramar };
}
