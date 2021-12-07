import { AST } from "./AST/Ast";
import { TablaSim } from "./TablaSimbolos/TablaSim";
import { Instruccion } from "./Interfaces/Instruccion";

const gramatica = require('./Gramatica/gramatica');

function ejecutarCodigo(entrada:string){
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    const ast:AST = new AST(instrucciones);
    const entornoGlobal: TablaSim = new TablaSim(null);
    //recorro todas las raices  RECURSIVA
    instrucciones.forEach((element:Instruccion) => {
        element.ejecutar(entornoGlobal,ast);
    })
}