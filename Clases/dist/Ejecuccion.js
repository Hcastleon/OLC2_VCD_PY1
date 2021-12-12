"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const Funcion_1 = require("./Instrucciones/Funcion");
const Declaracion_1 = require("./Instrucciones/Declaracion");
const Asignacion_1 = require("./Instrucciones/Asignacion");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    let controlador = new Controller_1.Controller();
    const entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
    let entornoU = new TablaSim_1.TablaSim(null, "Global");
    const ast = new Ast_1.AST(instrucciones);
    //recorro todas las raices  RECURSIVA
    /*
    for (let element of instrucciones) {
      element.ejecutar(controlador, entornoGlobal, entornoU);
    }*/
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
    return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0) };
}
