import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo, Localizacion } from "./Tipo";

export class Simbolo{
    identificador:string = "";
    tipo?:Tipo;
    valor?:Object;
    tam:number = 0;
    posRelativa:number = 0;
    posAbsoluta:number = 0;
    atributo?:Object;
    //dimensiones:number;
    //isParam : Boolean;
    //isNull : Boolean;
    localizacion:Localizacion = Localizacion.HEAP;
    instrucciones:Array<Instruccion> = [];
    //entorno:Entorno;
    verdaderas:Array<String> = [];
    falsas:Array<String> = [];
    objeto:String = "";

    constructor()
    constructor(id:string,tam:number,atributo:Object,instrucciones:Array<Instruccion>)
    constructor(id?:string,tam?:number,atributo?:Object,instrucciones?:Array<Instruccion>,localizacion?:Localizacion)
    {
        if(id != undefined && tam != undefined && atributo != undefined && instrucciones != undefined && localizacion != undefined){

        this.identificador = id;
        this.tam = tam;
        this.atributo = atributo;
        this.instrucciones = instrucciones;
        //this.isNull = true;
        this.localizacion = localizacion;
        }
        
    }
}