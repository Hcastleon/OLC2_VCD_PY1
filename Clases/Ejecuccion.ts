import { AST } from "./AST/Ast";
import { TablaSim } from "./TablaSimbolos/TablaSim";
import { Instruccion } from "./Interfaces/Instruccion";
import { Controller } from "./Controller";

const gramatica = require("../Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";

function ejecutarCodigo(entrada: string) {
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    let controlador = new Controller();
    const entornoGlobal: TablaSim = new TablaSim(null);
    let entornoU = new TablaSim(null);

    const ast: AST = new AST(instrucciones);

    //recorro todas las raices  RECURSIVA

    instrucciones.forEach((element: Instruccion) => {
        element.ejecutar(controlador, entornoGlobal, entornoU);

    });

    return controlador.consola
}
