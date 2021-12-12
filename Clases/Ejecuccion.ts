import { AST } from "./AST/Ast";
import { TablaSim } from "./TablaSimbolos/TablaSim";
import { Instruccion } from "./Interfaces/Instruccion";
import { Controller } from "./Controller";
import { Funcion } from "./Instrucciones/Funcion";
import { tipo } from "./TablaSimbolos/Tipo";
import { Declaracion } from "./Instrucciones/Declaracion";
import { Asignacion } from "./Instrucciones/Asignacion";
import { Nodo } from "./AST/Nodo"
import { Arbol } from "./AST/Arbol"

const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";

function ejecutarCodigo(entrada: string) {
  //traigo todas las raices
  const instrucciones = gramatica.parse(entrada);
  let controlador = new Controller();
  const entornoGlobal: TablaSim = new TablaSim(null, "Global");
  let entornoU = new TablaSim(null, "Global");

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
    if(ins instanceof Declaracion || ins instanceof Asignacion){

      ins.ejecutar(controlador, entornoGlobal,entornoU);
    }

  });

  instrucciones.forEach((element: Instruccion) => {
    if (element instanceof Funcion) {
      let funcion = element as Funcion;
      if(funcion.getIdentificador()== "main"){
          element.ejecutar(controlador, entornoGlobal, entornoU);
      }
    }
  });

  let raiz = new Nodo("Inicio","");

  instrucciones.forEach((element: Instruccion) => {
    raiz.addHijo(element.recorrer())
  });
 
 
  let grafo: Arbol = new Arbol();
  let res = grafo.tour(raiz);
  
  return {salida:controlador.consola,tabla_e:controlador.graficar_tErrores(),tabla_s: controlador.recursivo_tablita(entornoGlobal,"",0), ast: res};
}
