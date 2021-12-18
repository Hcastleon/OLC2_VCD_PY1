"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
const Tipo_1 = require("./Tipo");
class Simbolo {
    constructor(id, tam, atributo, instrucciones, localizacion) {
        this.identificador = "";
        this.tam = 0;
        this.posRelativa = 0;
        this.posAbsoluta = 0;
        //dimensiones:number;
        //isParam : Boolean;
        //isNull : Boolean;
        this.localizacion = Tipo_1.Ubicacion.HEAP;
        this.instrucciones = [];
        //entorno:Entorno;
        this.verdaderas = [];
        this.falsas = [];
        this.objeto = "";
        if (id != undefined && tam != undefined && atributo != undefined && instrucciones != undefined && localizacion != undefined) {
            this.identificador = id;
            this.tam = tam;
            this.atributo = atributo;
            this.instrucciones = instrucciones;
            //this.isNull = true;
            this.localizacion = localizacion;
        }
    }
}
exports.Simbolo = Simbolo;
