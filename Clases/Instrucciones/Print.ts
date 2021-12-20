import { Nodo } from "../AST/Nodo";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Temporales, Temporal, Resultado3D } from "../AST/Temporales";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";
import { Simbolos } from "../TablaSimbolos/Simbolos";

export class Print implements Instruccion {
  public lista_exp: Array<Expresion>;
  public linea: number;
  public columna: number;

  constructor(expresion: any, linea: any, columna: any) {
    this.lista_exp = expresion;
    this.linea = linea;
    this.columna = columna;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    for (let expres of this.lista_exp) {
      let result = expres.getValor(controlador, ts, ts_u);
      if (result != null) {
        if(typeof result === "string"){
          let nuevo_string = this.trae_algo(result,ts) ;
          if(nuevo_string != null){
            result = nuevo_string;
          }
        }
        controlador.append(result);
      }
    }
    return null;
  }
  recorrer(): Nodo {
    let padre = new Nodo("Print", "");
    this.lista_exp.forEach((element) => {
      padre.addHijo(element.recorrer());
    });
    return padre;
  }

  trae_algo(contiene:string,ts: TablaSim){
    let nueva_salida =contiene;
    let condicion= /[.+]?\$(?:\(([^\n\r]+)\)|([^\)\n\r\s]+))/gm
    if(condicion.test(contiene)){
      let lista =  contiene.match(condicion);
      if(lista){
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          if(element.length <= 2){
            let salida = element.replace('$','');
            let sim = ts.getSimbolo(salida);
            let valor = sim?.getValor();
            nueva_salida = nueva_salida.replace(element ,valor);
          }else{
            let salida = element.replace('$(','');
            salida =salida.substring(0,salida.length-1);
            if(salida.includes("[")){
              let vari = salida.substring(0,salida.indexOf("["));
              let posi = salida.substring(salida.indexOf("[")+1,salida.indexOf("]"));
              let sim = ts.getSimbolo(vari);
              let valor = sim?.getValor()[Number(posi)];
              nueva_salida = nueva_salida.replace(element ,valor);
            }else{
              let sim = ts.getSimbolo(salida);
              let valor = sim?.getValor();
              nueva_salida = nueva_salida.replace(element ,valor);
            }
          }
        }
      }
      return nueva_salida;
    }else{
      return null;
    }
  }
  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {

    let salida = new Resultado3D();

    for (let expres of this.lista_exp) {
      let exp_3D: Resultado3D = expres.traducir(Temp, controlador, ts, ts_u);

      console.log(exp_3D);
      //IDENTIFICADOR------------------------------------------------------------------------------------------
      if (exp_3D instanceof Simbolos) {
        if (exp_3D.tipo.stype == "ENTERO") {
          if (ts.nombre != "Global") {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
            salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            salida.codigo3D += "\n" + 'printf("%d", (int)' + temp2 + ");";
            // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
          } else {
            let temp = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
            // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
            salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
          }
        } else if (exp_3D.tipo.stype == "DECIMAL") {
          if (ts.nombre != "Global") {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
            salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            salida.codigo3D += "\n" + 'printf("%f", (double)' + temp2 + ");";
            // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
          } else {
            let temp = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
            // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
            salida.codigo3D += "\n" + 'printf("%f", (double)' + temp + ");";
          }
        } else if (exp_3D.tipo.stype == "CHAR") {
          if (ts.nombre != "Global") {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
            salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
            // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
          } else {
            let temp = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
            // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
            salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
          }
        } else if (exp_3D.tipo.stype == "STRING") {
          if (ts.nombre != "Global") {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
            salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            //----------------
            // salida.codigo3D += "\n" + exp_3D.codigo3D;
            let posicion: string = Temp.temporal();
            let valor: string = Temp.temporal();
            let v: string = Temp.etiqueta();
            let f: string = Temp.etiqueta();

            salida.codigo3D +=
              posicion + " = " + temp2 + "; //Posicion de inicio de la cadena\n";
            salida.codigo3D += f + ":";
            salida.codigo3D +=
              valor + " = heap[(int)" + posicion + "];\n";
            salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
            salida.codigo3D +=
              posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
            salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
            salida.codigo3D += Temp.saltoIncondicional(f);
            salida.codigo3D += v + ":";
            //------------
            //salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
            // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
          } else {
            let temp = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
            // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
            salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
          }
        } else if (exp_3D.tipo.stype == "BOOLEAN") {
          if (ts.nombre != "Global") {
            let temp = Temp.temporal();
            let temp2 = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
            salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
            //---
            let verdadera: string = Temp.etiqueta();
            let salto: string = Temp.etiqueta();
            if (exp_3D.valor == true) {
              salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 1)", verdadera);
            } else {
              salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 0)", verdadera);
            }
            salida.codigo3D +=
              'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.codigo3D += verdadera + ":";
            salida.codigo3D +=
              'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
            salida.codigo3D += salto + ":";
            // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
          } else {
            let temp = Temp.temporal();
            salida.tipo = tipo.ID;
            salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
            // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
            salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
          }
        }
        return salida;
      }

      // EXPRESIOMES--------------------------------------------------------------------------------------
      //
      if (exp_3D.tipo == tipo.ENTERO) {
        salida.codigo3D += "\n" + exp_3D.codigo3D;
        salida.codigo3D += "\n" + 'printf("%d", (int)' + exp_3D.temporal.nombre + ");";

      } else if (exp_3D.tipo == tipo.DOUBLE) {
        salida.codigo3D += "\n" + exp_3D.codigo3D;
        salida.codigo3D += "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";

      } else if (exp_3D.tipo == tipo.CARACTER) {
        salida.codigo3D += "\n" + exp_3D.codigo3D;
        salida.codigo3D += "\n" + 'printf("%c", (char)' + exp_3D.temporal.nombre + "); // Se imprime char";

      } else if (exp_3D.tipo == tipo.CADENA) {
        salida.codigo3D += "\n" + exp_3D.codigo3D;
        let posicion: string = Temp.temporal();
        let valor: string = Temp.temporal();
        let v: string = Temp.etiqueta();
        let f: string = Temp.etiqueta();

        salida.codigo3D +=
          posicion + " = " + exp_3D.temporal.nombre + "; //Posicion de inicio de la cadena\n";
        salida.codigo3D += f + ":";
        salida.codigo3D +=
          valor + " = heap[(int)" + posicion + "];\n";
        salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
        salida.codigo3D +=
          posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
        salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
        salida.codigo3D += Temp.saltoIncondicional(f);
        salida.codigo3D += v + ":";

      } else if (exp_3D.tipo == tipo.BOOLEAN) {
        controlador.appendT("\n" + exp_3D.codigo3D);
        if (exp_3D.etiquetasV.length == 0) {
          let verdadera: string = Temp.etiqueta();
          let salto: string = Temp.etiqueta();
          salida.codigo3D += Temp.saltoCondicional("(" + exp_3D.temporal.nombre + " == 0)", verdadera);
          salida.codigo3D +=
            'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
          salida.codigo3D += Temp.saltoIncondicional(salto);
          salida.codigo3D += verdadera + ":";
          salida.codigo3D +=
            'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
          salida.codigo3D += salto + ":";

        } else {
          let salto: string = Temp.etiqueta();
          salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasV);
          salida.codigo3D +=
            'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
          salida.codigo3D += Temp.saltoIncondicional(salto);
          salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasF);
          salida.codigo3D +=
            'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
          salida.codigo3D += salto + ":";

        }
      }
    }
    return salida;
  }
}
