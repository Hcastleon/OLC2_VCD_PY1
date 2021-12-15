import { Localizacion } from "../TablaSimbolos/Tipo";

export class NodoT {
  codigo: Array<String> = [];
  resultado: String ="";
  verdaderas: Array<String> = [];
  falsas: Array<String> = [];
  atributos?: Object;
  localizacion: Localizacion = Localizacion.HEAP;
  posicion: String = "";
  saltos: Array<String> = [];
  breaks: Array<String> = [];
  continue: Array<String> = [];
  retornos: Array<String> = [];
  id: String = "";

  constructor();
  constructor(codigo: Array<String>);
  constructor(codigo: Array<String>, resultado: String);
  constructor(codigo?: Array<String>, resultado?: String) {
    // super(tipo,valor);
    if (codigo != undefined && resultado != undefined) {
      this.codigo = codigo;
      this.resultado = resultado;
    }
  }
}
