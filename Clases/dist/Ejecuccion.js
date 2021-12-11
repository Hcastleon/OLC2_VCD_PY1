"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const Funcion_1 = require("./Instrucciones/Funcion");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    let controlador = new Controller_1.Controller();
    const entornoGlobal = new TablaSim_1.TablaSim(null);
    let entornoU = new TablaSim_1.TablaSim(null);
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
    });
    instrucciones.forEach((element) => {
        element.ejecutar(controlador, entornoGlobal, entornoU);
    });
    return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores() };
}
