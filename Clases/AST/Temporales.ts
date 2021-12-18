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

  public etiquetasV: Array<string> = [];
  public etiquetasF: Array<string> = [];

  public saltos: Array<string> = [];
  public breaks: Array<string> = [];

  constructor() {
    this.codigo3D = "";
    this.temporal = null;
    this.tipo = tipo.NULO;
  }
}

export class Temporales {
  public lista_temporales: Array<Temporal> = [];
  public contador_temporales: number = -1;
  public contador_parametro: number = -1;
  public contador_etiquetas: number = -1;
  public etiquetaV: string = "";
  public etiquetaF: string = "";

  public etiquetasV: Array<string> = [];
  public etiquetasF: Array<string> = [];

  public pointersG: number = 0;



  nuevoTemporal() {
    let temp = new Temporal(this.temporal());
    this.lista_temporales.push(temp);
    return temp;
  }

  temporal() {
    this.contador_temporales = this.contador_temporales + 1;
    return "t" + this.contador_temporales;
  }

  parametro() {
    this.contador_parametro = this.contador_parametro + 1;
    return "a" + this.contador_parametro;
  }

  etiqueta() {
    this.contador_etiquetas = this.contador_etiquetas + 1;
    return "L" + this.contador_etiquetas;
  }

  escribirEtiquetas(etiquetas: Array<String>): string {
    let res: string = "";

    etiquetas.forEach((element) => {
      res += element + ":";
    });

    return res + "\n";
  }

  ultimaEtiqueta() {
    return "L" + this.contador_etiquetas;
  }

  saltoCondicional(condicion: string, etiqueta: string): string {
    return "if " + condicion + " goto " + etiqueta + ";\n";
  }

  saltoIncondicional(etiqueta: string) {
    return "goto " + etiqueta + ";\n";
  }

   ultimoTemporal() {
    return "t" + this.contador_temporales;
  }
 
}
