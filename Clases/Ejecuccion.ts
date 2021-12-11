import { AST } from "./AST/Ast";
import { TablaSim } from "./TablaSimbolos/TablaSim";
import { Instruccion } from "./Interfaces/Instruccion";
import { Controller } from "./Controller";
import { Funcion } from "./Instrucciones/Funcion";

const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";

function ejecutarCodigo(entrada: string) {
  //traigo todas las raices
  const instrucciones = gramatica.parse(entrada);
  let controlador = new Controller();
  const entornoGlobal: TablaSim = new TablaSim(null);
  let entornoU = new TablaSim(null);

  const ast: AST = new AST(instrucciones);

  //recorro todas las raices  RECURSIVA
  /*
  for (let element of instrucciones) {
    element.ejecutar(controlador, entornoGlobal, entornoU);
  }*/
  instrucciones.forEach((ins: Instruccion) => {
    if (ins instanceof Funcion) {
      let funcion = ins as Funcion;
      funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
    }
  });

  instrucciones.forEach((element: Instruccion) => {
    element.ejecutar(controlador, entornoGlobal, entornoU);
  });

  return {salida:controlador.consola,tabla_e:controlador.graficar_tErrores()};
}
