export enum tipo{
    ENTERO, 
    DOUBLE, 
    BOOLEAN,
    CARACTER,
    CADENA,
    NULO,
    VOID,
    ARRAY,
    MAIN,
    STRUCT,
    ID
}

export enum Ubicacion {
    HEAP,
    STACK
}

export class Tipo{

    public tipo : tipo;
    public stype: string;

    constructor(stype: string){
        this.stype = stype;
        this.tipo = this.getTipo(stype);
    }


    getTipo(stype: string): tipo{
        if(stype == "DECIMAL"){
            return tipo.DOUBLE
        }else if( stype == "ENTERO"){
            return tipo.ENTERO
        }else if( stype == "STRING"){
            return tipo.CADENA
        }else if( stype == "BOOLEAN"){
            return tipo.BOOLEAN
        }else if( stype == "CHAR"){
            return tipo.CARACTER
        }else if( stype == "VOID"){
            return tipo.VOID
        } else if (stype == "ARRAY") {
            return tipo.ARRAY
        } else if (stype == "STRUCT") {
            return tipo.STRUCT
        }
        return tipo.CADENA
    }

    getStype():string{
        return this.stype;
    }

}