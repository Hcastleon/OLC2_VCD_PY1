import { Errores } from "./AST/Errores";
import { Temporales } from "./AST/Temporales";
import { Simbolos } from "./TablaSimbolos/Simbolos";
import { TablaSim } from "./TablaSimbolos/TablaSim";

export class Controller {
  public errores: Array<Errores>;
  public consola: string;
  public texto: string;
  public graficarTS: Array<TablaSim>;

  constructor() {
    this.errores = new Array<Errores>();
    this.consola = "";
    this.texto = "";
    this.graficarTS = new Array<TablaSim>();
  }

  public append(aux: string) {
    this.consola += aux;
  }

   public appendT(aux: string) {
    this.texto += aux;
  }

  recursivo_tablita(entornito: TablaSim, cuerpotabla: string, contador: number) {
       
        let auxS = cuerpotabla;
        let auxC = contador;
        for (let sim of entornito.tabla.values()) {
        auxC += 1;
        auxS += `<tr>
                                <th scope="row">${auxC}</th>
                                <td>${this.getRol(sim)}</td>
                                <td>${this.getNombre(sim)}</td>
                                <td>${this.getTipo(sim)}</td>
                                <td>${entornito.nombre}</td>
                                <td>${this.getValor(sim)}</td>
                                <td>${this.parametros(sim)}</td>
                            </tr>`;
        }

        if (entornito.sig.length > 0) {
            entornito.sig.forEach((element) => {
                auxS = this.recursivo_tablita(element, auxS,auxC);
            });
          }
        return auxS;
  }

      graficar_ts() {
        let cuerpohtml = "";

        this.graficarTS.forEach(element => {
          
             cuerpohtml += `
          <tr>
          <th>#</th>
          <th>Rol</th>
          <th>Name</th>
          <th>Type</th>
          <th>Scope</th>
          <th>Value</th>
          <th>No. Parametros</th>
          </tr>
        `;

        while (element != null) {
            for (let sim of element.tabla.values()) {
                cuerpohtml += `<tr>
                                <th scope="row">${0}</th>
                                <td>${this.getRol(sim)}</td>
                                <td>${this.getNombre(sim)}</td>
                                <td>${this.getTipo(sim)}</td>
                                <td>${element.nombre}</td>
                                <td>${this.getValor(sim)}</td>
                                <td>${this.parametros(sim)}</td>
                            </tr>`;
            }
            element = element.ant;
        }
          
        });

        
        
        return cuerpohtml;
    }

  graficar_tErrores() {
    var cuerpotabla = "";
    var contador = 0;
    for (let error of this.errores) {
      contador += 1;
      cuerpotabla += `<tr>
                            <th scope="row">${contador}</th>
                            <td>${error.tipo}</td>
                            <td>${error.linea}</td>
                            <td>${error.column}</td>
                            <td>${error.descripcion}</td>
                           </tr>`;
    }

    return cuerpotabla;
  }

  traductor_texto(temp: Temporales) {
    var cuerpotabla = `/*------HEADER------*/\n#include <stdio.h>\n#include <math.h>\n\ndouble heap[30101999];\ndouble stack[30101999];\ndouble P;\ndouble H;\n`;
    cuerpotabla += 'double ';
    for (var _i = 0; _i < temp.contador_temporales+1; _i++) {
      if(temp.contador_temporales == _i){
        cuerpotabla += `t${_i};`;
      }else{
        cuerpotabla += `t${_i}, `;
      }

    }
    cuerpotabla +='\n';
    //cuerpotabla += para las funciones si es que llegan a existir :(
    //MAIN
    cuerpotabla+='/*------MAIN------*/\nvoid main() {\n\tP = 0; H = 0;\n';
    cuerpotabla+='\t'+this.texto;
    cuerpotabla+='\treturn;\n}\n';
    return cuerpotabla;
  }

  getValor(sim: Simbolos): string {
    if (sim.valor != null) {
      return sim.valor.toString();
    } else {
      return "...";
    }
  }

  getTipo(sim: Simbolos): string {
    return sim.tipo.stype.toLowerCase();
  }

  getRol(sim: Simbolos): string {
    let rol: string = "";
    switch (sim.simbolo) {
      case 1:
        rol = "variable";
        break;
      case 2:
        rol = "funcion";
        break;
      case 3:
        rol = "metodo";
        break;
      case 4:
        rol = "vector";
        break;
      case 5:
        rol = "lista";
        break;
      case 6:
        rol = "parametro";
        break;
    }
    return rol;
  }

  getNombre(sim: Simbolos): string {
    return sim.getIdentificador().toLowerCase();
  }

  getAmbito(): string {
    return "global";
  }

  parametros(sim: Simbolos) {
    if (sim.lista_params != undefined) {
      return sim.lista_params.length;
    } else {
      return "...";
    }
  }

}
