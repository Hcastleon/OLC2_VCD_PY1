import { Nodo } from "../AST/Nodo";
import { NodoT } from "../AST/NodoT";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";
import { Temporales, Temporal, Resultado3D } from "../AST/Temporales";

export class Primitivo implements Expresion {
  public primitivo: any;
  public linea: number;
  public columna: number;

  constructor(primitivo: any, linea: number, columna: number) {
    this.columna = columna;
    this.linea = linea;
    this.primitivo = primitivo;
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor = this.getValor(controlador, ts, ts_u);

    if (typeof valor == "number") {
      if (this.isInt(Number(valor))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof valor == "string") {
      if (this.isChar(String(this.primitivo))) {
        return tipo.CARACTER;
      }else{
      return tipo.CADENA;
      }
    } else if (typeof valor == "boolean") {
      return tipo.BOOLEAN;
    } else if (valor === null) {
      return tipo.NULO;
    }
  }

  getTipoTraduc() {
    if (typeof this.primitivo == "number") {
      if (this.isInt(Number(this.primitivo))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof this.primitivo == "string") {
       if (this.isChar(String(this.primitivo))) {
        return tipo.CARACTER;
      }else{
      return tipo.CADENA;
      }
    } else if (typeof this.primitivo == "boolean") {
      return tipo.BOOLEAN;
    } else if (this.primitivo === null) {
      return tipo.NULO;
    }
  }
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    return this.primitivo;
  }
  recorrer(): Nodo {
    let padre;
    if (this.primitivo == null) {
      padre = new Nodo("Null", "");
    } else {
      padre = new Nodo(this.primitivo.toString(), "");
      //padre.addHijo(new Nodo(this.primitivo.toString(),""));
    }
    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/./i);
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let resultado3D = new Resultado3D();
    resultado3D.codigo3D = "";

    if (typeof this.primitivo == "number") {
      if (this.isInt(Number(this.primitivo))) {
        resultado3D.tipo = tipo.ENTERO;
      }
      resultado3D.tipo = tipo.DOUBLE;
    } else if (typeof this.primitivo == "string") {
      if (this.isChar(String(this.primitivo))) {
        resultado3D.tipo = tipo.CARACTER;
      }else{
      resultado3D.tipo = tipo.CADENA;
      }
      
    } else if (typeof this.primitivo == "boolean") {
      resultado3D.tipo = tipo.BOOLEAN;
    } else if (this.primitivo === null) {
      resultado3D.tipo = tipo.NULO;
    }
    //-------------------

    if (this.primitivo == true && typeof this.primitivo == "boolean") {
      resultado3D.temporal = new Temporal("1");
    } else if (this.primitivo == false && typeof this.primitivo == "boolean") {
      resultado3D.temporal = new Temporal("0");
    } else if (typeof this.primitivo == "string") {
      if (this.isChar(String(this.primitivo))) {
        let ascii = this.primitivo.toString().charCodeAt(0);
        let nodo: Resultado3D = new Resultado3D();
        nodo.tipo = tipo.CARACTER;
        nodo.temporal = new Temporal(ascii.toString());
        resultado3D = nodo;
      } else {
        resultado3D = this.setCadena(this.primitivo.toString(), Temp);
      }
    } else {
      resultado3D.temporal = new Temporal(this.primitivo.toString());
    }

    return resultado3D;
  }

  setCadena(cadena: string, Temp: Temporales) {
    let nodo: Resultado3D = new Resultado3D();
    nodo.tipo = tipo.CADENA;
    let cadenatemp = cadena;
    cadena = cadena.replace("\\n", "\n");
    cadena = cadena.replace("\\t", "\t");
    cadena = cadena.replace('\\"', '"');
    cadena = cadena.replace("\\'", "'");

    nodo.codigo3D +=
      "//%%%%%%%%%%%%%%%%%%% GUARDAR CADENA " + cadenatemp + "%%%%%%%%%%%%%%%%%%%% \n";
      let temporal: string = Temp.temporal();
      nodo.codigo3D += temporal + " = H; \n ";
    for (let i = 0; i < cadena.length; i++) {
      
      nodo.codigo3D += "heap[(int) H] = " + cadena.charCodeAt(i) + ";  //Guardamos en el Heap el caracter: " + cadena.charAt(i)+"\n"
      ;
      nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";

      if (i === 0) {nodo.temporal = new Temporal(temporal);}
    }

    nodo.codigo3D += "heap[(int) H] = 0; //Fin de la cadena \n";
    nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";

    return nodo;
  }
}
