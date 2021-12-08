import { Errores } from "./AST/Errores";
import { Simbolos } from "./TablaSimbolos/Simbolos";
import { TablaSim } from "./TablaSimbolos/TablaSim";

export class Controller {

    public errores: Array<Errores>;
    public consola: string;


    constructor() {
        this.errores = new Array<Errores>();
        this.consola = "";

    }

    public append(aux: string) {
        this.consola += aux 
    }

    


    graficar_ts(controlador: Controller, ts: TablaSim) {
        var cuerpohtml = "<thead><tr><th>Rol</th><th>Nombre</th><th>Tipo</th><th>Ambito</th><th>Valor</th><th>Parametros</th></tr></thead>";

        while (ts != null) {

            for (let sim of ts.tabla.values()) {

                cuerpohtml += "<tr ><th >" + this.getRol(sim) + "</th><td>" + sim.identificador +
                    "</td><td>" + this.getTipo(sim) + "</td>" +
                    "</td><td>" + this.getAmbito() +
                    "</td><td>" + this.getValor(sim) +
                    "</td><td>" + this.parametros(sim) + "</td>" + "</tr>";
            }


            ts = ts.ant;
        }
        cuerpohtml = '<table class=\"ui selectable inverted table\">' + cuerpohtml + '</table>'

        return cuerpohtml;
    }

    graficar_tErrores() {
        var cuerpohtml = "<thead><tr><th>Tipo</th><th>Descripcion</th><th>Linea</th><th>Columna</th></thead>";

        for (let error of this.errores) {

            cuerpohtml += "<tr ><th >" + error.tipo + "</th><td>" + error.descripcion +
                "</td><td>" + error.linea + "</td>" +
                "</td><td>" + error.column +
                "</td> </tr>";
        }

        cuerpohtml = '<table class=\"ui selectable inverted table\">' + cuerpohtml + '</table>'

        return cuerpohtml;
    }

    getValor(sim: Simbolos): string {
        if (sim.valor != null) {
            return sim.valor.toString();
        } else {
            return '...';
        }
    }


    getTipo(sim: Simbolos): string {

        return sim.tipo.stype.toLowerCase();
    }


    getRol(sim: Simbolos): string {
        let rol: string = '';
        switch (sim.simbolo) {
            case 1:
                rol = "variable"
                break
            case 2:
                rol = "funcion";
                break;
            case 3:
                rol = "metodo";
                break;
            case 4:
                rol = "vector";
                break
            case 5:
                rol = "lista";
                break;
            case 6:
                rol = "parametro"
                break;

        }
        return rol;
    }


    getAmbito(): string {
        return 'global'
    }


    parametros(sim: Simbolos) {
        if (sim.lista_params != undefined) {
            return sim.lista_params.length
        } else {
            return "...";
        }
    }
}