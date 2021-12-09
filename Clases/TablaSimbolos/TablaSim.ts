import { Simbolos }  from "./Simbolos";

export class TablaSim {

    public ant: TablaSim;
    public tabla: Map<string, Simbolos>;

    constructor(ant: any) {
        this.ant = ant
        this.tabla = new Map<string, Simbolos>();
    }

    agregar(id: string, simbolo : Simbolos){
        this.tabla.set(id.toLowerCase(), simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
    }


    existe(id: string): boolean{
        let ts : TablaSim = this;

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());
           // let existe = ts.tabla.get(id);
            if(existe != null){
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id: string): boolean{
        let ts : TablaSim = this;

        let existe = ts.tabla.get(id.toLowerCase());

        if(existe != null){
            return true;
        }
        return false;
    }

    getSimbolo(id: string){
        let ts : TablaSim = this; 

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());

            if(existe != null){
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
}