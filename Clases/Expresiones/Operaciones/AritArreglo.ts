import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controller } from "../../Controller";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSim } from "../../TablaSimbolos/TablaSim";
import { Identificador } from "../Identificador";
import { Tipo, tipo } from "../../TablaSimbolos/Tipo";
import { Temporales } from "../../AST/Temporales";

export class AritArreglo implements Expresion {
    public identificador: Identificador;
    public posicion1: Expresion;
    public posicion2: boolean;
    public operador: string;
    public linea: number;
    public column: number;

    constructor(identificador: any, posicion1: any, posicion2: any, operador: any, linea: number, column: number) {
        this.identificador = identificador;
        this.posicion1 = posicion1;
        this.posicion2 = posicion2;
        this.operador = operador;
        this.linea = linea;
        this.column = column;
    }

    getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }

    getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim) {
        let valor_expre1;
        let valor_U;

        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            if (id_exists?.tipo.tipo != tipo.ARRAY) {
                let error = new Errores('Semantico', `La variable ${this.identificador.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error)
            } else {
                valor_U = id_exists.getValor();
            }
        }

        if (this.posicion2 === false) {
            valor_expre1 = this.posicion1.getValor(controlador, ts, ts_u);
        }

        switch (this.operador) {
            case '+':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] + valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) + valor_expre1);
                            }
                            return lista_valores;
                        } else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores: Array<any> = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) + valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            } else {
                                let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '-':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] - valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] - valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) - valor_expre1);
                            }
                            return lista_valores;
                        } else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores: Array<any> = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) - valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            } else {
                                let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '*':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] * valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] * valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) * valor_expre1);
                            }
                            return lista_valores;
                        } else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores: Array<any> = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) * valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            } else {
                                let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '/':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] / valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] / valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) / valor_expre1);
                            }
                            return lista_valores;
                        } else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores: Array<any> = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) / valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            } else {
                                let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '%':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] % valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] % valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) % valor_expre1);
                            }
                            return lista_valores;
                        } else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores: Array<any> = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) % valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            } else {
                                let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case 'oparr':
                let lista_valores: Array<any> = [];
                return lista_valores = valor_U.slice();
                break;
            case '&':
                if (typeof valor_U[0] === "string") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1);
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "number") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1.toString());
                        }
                        return lista_valores;
                    } else if (typeof valor_expre1 === "boolean") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1.toString());
                        }
                        return lista_valores;
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index].toString() + valor_expre1);
                        }
                        return lista_valores;
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else if (typeof valor_U[0] === "boolean") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores: Array<any> = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index].toString() + valor_expre1);
                        }
                        return lista_valores;
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '^':
                if (typeof valor_U[0] === "string") {
                    if (typeof valor_expre1 === "number") {
                        if (this.isInt(Number(valor_expre1))) {
                            let lista_valores: Array<any> = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                var sum_concat = "";
                                for (var _i = 0; _i < valor_expre1; _i++) {
                                    sum_concat = sum_concat + valor_U[index];
                                }
                                lista_valores.push(sum_concat);
                            }
                            return lista_valores;
                        } else {
                            let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    } else {
                        let error = new Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                } else {
                    let error = new Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }

    recorrer(): Nodo {
        let padre = new Nodo(this.operador, "");

        if (this.posicion2) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.identificador.recorrer());
        } else {
            padre.addHijo(this.identificador.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.posicion1.recorrer());
        }

        return padre;
    }

    traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u:TablaSim) {
        
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    isChar(n: string) {
        return n.length === 1 && n.match(/./i);
    }
}
