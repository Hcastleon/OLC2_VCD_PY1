/*
    LEXICO
*/
%{
    let listaErrores =[];
    let listaRGramar =[];
%}
%lex
%options case-sensitive
%%
[ \r\t\n]+                                      {} // ESPACIOS
\/\/.([^\n])*                                   {} // COMENTARIO SIMPLE
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]             {} // COMENTARIO MULTILINEA
[0-9]+("."[0-9]+)                               return 'decimal'       // NUMERICO
[0-9]+                                          return 'entero'


"||"                                            return 'or'        //RELACIONAL
"&&"                                            return 'and'


"++"                                            return 'incremento'
"--"                                            return 'decremento'
"&"                                             return 'concat'
"^"                                             return 'repit'

"+"                                             return 'mas'           //ARITEMETICO
"-"                                             return 'menos'
"*"                                             return 'multiplicacion'
"/"                                             return 'division'
"%"                                             return 'modulo'


"<="                                            return 'menorigual'   // LOGICO
">="                                            return 'mayorigual'
"!="                                            return 'diferente'
"=="                                            return 'igualigual'
">"                                             return 'mayor'
"<"                                             return 'menor'

"!"                                             return 'negacion'

"?"                                             return 'ternario'   //TERNARIO
":"                                             return 'dspuntos'
"."                                             return 'punto'


"{"                                             return 'llaveizq'   //GRAMATICO
"}"                                             return 'llavedec'
"("                                             return 'parizq'
")"                                             return 'pardec'
"["                                             return 'corizq'
"]"                                             return 'cordec'
";"                                             return 'ptcoma'
","                                             return 'coma'
"="                                             return 'igual'
"#"                                             return 'oparr'


[\'\‘\’].[\'\’\‘]                               { yytext = yytext.substr(1,yyleng-2); return 'caracter'; }
[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”]       { yytext = yytext.substr(1,yyleng-2); return 'cadena'; }

"string"                                        return 'tostring'

"int"                                           return 'int'      //TIPOS
"double"                                        return 'double'
"char"                                          return 'char'
"boolean"                                       return 'boolean'
"String"                                        return 'string'
"true"                                          return 'true'
"false"                                         return 'false'

"pow"                                           return 'pow'     //NATIVAS
"sin"                                           return 'sin'
"cos"                                           return 'cos'
"tan"                                           return 'tan'
"sqrt"                                          return 'sqrt'
"log10"                                         return 'log'

"print"                                         return 'print'
"println"                                       return 'println'

"parse"                                         return 'parse'
"toInt"                                         return 'toint'
"toDouble"                                      return 'todouble'
"typeof"                                        return 'typeof'

"if"                                            return 'if'
"else"                                          return 'else'

"switch"                                        return 'switch'
"case"                                          return 'case'
"default"                                       return 'default'

"break"                                         return 'break'
"continue"                                      return 'continue'
"begin"                                         return 'begin'
"end"                                           return 'end'

"while"                                         return 'while'
"do"                                            return 'do'
"for"                                           return 'for'
"in"                                            return 'in'

"push"                                          return 'push'
"pop"                                           return 'pop'

"length"                                        return 'length'
"subString"                                     return 'substring'
"caracterOfPosition"                            return 'caracterposition'


"void"                                          return 'void'
"return"                                        return 'return'
"main"                                          return 'main'

"null"                                          return 'null'
"struct"                                        return 'struct'

"toUppercase"                                   return 'touppercase'
"toLowercase"                                   return 'tolowercase'

[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*                  return 'id'
<<EOF>>                                         return 'EOF'
.                                               { listaErrores.push( new Errores('Lexico', `El caracter no portenece al lenguaje ${yytext}`,  yylloc.first_line, yylloc.first_column)); }//ERRORES LEXICOS
/lex

//SECCION DE IMPORTS
%{
    const {Primitivo} = require("../Expresiones/Primitivo");
    const {Print} = require("../Instrucciones/Print");
    const {Println} = require("../Instrucciones/Println");
    const {Aritmetica} = require("../Expresiones/Operaciones/Aritmetica");
    const {AritArreglo} = require("../Expresiones/Operaciones/AritArreglo");
    const {Nativa} = require("../Expresiones/Operaciones/Nativa");
    const {Conversion} = require("../Expresiones/Operaciones/Conversion");
    const {Cadenas} = require("../Expresiones/Operaciones/Cadenas");
    const {Relacionales} = require("../Expresiones/Operaciones/Relacionales");
    const {Logicas} = require("../Expresiones/Operaciones/Logicas");
    const {Declaracion} = require("../Instrucciones/Declaracion");
    const {Asignacion} = require("../Instrucciones/Asignacion");
    const {Simbolos} = require("../TablaSimbolos/Simbolos");
    const {Tipo} = require("../TablaSimbolos/Tipo");
    const {Identificador} = require("../Expresiones/Identificador");
    const {If} = require("../Instrucciones/Control/If");
    const {Switch} = require("../Instrucciones/Control/Switch");
    const {Case} = require("../Instrucciones/Control/Case");
    const {Default} = require("../Instrucciones/Control/Default");
    const {Break} = require("../Instrucciones/Transferencia/Break");
    const {Continue} = require("../Instrucciones/Transferencia/Continue");
    const {Ternario} = require("../Expresiones/Ternario");
    const {For} = require("../Instrucciones/Ciclica/For");
    const {ForEsp} = require("../Instrucciones/Ciclica/ForEsp");
    const {While} = require("../Instrucciones/Ciclica/While");
    const {DoWhile} = require("../Instrucciones/Ciclica/DoWhile");
    const {Funcion} = require("../Instrucciones/Funcion");
    const {Llamada} = require("../Instrucciones/Llamada");
    const {Return} = require("../Instrucciones/Transferencia/Return");
    const {AsignacionArray} = require("../Instrucciones/AsignacionArray");
    const {ManejoArray} = require("../Instrucciones/ManejoArray");
    const {AsignacionStruct} = require("../Instrucciones/AsignacionStruct");
    const {Arreglo} = require("../Expresiones/Arreglo");
    const {Errores} = require("../AST/Errores");
    const {Struct} = require("../Expresiones/Struct");
    const {DeclaracionStruct} = require("../Instrucciones/DeclaracionStruct");
    const {AccesoStruct} = require("../Expresiones/AccesoStruct");
    const {AccesoArreglo} = require("../Expresiones/AccesoArreglo");
%}


%right                              igual
%right                              ternario,dspuntos

%left                               or
%left                               and
%left                               mayor,mayorigual,menor,menorigual
%left                               diferente,igualigual

%left                               mas,menos
%left                               multiplicacion, division, modulo
%right                              negacion
%right                              umenos

%left                               concat
%left                               repit

%left                               oparr

%right                              incremento
%right                              decremento
%left                               parizq
%right                              pardec
%left                               llaveizq
%right                              llavedec
%left                               corizq
%right                              cordec
%left                               punto

%start INICIO

%%

/*
    SINTACTICO
*/

INICIO : CONTENIDO EOF         { $$ = $1; listaRGramar.push({'p':'INICIO -> CONTENIDO','g':'INICIO.val = CONTENIDO.val'}); return { arbol:$$, errores: listaErrores, reportg: listaRGramar}; }
       ;
/*  ------------------------------  CUERPO DE TRABAJO --------------------------------- */

CONTENIDO : CONTENIDO BLOQUE_GB                  { if($2!=null){$1.push($2);} $$ = $1; listaRGramar.push({'p':'CONTENIDO -> CONTENIDO BLOQUE_GB','g':'CONTENIDO.val = CONTENIDO.add(BLOQUE_GB.val)'}); }
          | BLOQUE_GB                            { if($$!=null){$$ = [$1];} listaRGramar.push({'p':'CONTENIDO -> BLOQUE_GB','g':'CONTENIDO.val = BLOQUE_GB.val'}); }
          ;

BLOQUE_GB : DECLARACIONVARIABLE ptcoma                { $$ = $1;  listaRGramar.push({'p':'BLOQUE_GB -> DECLARACIONVARIABLE ptcoma','g':'BLOQUE_GB.val = DECLARACIONVARIABLE.val'}); }
          | FUNCION_BLOQUE                            { $$ = $1; listaRGramar.push({'p':'BLOQUE_GB -> FUNCION_BLOQUE','g':'BLOQUE_GB.val = FUNCION_BLOQUE.val'});}
          | error                                     { $$ = null; listaErrores.push(new Errores('Sintactico', `El caracter no portenece al lenguaje ${yytext}`, this._$.first_line, this._$.first_column)); listaRGramar.push({'p':'BLOQUE_GB -> error','g':'error'});}
          ;

FUNCION_BLOQUE : void id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$= new Funcion(3, new Tipo('VOID'), $2, $3, true, $5, @1.first_line, @1.last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> void id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});}
               | TIPO id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$= new Funcion(3, $1, $2, $3, false, $5, @1.first_line, @1.last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> TIPO id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});}
               | id id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec     { $$ = $5; listaRGramar.push({'p':'FUNCION_BLOQUE -> id id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});}
               | void main parizq pardec llaveizq INSTRUCCIONES llavedec        { $$= new Funcion(3, new Tipo('VOID'), $2, [], true, $6, @1.first_line, @1.last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> void main parizq pardec llaveizq INSTRUCCIONES llavedec ','g':'FUNCION_BLOQUE.val = array(main.lexval,INSTRUCCIONES.val)'});}
               | struct id llaveizq LISTPARAMETROS llavedec                     { $$= new Struct(3, new Tipo('STRUCT'), $2, $4, true, [], @1.first_line, @1.last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> struct id llaveizq LISTPARAMETROS llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,LISTPARAMETROS.val)'});}
               ;

LISTA_STRUCT : LISTA_STRUCT coma DECLA_STRUCT                             { $$ = $1; $$.push($3); listaRGramar.push({'p':'LISTA_STRUCT -> LISTA_STRUCT coma DECLA_STRUCT','g':'LISTA_STRUCT.val = LISTA_STRUCT.add(DECLA_STRUCT.val)'});}
             | DECLA_STRUCT                                               { $$ = []; $$.push($1); listaRGramar.push({'p':'LISTA_STRUCT -> DECLA_STRUCT','g':'LISTA_STRUCT.val = DECLA_STRUCT.val'});} 
             ;
DECLA_STRUCT : TIPO id                                                    { $$ = new Declaracion($1, [new Simbolos(1,null, $2, null)], @1.first_line, @1.last_column); listaRGramar.push({'p':'DECLA_STRUCT -> TIPO id','g':'DECLA_STRUCT.val = array(TIPO.val,id.lexval)'});}
             ;

PARAMETROS_SENTENCIA: parizq LISTPARAMETROS pardec                        { $$ = $2; listaRGramar.push({'p':'PARAMETROS_SENTENCIA -> parizq LISTPARAMETROS pardec','g':'PARAMETROS_SENTENCIA.val = LISTPARAMETROS.val'});}
                    | parizq pardec                                       { $$ = []; listaRGramar.push({'p':'PARAMETROS_SENTENCIA -> parizq pardec','g':'PARAMETROS_SENTENCIA.val = array(null)'});}
                    ;

LISTPARAMETROS: LISTPARAMETROS coma PARAMETRO                              { $$ = $1; $$.push($3); listaRGramar.push({'p':'LISTPARAMETROS -> LISTPARAMETROS coma PARAMETRO','g':'LISTPARAMETROS.val = LISTPARAMETROS.add(PARAMETRO.val)'});}
               | PARAMETRO                                                 { $$ = []; $$.push($1); listaRGramar.push({'p':'LISTPARAMETROS -> PARAMETRO','g':'LISTPARAMETROS.val = PARAMETRO.val'});}
               ;

PARAMETRO: TIPO id                                      { $$ = new Simbolos(6,$1, $2, null);  listaRGramar.push({'p':'PARAMETRO -> TIPO id','g':'PARAMETRO.val = array(TIPO.val,id.lexval)'});}
         | TIPO corizq cordec id                        { $$ = new Simbolos(6,new Tipo("ARRAY"), $4, null);  listaRGramar.push({'p':'PARAMETRO -> TIPO corizq cordec id','g':'PARAMETRO.val = array(TIPO.val,id.lexval)'});}
         | id id                                        { $$ = new Simbolos(6,new Tipo($1), $2, null); listaRGramar.push({'p':'PARAMETRO -> id id','g':'PARAMETRO.val = array(id.lexval,id.lexval)'});}
         ;

TIPO : string                                       { $$ = new Tipo('STRING'); listaRGramar.push({'p':'TIPO -> string','g':'TIPO.val = string.lexval'});}
     | int                                          { $$ = new Tipo('ENTERO'); listaRGramar.push({'p':'TIPO -> int','g':'TIPO.val = int.lexval'});}
     | double                                       { $$ = new Tipo('DECIMAL'); listaRGramar.push({'p':'TIPO -> double','g':'TIPO.val = double.lexval'});}
     | char                                         { $$ = new Tipo('CHAR'); listaRGramar.push({'p':'TIPO -> char','g':'TIPO.val = char.lexval'});}
     | boolean                                      { $$ = new Tipo('BOOLEAN'); listaRGramar.push({'p':'TIPO -> boolean','g':'TIPO.val = boolean.lexval'});}
     ;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION           { if($2!=null){$1.push($2);} $$ = $1; listaRGramar.push({'p':'INSTRUCCIONES -> INSTRUCCIONES INSTRUCCION','g':'INSTRUCCIONES.val = LISTPARAMETROS.add(INSTRUCCION.val)'});}
              | INSTRUCCION                         { if($$!=null){$$ = [$1];} listaRGramar.push({'p':'INSTRUCCIONES -> INSTRUCCION','g':'INSTRUCCIONES.val = INSTRUCCION.val'});}
              ;

INSTRUCCION : DECLARACIONVARIABLE ptcoma            { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> DECLARACIONVARIABLE ptcoma','g':'INSTRUCCIONES.val = DECLARACIONVARIABLE.val'});}
            | ASIGNACION_BLOQUE ptcoma              { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> ASIGNACION_BLOQUE ptcoma','g':'INSTRUCCIONES.val = ASIGNACION_BLOQUE.val'});}
            | PRINT_BLOQUE ptcoma                   { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> PRINT_BLOQUE ptcoma','g':'INSTRUCCIONES.val = PRINT_BLOQUE.val'});}
            | SENTENCIA_IF                          { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_IF ','g':'INSTRUCCIONES.val = SENTENCIA_IF.val'});}
            | SENTENCIA_SWITCH                      { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_SWITCH ','g':'INSTRUCCIONES.val = SENTENCIA_SWITCH.val'});}
            | SENTENCIA_FOR                         { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_FOR ','g':'INSTRUCCIONES.val = SENTENCIA_FOR.val'});}
            | SENTENCIA_FOR_ESP                     { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_FOR_ESP ','g':'INSTRUCCIONES.val = SENTENCIA_FOR_ESP.val'});}
            | SENTENCIA_WHILE                       { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_WHILE ','g':'INSTRUCCIONES.val = SENTENCIA_WHILE.val'});}
            | SENTENCIA_DOWHILE                     { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_DOWHILE ','g':'INSTRUCCIONES.val = SENTENCIA_DOWHILE.val'});}
            | SENTENCIA_BREAK ptcoma                { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_BREAK ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_BREAK.val'});}
            | UNARIA ptcoma                         { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> UNARIA ptcoma','g':'INSTRUCCIONES.val = UNARIA.val'});}
            | SENTENCIA_RETURN ptcoma               { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_RETURN ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_RETURN.val'});}
            | SENTENCIA_CONTINUE ptcoma             { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_CONTINUE ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_CONTINUE.val'});}
            | LLAMADA ptcoma                        { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> LLAMADA ptcoma','g':'INSTRUCCIONES.val = LLAMADA.val'});}
            | NAT_ARREGLO ptcoma                    { $$ = $1; listaRGramar.push({'p':'INSTRUCCION -> NAT_ARREGLO ptcoma','g':'INSTRUCCIONES.val = NAT_ARREGLO.val'});}
            | error                                 { $$=null; listaErrores.push(new Errores('Sintactico', `No se esperaba el token ${yytext}`, this._$.first_line, this._$.first_column)); listaRGramar.push({'p':'INSTRUCCION -> error','g':'error'});}
            ;

/*
       SENTENCIAS EN BLOQUE
*/

PRINT_BLOQUE : print parizq EXPRESION pardec                     { $$ = new Print($3, @1.first_line, @1.first_column ); listaRGramar.push({'p':'PRINT_BLOQUE -> print parizq EXPRESION pardec  ','g':'PRINT_BLOQUE.val = array(EXPRESION.val)'});}
             | println parizq EXPRESION pardec                   { $$ = new Println($3, @1.first_line, @1.first_column ); listaRGramar.push({'p':'PRINT_BLOQUE -> println parizq EXPRESION pardec  ','g':'PRINT_BLOQUE.val = array(EXPRESION.val)'});}
             ;

EXPRESION : ARITMETICA                                          { $$ = $1; listaRGramar.push({'p':'EXPRESION -> ARITMETICA','g':'EXPRESION.val = ARITMETICA.val'});}
          | CADENAS                                             { $$ = $1; listaRGramar.push({'p':'EXPRESION -> CADENAS','g':'EXPRESION.val = CADENAS.val'});}
          | RELACIONAL                                          { $$ = $1; listaRGramar.push({'p':'EXPRESION -> RELACIONAL','g':'EXPRESION.val = RELACIONAL.val'});}
          | LOGICA                                              { $$ = $1; listaRGramar.push({'p':'EXPRESION -> LOGICA','g':'EXPRESION.val = LOGICA.val'});}
          | NATIVAS                                             { $$ = $1; listaRGramar.push({'p':'EXPRESION -> NATIVAS','g':'EXPRESION.val = NATIVAS.val'});}
          | NAT_CAD                                             { $$ = $1; listaRGramar.push({'p':'EXPRESION -> NAT_CAD','g':'EXPRESION.val = NAT_CAD.val'});}
          | NAT_FUN                                             { $$ = $1; listaRGramar.push({'p':'EXPRESION -> NAT_FUN','g':'EXPRESION.val = NAT_FUN.val'});}
          | UNARIA                                              { $$ = $1; listaRGramar.push({'p':'EXPRESION -> UNARIA','g':'EXPRESION.val = UNARIA.val'});}
          | parizq EXPRESION pardec                             { $$ = $2; listaRGramar.push({'p':'EXPRESION -> parizq EXPRESION pardec ','g':'EXPRESION.val = EXPRESION.val'});}
          | PRIMITIVO                                           { $$ = $1; listaRGramar.push({'p':'EXPRESION -> PRIMITIVO','g':'EXPRESION.val = PRIMITIVO.val'});}
          | SENTENCIA_TERNARIO                                  { $$ = $1; listaRGramar.push({'p':'EXPRESION -> SENTENCIA_TERNARIO','g':'EXPRESION.val = SENTENCIA_TERNARIO.val'});}
          | LLAMADA                                             { $$ = $1; listaRGramar.push({'p':'EXPRESION -> LLAMADA','g':'EXPRESION.val = LLAMADA.val'});}
          | ACCESO_STRUCT                                       { $$ = $1; listaRGramar.push({'p':'EXPRESION -> ACCESO_STRUCT','g':'EXPRESION.val = ACCESO_STRUCT.val'});}
          | corizq LISTAARRAY cordec                            { $$ = new Arreglo($2); listaRGramar.push({'p':'EXPRESION -> corizq LISTAARRAY cordec','g':'EXPRESION.val = LISTAARRAY.val'});}
          | ACCESO_ARREGLO                                      { $$ = $1; listaRGramar.push({'p':'EXPRESION -> ACCESO_ARREGLO','g':'EXPRESION.val = ACCESO_ARREGLO.val'});}
          | ARITMETICA_ARREGLO                                  { $$ = $1; listaRGramar.push({'p':'EXPRESION -> ARITMETICA_ARREGLO','g':'EXPRESION.val = ARITMETICA_ARREGLO.val'});}
          ;

/* ARREGLOS Y STRUCTS */
/*
LISTEXPRESIONES: LISTEXPRESIONES coma EXPRESION                 { $$ = $1; $$.push($3); }
                | EXPRESION                                     { $$ = []; $$.push($1); }
                ;*/
ACCESO_STRUCT : EXPRESION punto id                          { $$ = new AccesoStruct($1,new Identificador($3, @1.first_line, @1.last_column),@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_STRUCT -> EXPRESION punto id ','g':'ACCESO_STRUCT.val = array(EXPRESION.val, id.lexval)'});}
              ;


ACCESO_ARREGLO : EXPRESION corizq EXPRESION cordec                            {$$= new AccesoArreglo($1,$3,null,false,null,null,@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, EXPRESION.val)'});}
               | EXPRESION corizq EXPRESION dspuntos EXPRESION cordec         {$$= new AccesoArreglo($1,$3,$5,true,null,null,@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION dspuntos EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, EXPRESION.val)'});}
               | EXPRESION corizq EXPRESION dspuntos end cordec               {$$= new AccesoArreglo($1,$3,null,true,null,$5,@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION dspuntos end cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, end.lexval)'});}
               | EXPRESION corizq begin dspuntos EXPRESION cordec             {$$= new AccesoArreglo($1,null,$5,true,$3,null,@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq begin dspuntos EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(begin.lexval, EXPRESION.val)'});}
               | EXPRESION corizq begin dspuntos end cordec                   {$$= new AccesoArreglo($1,null,null,true,$3,$5,@1.first_line,@1.last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq begin dspuntos end cordec ','g':'ACCESO_ARREGLO.val = array(begin.lexval, end.lexval)'});}
               ;

ARITMETICA_ARREGLO : oparr EXPRESION                                          { $$ = new AritArreglo($2, null, true ,'oparr', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> oparr EXPRESION  ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val)'});}
                   | EXPRESION oparr mas EXPRESION                            { $$ = new AritArreglo($1, $4, false ,'+', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr mas EXPRESION   ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr menos EXPRESION                          { $$ = new AritArreglo($1, $4, false ,'-', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr menos EXPRESION ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr multiplicacion EXPRESION                 { $$ = new AritArreglo($1, $4, false ,'*', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr multiplicacion EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr division EXPRESION                       { $$ = new AritArreglo($1, $4, false ,'/', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr division EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr modulo EXPRESION                         { $$ = new AritArreglo($1, $4, false ,'%', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr modulo EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr concat EXPRESION                         { $$ = new AritArreglo($1, $4, false ,'&', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr concat EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   | EXPRESION oparr repit EXPRESION                          { $$ = new AritArreglo($1, $4, false ,'^', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr repit EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});}
                   ;
/*
ACCESOS       : ACCESOS punto id                                { $$ = $1; $$.push($3); }
              | id                                             { $$ = []; $$.push($1); }
              ;*/

/* GRAMATICA BASICA */
ARITMETICA : EXPRESION mas EXPRESION                            { $$ = new Aritmetica($1, $3, false ,'+', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION mas EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});}
           | EXPRESION menos EXPRESION                          { $$ = new Aritmetica($1, $3, false ,'-', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION menos EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});}
           | EXPRESION multiplicacion EXPRESION                 { $$ = new Aritmetica($1, $3, false ,'*', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION multiplicacion EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});}
           | EXPRESION division EXPRESION                       { $$ = new Aritmetica($1, $3, false ,'/', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION division EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});}
           | EXPRESION modulo EXPRESION                         { $$ = new Aritmetica($1, $3, false ,'%', @1.first_line,@1.last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION modulo EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});}
           ;

CADENAS : EXPRESION concat EXPRESION                         { $$ = new Aritmetica($1, $3, false ,'&', @1.first_line,@1.last_column); listaRGramar.push({'p':'CADENAS -> EXPRESION concat EXPRESION','g':'CADENAS.val = array(EXPRESION.val,EXPRESION.val)'});}
        | EXPRESION repit EXPRESION                          { $$ = new Aritmetica($1, $3, false ,'^', @1.first_line,@1.last_column); listaRGramar.push({'p':'CADENAS -> EXPRESION repit EXPRESION','g':'CADENAS.val = array(EXPRESION.val,EXPRESION.val)'});}
        ;

NAT_CAD : EXPRESION punto caracterposition parizq EXPRESION pardec                 { $$ = new Cadenas($1, $5, null ,'caracterposition', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto caracterposition parizq EXPRESION pardec','g':'NAT_CAD.val = array(EXPRESION.val,EXPRESION.val)'});}
        | EXPRESION punto substring parizq EXPRESION coma EXPRESION pardec         { $$ = new Cadenas($1, $5, $7 ,'substring', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto substring parizq EXPRESION coma EXPRESION pardec','g':'NAT_CAD.val = array(EXPRESION.val,EXPRESION.val,EXPRESION.val)'});}
        | EXPRESION punto length parizq pardec                                     { $$ = new Cadenas($1, null, null ,'length', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto length parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});}
        | EXPRESION punto touppercase parizq pardec                                { $$ = new Cadenas($1, null, null ,'touppercase', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto touppercase parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});}
        | EXPRESION punto tolowercase parizq pardec                                { $$ = new Cadenas($1, null, null ,'tolowercase', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto tolowercase parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});}
        ;

NAT_ARREGLO : id punto push parizq EXPRESION pardec                                { $$ = new ManejoArray($1, $5,'push', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_ARREGLO -> id punto push parizq EXPRESION pardec','g':'NAT_ARREGLO.val = array(id.lexval,EXPRESION.val)'});}
            | id punto pop parizq pardec                                           { $$ = new ManejoArray($1, null,'pop', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_ARREGLO -> id punto pop parizq pardec','g':'NAT_ARREGLO.val = array(id.lexval)'});}
            ;

NAT_FUN : TIPO punto parse parizq EXPRESION pardec                                 { $$ = new Conversion($1, $5,'parse', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_FUN -> TIPO punto parse parizq EXPRESION pardec','g':'NAT_FUN.val = array(TIPO.val,Expresion.val)'});}
        | toint parizq EXPRESION pardec                                            { $$ = new Conversion(null, $3,'toint', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_FUN -> toint parizq EXPRESION pardec','g':'NAT_FUN.val = array(toint.lexval,Expresion.val)'});}
        | todouble parizq EXPRESION pardec                                         { $$ = new Conversion(null, $3,'todouble', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_FUN -> todouble parizq EXPRESION pardec','g':'NAT_FUN.val = array(todouble.lexval,Expresion.val)'});}
        | typeof parizq EXPRESION pardec                                           { $$ = new Conversion(null, $3,'typeof', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_FUN -> typeof parizq EXPRESION pardec','g':'NAT_FUN.val = array(typeof.lexval,Expresion.val)'});}
        | tostring parizq EXPRESION pardec                                         { $$ = new Conversion(null, $3,'tostring', @1.first_line,@1.last_column); listaRGramar.push({'p':'NAT_FUN -> tostring parizq EXPRESION pardec','g':'NAT_FUN.val = array(tostring.lexval,Expresion.val)'});}
        ;

NATIVAS : pow parizq EXPRESION coma EXPRESION pardec         { $$ = new Nativa($3, $5, false ,'pow', @1.first_line,@1.last_column); listaRGramar.push({'p':'NATIVAS -> pow parizq EXPRESION coma EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val,Expresion.val)'});}
        | sin parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'sin',@1.first_line, @1.last_column); listaRGramar.push({'p':'NATIVAS -> sin parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});}
        | cos parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'cos',@1.first_line, @1.last_column); listaRGramar.push({'p':'NATIVAS -> cos parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});}
        | tan parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'tan',@1.first_line, @1.last_column); listaRGramar.push({'p':'NATIVAS -> tan parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});}
        | sqrt parizq EXPRESION pardec                       { $$ = new Nativa($3, null, true , 'sqrt',@1.first_line, @1.last_column); listaRGramar.push({'p':'NATIVAS -> sqrt parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});}
        | log parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'log',@1.first_line, @1.last_column); listaRGramar.push({'p':'NATIVAS -> log parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});}
        ;

RELACIONAL : EXPRESION menor EXPRESION                          { $$ = new Relacionales($1, $3, false ,'<', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION menor EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           | EXPRESION mayor EXPRESION                          { $$ = new Relacionales($1, $3, false ,'>', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION mayor EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           | EXPRESION menorigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'<=', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION menorigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           | EXPRESION mayorigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'>=', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION mayorigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           | EXPRESION igualigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'==', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION igualigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           | EXPRESION diferente EXPRESION                      { $$ = new Relacionales($1, $3, false ,'!=', @1.first_line,@1.last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION diferente EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});}
           ;

LOGICA : EXPRESION or EXPRESION                                 { $$ = new Logicas($1, $3, false ,'||', @1.first_line,@1.last_column); listaRGramar.push({'p':'LOGICA -> EXPRESION or EXPRESION ','g':'LOGICA.val = array(Expresion.val,Expresion.val)'});}
       | EXPRESION and EXPRESION                                { $$ = new Logicas($1, $3, false ,'&&', @1.first_line, @1.last_column); listaRGramar.push({'p':'LOGICA -> EXPRESION and EXPRESION ','g':'LOGICA.val = array(Expresion.val,Expresion.val)'});}
       |           negacion EXPRESION                           { $$ = new Logicas($2, null, true , '!',@1.first_line, @1.last_column); listaRGramar.push({'p':'LOGICA -> negacion EXPRESION ','g':'LOGICA.val = array(Expresion.val)'});}
       |           menos EXPRESION %prec UMENOS                 { $$ = new Aritmetica($2, null, true , 'UNARIO',@1.first_line, @1.last_column); listaRGramar.push({'p':'LOGICA -> menos EXPRESION ','g':'LOGICA.val = array(Expresion.val)'});}
       ;

UNARIA : incremento id                                   { $$ = new Asignacion($2, new Aritmetica(new Identificador($2, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '+',  @1.first_line, @1.last_column),@1.first_line, @1.last_column); listaRGramar.push({'p':'UNARIA -> incremento id  ','g':'UNARIA.val = array(id.lexval)'});}
       | decremento id                                   { $$ = new Asignacion($2, new Aritmetica(new Identificador($2, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '-',  @1.first_line, @1.last_column),@1.first_line, @1.last_column); listaRGramar.push({'p':'UNARIA -> decremento id  ','g':'UNARIA.val = array(id.lexval)'});}
       | id incremento                                   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '+',  @1.first_line, @1.last_column),@1.first_line, @1.last_column); listaRGramar.push({'p':'UNARIA -> id incremento ','g':'UNARIA.val = array(id.lexval)'});}
       | id decremento                                   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '-',  @1.first_line, @1.last_column),@1.first_line, @1.last_column); listaRGramar.push({'p':'UNARIA -> id decremento ','g':'UNARIA.val = array(id.lexval)'});}
       ;

PRIMITIVO : entero                  {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> entero','g':'PRIMITIVO.val = entero.lexval'});}
          | decimal                 {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> decimal','g':'PRIMITIVO.val = decimal.lexval'});}
          | caracter                {$$ = new Primitivo($1, @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> caracter','g':'PRIMITIVO.val = caracter.lexval'});}
          | cadena                  {$$ = new Primitivo($1, @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> cadena','g':'PRIMITIVO.val = cadena.lexval'});}
          | id                      {$$ = new Identificador($1, @1.first_line, @1.last_column); listaRGramar.push({'p':'PRIMITIVO -> id','g':'PRIMITIVO.val = id.lexval'});}
          | true                    {$$ = new Primitivo(true, @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> true','g':'PRIMITIVO.val = true.lexval'});}
          | false                   {$$ = new Primitivo(false, @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> false','g':'PRIMITIVO.val = false.lexval'});}
          | null                    {$$ = new Primitivo(null, @1.first_line, @1.first_column); listaRGramar.push({'p':'PRIMITIVO -> null','g':'PRIMITIVO.val = null.lexval'});}
          ;

DECLARACIONVARIABLE : TIPO LISTAIDS                                          { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO LISTAIDS','g':'DECLARACIONVARIABLE.val = array(TIPO.val, LISTAIDS.val)'});}
                    | TIPO id igual EXPRESION                                { $$ = new Declaracion($1, [new Simbolos(1,null, $2, $4)], @1.first_line, @1.last_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO id igual EXPRESION','g':'DECLARACIONVARIABLE.val = array(TIPO.val, id.lexval, EXPRESION.val)'});}
                    | TIPO corizq cordec id igual EXPRESION                  { $$ = new Declaracion($1, [new Simbolos(1,null, $4, $6)],@1.first_line,@1.first_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO corizq cordec id igual EXPRESION ','g':'DECLARACIONVARIABLE.val = array(TIPO.val, id.lexval, EXPRESION.val)'});}
                    | id id igual id parizq LISTAARRAY pardec                { $$ = new DeclaracionStruct($1,$2,$4,$6,@1.first_line,@1.first_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> id id igual id parizq LISTAARRAY pardec','g':'DECLARACIONVARIABLE.val = array(id.lexval, id.lexval, id.lexval, LISTAARRAY.val)'});}
                    ;

LISTAARRAY : LISTAARRAY coma EXPRESION                  {  $$ = $1; $$.push($3); listaRGramar.push({'p':'LISTAARRAY -> LISTAARRAY coma EXPRESION','g':'LISTAARRAY.val = LISTAARRAY.add(EXPRESION.val)'});}
           | EXPRESION                                  {  $$ = []; $$.push($1); listaRGramar.push({'p':'LISTAARRAY -> EXPRESION','g':'LISTAARRAY.val = EXPRESION.val'});}
           ;

LISTAIDS : LISTAIDS coma id                              { $1.push(new Simbolos(1,null, $3, null)); $$ = $1; listaRGramar.push({'p':'LISTAIDS -> LISTAIDS coma id','g':'LISTAIDS.val = LISTAARRAY.add(id.lexval)'});}
         | id                                            { $$ = [new Simbolos(1,null, $1, null)]; listaRGramar.push({'p':'LISTAIDS -> id','g':'LISTAIDS.val = id.lexval'});}
         ;

ASIGNACION_BLOQUE : id igual EXPRESION                                     { $$ = new Asignacion($1, $3, @1.first_line, @1.last_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id igual EXPRESION','g':'ASIGNACION_BLOQUE.val = array(id.lexval, EXPRESION.val)'});}
                  | id punto id igual EXPRESION                            { $$ = new AsignacionStruct(new Identificador($1, @1.first_line, @1.last_column), new Identificador($3, @1.first_line, @1.last_column),$5, @1.first_line, @1.last_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id punto id igual EXPRESION ','g':'ASIGNACION_BLOQUE.val = array(id.lexval, id.lexval, EXPRESION.val)'});}
                  | id corizq EXPRESION cordec igual EXPRESION             { $$ = new AsignacionArray($1,$3,$6,@1.first_line,@1.first_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id corizq EXPRESION cordec igual EXPRESION','g':'ASIGNACION_BLOQUE.val = array(id.lexval, EXPRESION.val, EXPRESION.val)'});}
                  ;

SENTENCIA_IF: if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec                                      { $$ = new If( $3, $6, [], @1.first_line, @1.last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val)'});}
        | if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else llaveizq INSTRUCCIONES llavedec     { $$ = new If( $3, $6, $10, @1.first_line, @1.last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val, INSTRUCCIONES.val)'});}
        | if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else SENTENCIA_IF                        { $$ = new If( $3, $6, [$9], @1.first_line, @1.last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else SENTENCIA_IF','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val, SENTENCIA_IF.val)'});}
        ;

SENTENCIA_SWITCH : switch parizq EXPRESION pardec llaveizq LISTACASE SENTENCIA_DEFAULT llavedec          { $$ = new Switch($3,$6,$7,@1.first_line,@1.last_column); listaRGramar.push({'p':'SENTENCIA_SWITCH -> switch parizq EXPRESION pardec llaveizq LISTACASE SENTENCIA_DEFAULT llavedec','g':'SENTENCIA_SWITCH.val = array(LISTACASE.val, SENTENCIA_DEFAULT.val)'});}
                 | switch parizq EXPRESION pardec llaveizq LISTACASE llavedec                            { $$ = new Switch($3,$6,null,@1.first_line,@1.last_column); listaRGramar.push({'p':'SENTENCIA_SWITCH -> switch parizq EXPRESION pardec llaveizq LISTACASE llavedec','g':'SENTENCIA_SWITCH.val = array(LISTACASE.val)'});}
                 ;

LISTACASE : LISTACASE SENTENCIA_CASE                               { $1.push($2); $$ = $1; listaRGramar.push({'p':'LISTACASE -> LISTACASE SENTENCIA_CASE','g':'LISTACASE.val = LISTACASE.add(SENTENCIA_CASE.val)'});}
          | SENTENCIA_CASE                                         { $$ = [$1]; listaRGramar.push({'p':'LISTACASE -> SENTENCIA_CASE','g':'LISTACASE.val = SENTENCIA_CASE.val'});}
          ;

SENTENCIA_CASE : case EXPRESION dspuntos INSTRUCCIONES             { $$ = new Case($2,$4,@1.first_line,@1.last_column); listaRGramar.push({'p':'SENTENCIA_CASE -> case EXPRESION dspuntos INSTRUCCIONES','g':'SENTENCIA_CASE.val = array(EXPRESION.val,INSTRUCCIONES.val)'});}
               ;

SENTENCIA_DEFAULT : default dspuntos INSTRUCCIONES                 { $$ =new Default($3,@1.first_line,@1.last_column); listaRGramar.push({'p':'SENTENCIA_DEFAULT -> default dspuntos INSTRUCCIONES','g':'SENTENCIA_DEFAULT.val = array(INSTRUCCIONES.val)'});}
                  ;

SENTENCIA_BREAK : break                                             { $$ = new Break(); listaRGramar.push({'p':'SENTENCIA_BREAK -> break','g':'SENTENCIA_BREAK.val = array(break.lexval)'});}
                ;

SENTENCIA_CONTINUE : continue                                       { $$ = new Continue(); listaRGramar.push({'p':'SENTENCIA_CONTINUE -> continue','g':'SENTENCIA_CONTINUE.val = array(continue.lexval)'});}
                   ;

SENTENCIA_TERNARIO : EXPRESION ternario EXPRESION dspuntos EXPRESION   { $$ = new Ternario($1, $3, $5, @1.first_line, @1.last_column); listaRGramar.push({'p':'SENTENCIA_TERNARIO -> EXPRESION ternario EXPRESION dspuntos EXPRESION','g':'SENTENCIA_TERNARIO.val = array(EXPRESION.val, EXPRESION.val, EXPRESION.val)'});}
                   ;


SENTENCIA_FOR : for parizq DECLARACIONVARIABLE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec      { $$ = new For($3,$5,$7,$10,@1.first_line, @1.last_column); listaRGramar.push({'p':'SENTENCIA_FOR -> for parizq DECLARACIONVARIABLE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR.val = array(DECLARACIONVARIABLE.val,EXPRESION.val,EXPRESION.val,INSTRUCCIONES.val)'});}
              | for parizq ASIGNACION_BLOQUE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec        { $$ = new For($3,$5,$7,$10,@1.first_line, @1.last_column); listaRGramar.push({'p':'SENTENCIA_FOR -> for parizq ASIGNACION_BLOQUE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR.val = array(ASIGNACION_BLOQUE.val,EXPRESION.val,EXPRESION.val,INSTRUCCIONES.val)'});}
              ;

SENTENCIA_FOR_ESP : for id in EXPRESION llaveizq INSTRUCCIONES llavedec     { $$ = new ForEsp(new Simbolos(1,null, $2, null),$4,$6,@1.first_line, @1.last_column); listaRGramar.push({'p':'SENTENCIA_FOR_ESP -> for id in EXPRESION llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR_ESP.val = array(id.lexval,EXPRESION.val,INSTRUCCIONES.val)'});}
                  ;

SENTENCIA_WHILE : while EXPRESION llaveizq INSTRUCCIONES llavedec           { $$ = new While( $2, $4, @1.first_line, @1.last_column); listaRGramar.push({'p':'SENTENCIA_WHILE -> while EXPRESION llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_WHILE.val = array(EXPRESION.val,INSTRUCCIONES.val)'});}
                ;

SENTENCIA_DOWHILE : do llaveizq INSTRUCCIONES llavedec while parizq EXPRESION pardec ptcoma  { $$ = new DoWhile($7,$3,@1.first_line,@1.first_column); listaRGramar.push({'p':'SENTENCIA_DOWHILE -> do llaveizq INSTRUCCIONES llavedec while parizq EXPRESION pardec ptcoma','g':'SENTENCIA_DOWHILE.val = array(INSTRUCCIONES.val, EXPRESION.val)'});}
                  ;

LLAMADA : id parizq pardec                              { $$ = new Llamada($1, [], @1.first_line, @1.last_column); listaRGramar.push({'p':'LLAMADA -> id parizq pardec','g':'LLAMADA.val = array(id.lexval)'});}
        | id parizq LISTAEXPRESIONES pardec             { $$ = new Llamada($1, $3, @1.first_line, @1.last_column); listaRGramar.push({'p':'LLAMADA -> id parizq LISTAEXPRESIONES pardec','g':'LLAMADA.val = array(id.lexval, LISTAEXPRESIONES.val)'});}
        ;

LISTAEXPRESIONES: LISTAEXPRESIONES coma EXPRESION       { $$ = $1; $$.push($3); listaRGramar.push({'p':'LISTAEXPRESIONES -> LISTAEXPRESIONES coma EXPRESION','g':'LISTAEXPRESIONES.val = LISTAEXPRESIONES.add(EXPRESION.val)'});}
                | EXPRESION                             { $$ = []; $$.push($1); listaRGramar.push({'p':'LISTAEXPRESIONES -> EXPRESION','g':'LISTAEXPRESIONES.val = EXPRESION.val'});}
                ;

SENTENCIA_RETURN : return EXPRESION                     { $$ = new Return($2); listaRGramar.push({'p':'SENTENCIA_RETURN -> return EXPRESION ','g':'SENTENCIA_RETURN.val = array(EXPRESION.val)'});}
                 | return                               { $$ = new Return(null); listaRGramar.push({'p':'SENTENCIA_RETURN -> return ','g':'SENTENCIA_RETURN.val = array(null)'});}
                 ;
/*
SENTENCIA_ARREGLO : new TIPO LISTADIMENSIONES                                { $$ = new crearArreglo($2.tipo,$2.valor,$3,@1.first_line,@1.first_column);}
                  | new id LISTADIMENSIONES                                  { $$ = new crearArreglo(Tipo.ID,$2,$3,@1.first_line,@1.first_column);}
                  ;

LISTADIMENSIONES : LISTADIMENSIONES corizq EXPRESION cordec                         { $$ = $1; $$.push($3); }
                 | corizq EXPRESION cordec                                          { $$ = []; $$.push($2); }
                 ;*/

%%