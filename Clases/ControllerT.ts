import { Errores } from "./AST/Errores";
import { NodoT } from "./AST/NodoT";

export class ControllerT {
  public temporal: number;
  public posicion: number;
  public etiqueta: number;

  constructor(){
      this.temporal = 0;
      this.posicion = 0;
      this.etiqueta = 0;
  }

  generarTemporal(): String {
    let n: number = this.temporal;
    this.temporal++;
    return "t" + n;
  }

  crearLinea(linea: String, comentario: String): String {
    return linea + "                ;" + comentario;
  }

  generarEtiqueta(): String {
    let i: number = this.etiqueta;
    this.etiqueta++;
    return "L" + i;
  }
/*
   agregarError(error: Errores) {
    Errores(
      error.tipo,
      error.descripcion,
      error.linea,
      error.columna
    );
  }*/

 posicionAbsoluta(): number {
    let i = this.posicion;
    this.posicion++;
    return i;
  }

   saltoCondicional(condicion: String, etiqueta: String): String {
    return "if " + condicion + " then goto " + etiqueta;
  }

   saltoIncondicional(etiqueta: String) {
    return "goto " + etiqueta;
  }

   escribirEtiquetas(etiquetas: Array<String>): NodoT {
    let nodo: NodoT = new NodoT();
    nodo.codigo = [];

    etiquetas.forEach((element) => {
      nodo.codigo.push(element + ":");
    });

    return nodo;
  }
}
