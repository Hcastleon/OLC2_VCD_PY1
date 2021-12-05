export class Nodo {

    public token: string;
    public lexema: string;
    public hijos: Array<Nodo>;
    public k = 0;

    constructor(t: string, l: string) {
        this.token = t;
        this.lexema = l;
        this.hijos = new Array<Nodo>();
    }

    public addHijo(nodito: Nodo): void {
        this.hijos.push(nodito);
    }

    public getToken(): string {
        return this.token
    }


}