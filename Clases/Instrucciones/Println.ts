import { Nodo } from "../AST/Nodo";
import { Temporales, Resultado3D } from "../AST/Temporales";
import { Controller } from "../Controller";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSim } from "../TablaSimbolos/TablaSim";
import { Tipo, tipo } from "../TablaSimbolos/Tipo";

export class Println implements Instruccion {
  public expresion: Expresion;
  public linea: number;
  public columna: number;

  constructor(expresion: any, linea: any, columna: any) {
    this.expresion = expresion;
    this.linea = linea;
    this.columna = columna;
  }

  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valor = this.expresion.getValor(controlador, ts, ts_u);
    controlador.append(valor + "\n");

    return null;
  }
  recorrer(): Nodo {
    let padre = new Nodo("PrintLn", "");
    // padre.addHijo(new Nodo("int",""));
    // padre.addHijo(new Nodo("(",""));

    //let hijo =  new Nodo("exp","");
    padre.addHijo(this.expresion.recorrer());
    // padre.addHijo(hijo);
    //padre.addHijo(new Nodo(")",""));
    return padre;
  }

  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
    let valorfinal = 'print("';
    let salida = new Resultado3D();
    // cadena = cadena.temporal.utilizar();
    //cadena = cadena[1:-1];

    let exp_3D: Resultado3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
    if (exp_3D == undefined) {
      return;
    }
    console.log(exp_3D);
    if (this.expresion.getTipo(controlador, ts, ts_u) == tipo.ENTERO) {
      salida.codigo3D += "\n" + exp_3D.codigo3D;
      salida.codigo3D += "\n" + 'printf("%d", (int)' + exp_3D.temporal.nombre + ");";
    } else if (this.expresion.getTipo(controlador, ts, ts_u) == tipo.DOUBLE) {
      salida.codigo3D += "\n" + exp_3D.codigo3D;
      salida.codigo3D += "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";
    } else if (this.expresion.getTipo(controlador, ts, ts_u) == tipo.CADENA) {
      salida.codigo3D += "\n" + exp_3D.codigo3D;
      let posicion: string = Temp.temporal();
      let valor: string = Temp.temporal();
      let v: string = Temp.etiqueta();
      let f: string = Temp.etiqueta();

      salida.codigo3D += Temp.crearLinea(
        posicion + " = " + exp_3D.temporal.nombre,
        "Posicion de inicio de la cadena"
      );
      salida.codigo3D += f + ":";
      salida.codigo3D += Temp.crearLinea(
        valor + " = Heap[  (int)" + posicion + "]",
        "Primer caracter de la cadena"
      );
      (salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v)),
        "Si esta vacio no imprimimos nada";
      salida.codigo3D += Temp.crearLinea(
        posicion + " = " + posicion + " + 1",
        "Aumento de la posicion"
      );
      salida.codigo3D += Temp.crearLinea(
        'printf( "%c", (char)' + valor + ")",
        "Se imprime el caracter"
      );
      salida.codigo3D += Temp.saltoIncondicional(f);
      salida.codigo3D += v + ":";
    } else if (exp_3D.tipo == tipo.BOOLEAN) {
      console.log(exp_3D.etiquetasV.length + "LAROG DE VERDADERs");
      controlador.appendT("\n" + exp_3D.codigo3D);
      if (exp_3D.etiquetasV.length == 0) {
        let verdadera: string = Temp.etiqueta();
        let salto: string = Temp.etiqueta();
        salida.codigo3D += Temp.crearLinea(
          Temp.saltoCondicional("(" + exp_3D.temporal.nombre + "== 0)", verdadera),
          "Si es un false"
        );
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
    salida.codigo3D += '\n printf("%c", (char)10); \n';

    return salida;
  }
}
