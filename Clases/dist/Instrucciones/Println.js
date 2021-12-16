"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Println = void 0;
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Println {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor = this.expresion.getValor(controlador, ts, ts_u);
        controlador.append(valor + "\n");
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("PrintLn", "");
        // padre.addHijo(new Nodo("int",""));
        // padre.addHijo(new Nodo("(",""));
        //let hijo =  new Nodo("exp","");
        padre.addHijo(this.expresion.recorrer());
        // padre.addHijo(hijo);
        //padre.addHijo(new Nodo(")",""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let valorfinal = 'print("';
        let salida = new Temporales_1.Resultado3D();
        // cadena = cadena.temporal.utilizar();
        //cadena = cadena[1:-1];
        let exp_3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        console.log(exp_3D);
        if (exp_3D.tipo == Tipo_1.tipo.ENTERO || exp_3D.tipo == Tipo_1.tipo.DOUBLE) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D +=
                "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.BOOLEAN) {
            console.log(exp_3D.etiquetasV.length + "LAROG DE VERDADERs");
            controlador.appendT("\n" + exp_3D.codigo3D);
            if (exp_3D.etiquetasV.length == 0) {
                let verdadera = Temp.etiqueta();
                let salto = Temp.etiqueta();
                salida.codigo3D += Temp.crearLinea(Temp.saltoCondicional("(" + exp_3D.temporal.nombre + "== 0)", verdadera), "Si es un false");
                salida.codigo3D +=
                    'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                salida.codigo3D += Temp.saltoIncondicional(salto);
                salida.codigo3D += verdadera + ":";
                salida.codigo3D +=
                    'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                salida.codigo3D += salto + ":";
            }
            else {
                let salto = Temp.etiqueta();
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
        salida.codigo3D += '\n printf("%c", (char)10);';
        controlador.appendT("\n" + salida.codigo3D);
    }
}
exports.Println = Println;
