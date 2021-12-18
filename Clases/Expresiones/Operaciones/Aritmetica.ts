import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operacion, Operador } from "./Operaciones";
import { Temporales,Temporal,Resultado3D } from "../../AST/Temporales";

export class Aritmetica extends Operacion implements Expresion {
  constructor(
    expre1: any,
    expre2: any,
    expreU: any,
    operador: any,
    linea: any,
    column: any
  ) {
    super(expre1, expre2, expreU, operador, linea, column);
  }

  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor = this.getValor(controlador, ts, ts_u);

    if (typeof valor == "number") {
      if (this.isInt(Number(valor))) {
        return tipo.ENTERO;
      }
      return tipo.DOUBLE;
    } else if (typeof valor == "string") {
      if (this.isChar(String(valor))) {
        return tipo.CARACTER;
      }
      return tipo.CADENA;
    } else if (typeof valor == "boolean") {
      return tipo.BOOLEAN;
    } else if (valor === null) {
      return tipo.NULO;
    }
  }

  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor_expre1;
    let valor_expre2;
    let valor_U;

    if (this.expreU === false) {
      valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
      valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
    } else {
      valor_U = this.expre1.getValor(controlador, ts, ts_u);
    }

    switch (this.operador) {
      case Operador.SUMA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 + valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 + valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) + valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) + valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.RESTA:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 - valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 - valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) - valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) - valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.MULT:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 * valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 * valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) * valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) * valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.DIV:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 / valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 / valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) / valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) / valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.MODULO:
        if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "number") {
            return valor_expre1 % valor_expre2;
          } else if (typeof valor_expre2 === "string") {
            if (this.isChar(String(valor_expre2))) {
              return valor_expre1 % valor_expre2.charCodeAt(0);
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "string") {
          if (this.isChar(String(valor_expre1))) {
            if (typeof valor_expre2 === "number") {
              return valor_expre1.charCodeAt(0) % valor_expre2;
            } else if (typeof valor_expre2 === "string") {
              if (this.isChar(String(valor_expre2))) {
                return valor_expre1.charCodeAt(0) % valor_expre2.charCodeAt(0);
              } else {
                let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                controlador.errores.push(error);
              }
            } else {
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          } else {
            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else {
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.UNARIO:
        if (typeof valor_U === "number") {
          return -valor_U;
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.CONCATENAR:
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1 + valor_expre2;
          } else if (typeof valor_expre2 === "number") {
            return valor_expre1 + valor_expre2.toString();
          } else if (typeof valor_expre2 === "boolean") {
            return valor_expre1 + valor_expre2.toString();
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "number") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1.toString() + valor_expre2;
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        } else if (typeof valor_expre1 === "boolean") {
          if (typeof valor_expre2 === "string") {
            return valor_expre1.toString() + valor_expre2;
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      case Operador.REPETIR:
        if (typeof valor_expre1 === "string") {
          if (typeof valor_expre2 === "number") {
            if (this.isInt(Number(valor_expre2))) {
              var sum_concat = "";
              for (var _i = 0; _i < valor_expre2; _i++) {
                sum_concat = sum_concat + valor_expre1;
              }
              return sum_concat;
            }else{
              let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
              controlador.errores.push(error);
            }
          }else{
            let error = new Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
            controlador.errores.push(error);
          }
        }else{
          let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
          controlador.errores.push(error);
        }
        break;
      default:
        break;
    }
  }

  validarLados(recursivo:number,controlador: Controller, ts: TablaSim, ts_u: TablaSim){
    if(recursivo ==0 && this.expre1.getTipo(controlador, ts, ts_u) == tipo.ENTERO ){
      return true
    }
    return false
  }

  generarOperacionBinario(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim, signo:any, recursivo: any){
    let valor1;
    let valor2;
    let valor_U;
    if (this.expreU === false) {
      valor1 = this.expre1.traducir(Temp,controlador,ts,ts_u);
      valor2 = this.expre2.traducir(Temp,controlador,ts,ts_u);
    } else {
      valor1 = new Resultado3D();
      valor1.codigo3D="";
      valor1.temporal = new Temporal("0");
      valor1.tipo = tipo.ENTERO;
      valor2 = this.expre1.traducir(Temp,controlador,ts,ts_u);
    }

    if(valor1 == (null || undefined) || valor2 == (null || undefined)) return null

    let resultado = valor1.codigo3D;
    if(resultado != "" && valor2.codigo3D){
        resultado = resultado + "\n" + valor2.codigo3D;
    }else{
      resultado += valor2.codigo3D;
    }

    if(resultado !=""){
      resultado = resultado + "\n";
    }

    let result = new Resultado3D();
    result.tipo = tipo.DOUBLE
    /*if(recursivo==0){
      let temporal = new Temporal(valor1.temporal.utilizar() + " "+ signo+ " "+valor2.temporal.utilizar());
      result.codigo3D = resultado;
      result.temporal = temporal;
      return result;
    }*/
    let temporal = Temp.nuevoTemporal();
    let op;
    if(signo == "%"){
     op = temporal.obtener() + '= fmod(' + valor1.temporal.utilizar()+","+valor2.temporal.utilizar()+");";
    }else{
       op = temporal.obtener() + '=' + valor1.temporal.utilizar()+" "+ signo+" "+valor2.temporal.utilizar()+";";
    }
    
      resultado += op
      result.codigo3D = resultado;
      result.temporal = temporal;
      return result;

  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
      if(this.operador == Operador.SUMA){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"+",0);
      }else if(this.operador == Operador.RESTA){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"-",0);
      }else if(this.operador == Operador.MULT){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"*",0);
      }else if(this.operador == Operador.DIV){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"/",0);
      }else if(this.operador == Operador.MODULO){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"%",0);
      }else if(this.operador == Operador.UNARIO){
        return this.generarOperacionBinario(Temp, controlador,ts,ts_u,"-",0);
      }
      //modulo unario concatenar0  repetir
      return "Holiwis"
  }



  recorrer(): Nodo {
    let padre = new Nodo(this.op_string, "");

    if (this.expreU) {
     // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre1.recorrer());
    } else {
      padre.addHijo(this.expre1.recorrer());
     // padre.addHijo(new Nodo(this.op_string, ""));
      padre.addHijo(this.expre2.recorrer());
    }

    return padre;
  }

  isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  isChar(n: string) {
    return n.length === 1 && n.match(/./i);
  }
}
