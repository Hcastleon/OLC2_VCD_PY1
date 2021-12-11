export class Errores{
    public tipo : string;
    public descripcion : string;
    public linea : number;
    public column: number;

    constructor(tipo : string, descripcion: string,linea: number, column: number){
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.column = column;
    }
}