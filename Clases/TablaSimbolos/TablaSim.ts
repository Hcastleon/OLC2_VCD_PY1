import { Simbolos }  from "./Simbolos";

export class TablaSim {

    public ant: TablaSim;
    public sig: Array<any>;
    public tabla: Map<string, Simbolos>;
    public nombre: string;

    public entorno: number = 0;


    constructor(ant: any, nombre: string) {
        this.ant = ant;
        this.sig = [];
        this.tabla = new Map<string, Simbolos>();
        this.nombre = nombre;
    }

    agregar(id: string, simbolo : Simbolos){
        this.tabla.set(id, simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
     //   this.tabla.set(id.toLowerCase(), simbolo);
    }

    setSiguiente(tablita: TablaSim){
        this.sig.push(tablita);
    }

    existe(id: string): boolean{
        let ts : TablaSim = this;

        while(ts != null){
           // let existe = ts.tabla.get(id.toLowerCase());
           let existe = ts.tabla.get(id);
            if(existe != null){
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id: string): boolean{
        let ts : TablaSim = this;

        //let existe = ts.tabla.get(id.toLowerCase());
        let existe = ts.tabla.get(id);

        if(existe != null){
            return true;
        }
        return false;
    }

    getSimbolo(id: string){
        let ts : TablaSim = this; 

        while(ts != null){
            //let existe = ts.tabla.get(id.toLowerCase());
            let existe = ts.tabla.get(id);

            if(existe != null){
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }

    getEntornoStack(){
        let ts : TablaSim = this; 
        let i: number = 0;
        while(ts != null){
            
            ts.tabla.forEach(element => {
                if(element.simbolo == 1 || element.simbolo == 4){
                i++;
            }
            });

            
            ts = ts.ant;
        }
        return i;
    }

}