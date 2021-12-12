"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbol = void 0;
class Arbol {
    constructor() {
        this.id_n = 1;
    }
    tour(node) {
        var concat = '';
        if (node.id == 0) {
            node.id = this.id_n;
            this.id_n++;
        }
        if (node.token.includes('"')) {
            var aux = node.lexema.replace(/"/gi, '');
            concat += node.id + '[label="' + aux + '" fillcolor="#ad85e4" shape="box"];\n';
        }
        else {
            concat += node.id + '[label="' + node.token + '" fillcolor="#ad85e4" shape="box"];\n';
        }
        node.hijos.forEach(element => {
            concat += node.id + '->' + this.id_n + ';\n';
            concat += this.tour(element);
        });
        return concat;
    }
}
exports.Arbol = Arbol;
