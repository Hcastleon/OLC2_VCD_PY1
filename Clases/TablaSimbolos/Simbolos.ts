import { Tipo } from './Tipo'

export class Simbolos{

    public simbolo : number ;

    public tipo: Tipo;
    public identificador: string;
    public valor: any;

    public lista_params?: Array<Simbolos>;
    public metodo?: boolean;

    constructor(simbolo : number, tipo : Tipo, identificador : string, valor : any, lista_params?: Array<Simbolos>, metodo?: boolean) {
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor; 
        this.lista_params = lista_params;
        this.metodo = metodo;
    }

    setSimbolo(simbolo: number){
        this.simbolo =  simbolo
    }
    
    getSimbolo(){
        return this.simbolo
    }

    setIdentificador(identificador : string){
        this.identificador = identificador
    }

    getIdentificador(){
        return this.identificador
    }

    setTipo(tipo: Tipo){
        this.tipo = tipo
    }

    getTipo(){
        return this.tipo
    }

    setValor(valor:any){
        this.valor = valor
    }

    getValor(){
        return this.valor
    }


    

}