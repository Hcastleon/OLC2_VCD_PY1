// ------------------- global ---------------------------------------
var TabId = 0;
var ListaTab= [];
var TabActual = null;
let ejecucion = null;
// ------------------- reload ----------------------------------------
function loadPage(){
  let cm = new CodeMirror.fromTextArea(document.getElementById(`textInput-Blank`), {
    lineNumbers: true,
    mode: "javascript",
    theme: "dracula",
    lineWrapping: false,
    matchBrackets: true
  });
  cm.refresh;
  let tab_completo = { editor: cm, tab:`Blank`, pos:-1 };
  ListaTab.push(tab_completo);
  TabActual=tab_completo;
}
document.getElementById("body").onload = function() {loadPage()};
// ------------------- open document ---------------------------------
function openDoc(e){
    let file = document.getElementById("fileDoc");
    if (file) file.click();
}

function changeTabs(info){
  TabActual = ListaTab.find(function (element) {
      return element.tab === info;
  });
  TabActual.editor.refresh;
}

function handleFileDoc(){
    let file = document.getElementById("fileDoc").files[0];
    let fullPath = document.getElementById("fileDoc").value;
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    filename = filename.substring(0,filename.indexOf('\.'));
    let fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        let text = fileLoadedEvent.target.result;
        addTab(filename);
        addContentTab(text,filename);
        TabId++;
    };
    fileReader.readAsText(file, "UTF-8");
}

function addTab(filename){
    let tab = document.getElementById('myTab').innerHTML;
    let aux = tab.replace("active","");
    aux = aux.replace("true","false");
    document.getElementById('myTab').innerHTML= aux +
    `<li class="nav-item" role="presentation">
    <button class="nav-link active" id="${filename}-${TabId}-tab" data-bs-toggle="tab" data-bs-target="#${filename}-${TabId}" type="button" role="tab" aria-controls="${filename}-${TabId}" aria-selected="true" onClick="changeTabs('${filename}-${TabId}')">${filename}-${TabId}</button>
    </li>`
}

function addContentTab(text,filename){
    let tab = document.getElementById('myTabContent').innerHTML;
    let aux = tab.replace("tab-pane fade show active","tab-pane fade");
    document.getElementById('myTabContent').innerHTML= aux +
        `<div class="tab-pane fade show active" id="${filename}-${TabId}" role="tabpanel" aria-labelledby="${filename}-${TabId}-tab">
        <!-- **CONSOLES** -->
        <div class="container">
            <div class="row">
                <div class="col">
                    <div style="margin-top: 20px; margin-left: 0px; margin-right: 0px;">
                        <div class="card">
                            <div class="card-body text-dark bg-light">
                                <!--  **INPUT CONSOLE**  -->
                                <label for="textInput-${filename}-${TabId}" class="form-label">Input:</label>
                                <textarea class="form-control" id="textInput-${filename}-${TabId}" rows="10"></textarea>
                                <!-- **OUTPUT CONSOLE** -->
                                <label for="textOutput-${filename}-${TabId}" class="form-label" style="margin-top: 10px;">Output:</label>
                                <textarea class="form-control" id="textOutput-${filename}-${TabId}" rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="col">
                    <div style="margin-top: 20px; margin-left: 0px; margin-right: 0px;">
                        <div class="card">
                            <div class="card-body text-dark bg-light">
                                <label for="textInput" class="form-label">Errors:</label>
                                <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2">Larry the Bird</td>
                                        <td>@twitter</td>
                                      </tr>
                                    </tbody>
                                </table>
                                <label for="textInput" class="form-label">Symbols:</label>
                                <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2">Larry the Bird</td>
                                        <td>@twitter</td>
                                      </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-primary">AST</button>
                                    <button type="button" class="btn btn-primary">CST</button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
            </div>
        </div>
      </div>`
    let cm = new CodeMirror.fromTextArea(document.getElementById(`textInput-${filename}-${TabId}`), {
      lineNumbers: true,
      mode: "javascript",
      theme: "dracula",
      lineWrapping: false
    });
    cm.getDoc().setValue(text);
    cm.refresh;
    let tab_completo = { editor: cm, tab:`${filename}-${TabId}`, pos:TabId };
    ListaTab.push(tab_completo);
    TabActual=tab_completo;
}
// -------------------------------------- reporteria -----------------------------------------
function graficando_ast_d(contenido){
  var DOTstring = obtener_arbol_ast_(contenido);
  
  var container = document.getElementById('arbol_ast');
  var parsedData = vis.network.convertDot(DOTstring);
  
  var dataDOT = {
       nodes: parsedData.nodes,
       edges: parsedData.edges
       }
       // OPTIONs
   var options = {
   autoResize: true,
   physics:{
   stabilization:false
   },
   layout: {
           hierarchical:{
               levelSeparation: 150,
               nodeSpacing: 150,
               parentCentralization: true,
               direction: 'UD',
               sortMethod: 'directed' 
           },
       }
   };

   var network = new vis.Network(container, dataDOT, options);
  
}


function obtener_arbol_ast_(contenido){
  var grafo = `digraph {
      node [shape=box, fontsize=15]
      edge [length=150, color=#ad85e4, fontcolor=black]
      `+contenido+`}`;
  return grafo;
}


document.getElementById("prueba").onclick = function() {ej()};
document.getElementById("codigo3d").onclick = function() {ej2()};


function ej(){
  ejecucion = ejecutarCodigo(TabActual.editor.getValue());
  document.getElementById(`textOutput-Blank`).value = ejecucion.salida;
  document.getElementById(`tabla_e-Blank`).innerHTML = ejecucion.tabla_e;
  document.getElementById(`tabla_s-Blank`).innerHTML = ejecucion.tabla_s;
  graficando_ast_d(ejecucion.ast);
}

function ej2(){
  document.getElementById(`textOutputTrans-Blank`).innerHTML = ejecucion.tradu;
}


Object.defineProperty(exports, "__esModule", { value: true });
const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const Funcion_1 = require("./Instrucciones/Funcion");
const Declaracion_1 = require("./Instrucciones/Declaracion");
const Asignacion_1 = require("./Instrucciones/Asignacion");
const Struct_1 = require("./Expresiones/Struct");
const Nodo_1 = require("./AST/Nodo");
const Arbol_1 = require("./AST/Arbol");
const Temporales_1 = require("./AST/Temporales");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
  //traigo todas las raices
  const salida = gramatica.parse(entrada);
  const instrucciones = salida.arbol;
  let listaErrores = salida.errores;
  let controlador = new Controller_1.Controller();
  const entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
  let entornoU = new TablaSim_1.TablaSim(null, "Global");
  controlador.errores = listaErrores.slice();
let Temp = new Temporales_1.Temporales();

  const ast = new Ast_1.AST(instrucciones);
  instrucciones.forEach((ins) => {
      if (ins instanceof Funcion_1.Funcion) {
          let funcion = ins;
          funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
      }
    if (ins instanceof Struct_1.Struct) {
      let funcion = ins;
      funcion.agregarSimboloStruct(controlador, entornoGlobal, entornoU);
     // funcion.ejecutar(controlador, entornoGlobal, entornoU);
    }
      if (ins instanceof Declaracion_1.Declaracion || ins instanceof Asignacion_1.Asignacion) {
          ins.ejecutar(controlador, entornoGlobal, entornoU);
      }
  });
  instrucciones.forEach((element) => {
      if (element instanceof Funcion_1.Funcion) {
          let funcion = element;
          if (funcion.getIdentificador() == "main") {
              element.ejecutar(controlador, entornoGlobal, entornoU);
              element.traducir(Temp, controlador, entornoGlobal,entornoU);
          }
          
      }
  });
  let raiz = new Nodo_1.Nodo("Inicio", "");
  instrucciones.forEach((element) => {
      raiz.addHijo(element.recorrer());
  });
  let grafo = new Arbol_1.Arbol();
  let res = grafo.tour(raiz);

  console.log(entornoGlobal);
  console.log(controlador.texto);
  return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0), ast: res, tradu:controlador.texto };
}