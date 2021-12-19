import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Errores } from "../../AST/Errores";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Break } from "../Transferencia/Break";
import { Simbolos } from "../../TablaSimbolos/Simbolos";
import { Continue } from "../Transferencia/Continue";
import { Return } from "../Transferencia/Return";
import { Tipo } from '../../TablaSimbolos/Tipo';
import { Temporales } from "../../AST/Temporales";

export class ForEsp implements Instruccion {
  public asig_decla: Simbolos;
  public actualizacion: Expresion;
  public lista_ins: Array<Instruccion>;
  public linea: number;
  public columna: number;

  constructor(
    asi: any,
    acuta: any,
    list: any,
    linea: any,
    col: any
  ) {
    this.asig_decla = asi;
    this.actualizacion = acuta;
    this.lista_ins = list;
    this.linea = linea;
    this.columna = col;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let variable = this.asig_decla;
    let valor_condi = this.actualizacion.getValor(controlador, ts, ts_u);

    if (typeof valor_condi == "string") {
      variable.tipo = this.actualizacion.getTipo(controlador, ts, ts_u);
      // Se mete a la tabla de simbolos la variable
      let nuevo_sim = new Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
      ts.agregar(variable.identificador, nuevo_sim);
      ts_u.agregar(variable.identificador, nuevo_sim);
      
      let tamno = valor_condi.length;
      let contador = 0;
      siguiente: while (contador < tamno) {
        let ts_local = new TablaSim(ts, "ForIn");
        ts.setSiguiente(ts_local);
        for (let ins of this.lista_ins) {
          if (ts.existe(variable.identificador)) {
            let valor = valor_condi.charAt(contador);
            ts.getSimbolo(variable.identificador)?.setValor(valor);
          } else {
            let error = new Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
            controlador.errores.push(error);
          }
          let result = ins.ejecutar(controlador, ts_local, ts_u);
          if (ins instanceof Break || result instanceof Break) {
            return result;
          }
          if (ins instanceof Continue || result instanceof Continue) {
            contador += 1;
            continue siguiente;
          }
          if (ins instanceof Return) {
            return result;
          }
          if (result != null) {
            return result;
          }
        }
        contador += 1;
      }
    } else if (typeof valor_condi == "object") {
      variable.tipo = this.getTipoArray(valor_condi);
      // Se mete a la tabla de simbolos la variable
      let nuevo_sim = new Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
      ts.agregar(variable.identificador, nuevo_sim);
      ts_u.agregar(variable.identificador, nuevo_sim);

      let tamno = valor_condi.length;
      let contador = 0;
      siguiente: while (contador < tamno) {
        let ts_local = new TablaSim(ts, "ForIn");
        ts.setSiguiente(ts_local);
        for (let ins of this.lista_ins) {
          if (ts.existe(variable.identificador)) {
            let valor = valor_condi[contador];
            ts.getSimbolo(variable.identificador)?.setValor(valor);
          } else {
            let error = new Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
            controlador.errores.push(error);
          }
          let result = ins.ejecutar(controlador, ts_local, ts_u);
          if (ins instanceof Break || result instanceof Break) {
            return result;
          }
          if (ins instanceof Continue || result instanceof Continue) {
            contador += 1;
            continue siguiente;
          }
          if (ins instanceof Return) {
            return result;
          }
          if (result != null) {
            return result;
          }
        }
        contador += 1;
      }
    } else {
      let error = new Errores('Semantico', `La variable ${this.actualizacion.getValor(controlador, ts, ts_u)}, no se permite este tipo de dato`, this.linea, this.columna);
      controlador.errores.push(error);
    }
  }
  recorrer(): Nodo {
    let padre = new Nodo("ForIn", "");

    padre.addHijo(this.actualizacion.recorrer());

    for (let ins of this.lista_ins) {
      padre.addHijo(ins.recorrer());
    }
    return padre;
  }

  getTipoArray(lista: any) {
    let tipito : Tipo;
    if (typeof lista[0] == "number") {
      if (this.isInt(Number(lista[0]))) {
        tipito = new Tipo("ENTERO");
        return tipito;
      }
      tipito = new Tipo("DOUBLE");
      return tipito;
    } else if (typeof lista[0] == "string") {
      if (this.isChar(String(lista[0]))) {
        tipito =  new Tipo("CARACTER");
        return tipito;
      }
      tipito =new Tipo("CADENA");
      return tipito;
    } else if (typeof lista[0] == "boolean") {
      tipito =new Tipo("BOOLEAN");
      return tipito;
    } else if (lista[0] === null) {
      tipito =new Tipo("NULO");
      return tipito;
    }else{
      tipito =new Tipo("NULO");
      return tipito;
    }
  }


  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/./i);
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
    
  }

}