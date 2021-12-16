import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Temporales } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";

export class Arreglo implements Expresion {
  public valores: Array<any>;
  // public niveles: Array<Expresion>;
  // public linea: number;
  // public column: number;

  constructor(valores: any) {
    this.valores = valores;
  }

  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let lista_valores: Array<any> = [];
    this.valores.forEach(element => {
      let valor_condicional = element.getValor(controlador, ts, ts_u);
      lista_valores.push(valor_condicional);
    });
    return lista_valores;
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {

  }
  getTipoArreglo(controlador: Controller, ts: TablaSim, ts_u: TablaSim, tipoo: Tipo) {
    let flag = false;
    for (let element of this.valores) {
      let valor_condicional = element.getValor(controlador, ts, ts_u);
      if (typeof valor_condicional == "number") {
        if (this.isInt(Number(valor_condicional))) {
          if (tipoo.tipo != tipo.ENTERO) {
            flag = true;
            break;
          }
        } else {
          if (tipoo.tipo != tipo.DOUBLE) {
            flag = true;
            break;
          }
        }
      } else if (typeof valor_condicional == "string") {
        if (this.isChar(String(valor_condicional))) {
          if (tipoo.tipo != tipo.CARACTER) {
            flag = true;
            break;
          }
        } else {
          if (tipoo.tipo != tipo.CADENA) {
            flag = true;
            break;
          }
        }
      } else if (typeof valor_condicional == "boolean") {
        if (tipoo.tipo != tipo.BOOLEAN) {
          flag = true;
          break;
        }
      } else if (valor_condicional === null) {
        if (tipoo.tipo != tipo.NULO) {
          flag = true;
          break;
        }
      }
    }
    if (flag == false) {
      return tipoo.tipo;
    } else {
      return -1;
    }

  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
      
  }

  recorrer(): Nodo {
    let padre = new Nodo("ID", "");
    return padre
  }
  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/[a-zA-Z]/i);
  }
}
