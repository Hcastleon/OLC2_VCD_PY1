import { tipo } from "../TablaSimbolos/Tipo";

export class Temporal {
  public nombre: string;
  public utilizado: boolean;

  constructor(nombre: string) {
    this.nombre = nombre;
    this.utilizado = false;
  }

  obtener() {
    return this.nombre;
  }

  utilizar() {
    this.utilizado = true;
    return this.nombre;
  }
}

export class Resultado3D {
  public codigo3D: string;
  public temporal: any;
  public tipo: tipo;

  constructor() {
    this.codigo3D = "";
    this.temporal = null;
    this.tipo = tipo.NULO;
  }
}

export class Temporales {
  public lista_temporales: Array<Temporal> = [];
  public contador_temporales: number = 0;
  public contador_parametro: number = 0;
  public contador_etiquetas: number = 0;

  nuevoTemporal() {
    let temp = new Temporal(this.temporal());
    this.lista_temporales.push(temp);
    return temp;
  }

  temporal() {
    this.contador_temporales = this.contador_temporales + 1;
    return "$t" + this.contador_temporales;
  }

  parametro() {
    this.contador_parametro = this.contador_parametro + 1;
    return "$a" + this.contador_parametro;
  }

  etiqueta() {
    this.contador_etiquetas = this.contador_etiquetas + 1;
    return "L" + this.contador_etiquetas;
  }
}
