/*
    LEXICO
*/
%{
    let listaErrores =[];
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
    const {Ternario} = require("../Expresiones/Ternario");
    const {For} = require("../Instrucciones/Ciclica/For");
    const {ForEsp} = require("../Instrucciones/Ciclica/ForEsp");
    const {While} = require("../Instrucciones/Ciclica/While");
    const {DoWhile} = require("../Instrucciones/Ciclica/DoWhile");
    const {Funcion} = require("../Instrucciones/Funcion");
    const {Llamada} = require("../Instrucciones/Llamada");
    const {Return} = require("../Instrucciones/Transferencia/Return");
    const {AsignacionArray} = require("../Instrucciones/AsignacionArray");
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

INICIO : CONTENIDO EOF         { $$ = $1; return { arbol:$$, errores: listaErrores}; }
       ;
/*  ------------------------------  CUERPO DE TRABAJO --------------------------------- */

CONTENIDO : CONTENIDO BLOQUE_GB                  { if($2!=null){$1.push($2);} $$ = $1; }
          | BLOQUE_GB                            { if($$!=null){$$ = [$1];} }
          ;

BLOQUE_GB : DECLARACIONVARIABLE ptcoma                { $$ = $1; }
          | FUNCION_BLOQUE                            { $$ = $1; }
          | error                                     { $$ = null; listaErrores.push(new Errores('Sintactico', `El caracter no portenece al lenguaje ${yytext}`, this._$.first_line, this._$.first_column));}
          ;

FUNCION_BLOQUE : void id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$= new Funcion(3, new Tipo('VOID'), $2, $3, true, $5, @1.first_line, @1.last_column); }
               | TIPO id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$= new Funcion(3, $1, $2, $3, false, $5, @1.first_line, @1.last_column); }
               | id id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec     { $$ = $5; }
               | void main parizq pardec llaveizq INSTRUCCIONES llavedec        { $$= new Funcion(3, new Tipo('VOID'), $2, [], true, $6, @1.first_line, @1.last_column); }
               | struct id llaveizq LISTPARAMETROS llavedec                       { $$= new Struct(3, new Tipo('STRUCT'), $2, $4, true, [], @1.first_line, @1.last_column);}
               ;

LISTA_STRUCT : LISTA_STRUCT coma DECLA_STRUCT                                { $$ = $1; $$.push($3);}
             | DECLA_STRUCT                                                   { $$ = []; $$.push($1);} 
             ;
DECLA_STRUCT : TIPO id                                                    {$$ = new Declaracion($1, [new Simbolos(1,null, $2, null)], @1.first_line, @1.last_column); }
             ;

PARAMETROS_SENTENCIA: parizq LISTPARAMETROS pardec                                { $$ = $2; }
                    | parizq pardec                                               { $$ = []; }
                    ;

LISTPARAMETROS: LISTPARAMETROS coma PARAMETRO                                  { $$ = $1; $$.push($3); }
               | PARAMETRO                                                     { $$ = []; $$.push($1); }
               ;

PARAMETRO: TIPO id                                      { $$ = new Simbolos(6,$1, $2, null); }
         | TIPO corizq cordec id                        { $$ = $1; console.log("Parametro"); }
         | id id                                        { $$ = $1; console.log("Parametro"); }
         | id corizq cordec id                          { $$ = $1; console.log("Parametro"); }
         ;

TIPO : string                                       { $$ = new Tipo('STRING'); }
     | int                                          { $$ = new Tipo('ENTERO'); }
     | double                                       { $$ = new Tipo('DECIMAL');}
     | char                                         { $$ = new Tipo('CHAR'); }
     | boolean                                      { $$ = new Tipo('BOOLEAN'); }
     ;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION           { if($2!=null){$1.push($2);} $$ = $1; }
              | INSTRUCCION                         { if($$!=null){$$ = [$1];} }
              ;

INSTRUCCION : DECLARACIONVARIABLE ptcoma            { $$ = $1; }
            | ASIGNACION_BLOQUE ptcoma              { $$ = $1; }
            | PRINT_BLOQUE ptcoma                   { $$ = $1; }
            | SENTENCIA_IF                          { $$ = $1; }
            | SENTENCIA_SWITCH                      { $$ = $1; }
            | SENTENCIA_FOR                         { $$ = $1; }
            | SENTENCIA_FOR_ESP                     { $$ = $1; }
            | SENTENCIA_WHILE                       { $$ = $1; }
            | SENTENCIA_DOWHILE                     { $$ = $1; }
            | SENTENCIA_BREAK ptcoma                { $$ = $1; }
            | UNARIA ptcoma                         { $$ = $1; }
            | SENTENCIA_RETURN ptcoma               { $$ = $1; }
            | LLAMADA ptcoma                        { $$ = $1; }
            | error                                 { $$=null; listaErrores.push(new Errores('Sintactico', `No se esperaba el token ${yytext}`, this._$.first_line, this._$.first_column)); }
            ;

/*
       SENTENCIAS EN BLOQUE
*/

PRINT_BLOQUE : print parizq EXPRESION pardec                     { $$ = new Print($3, @1.first_line, @1.first_column ); }
             | println parizq EXPRESION pardec                   { $$ = new Println($3, @1.first_line, @1.first_column ); }
             ;

EXPRESION : ARITMETICA                                          { $$ = $1; }
          | CADENAS                                             { $$ = $1; }
          | RELACIONAL                                          { $$ = $1; }
          | LOGICA                                              { $$ = $1; }
          | TERNARIO                                            { $$ = $1; }
          | NATIVAS                                             { $$ = $1; }
          | NAT_CAD                                             { $$ = $1; }
          | NAT_FUN                                             { $$ = $1; }
          //| arreglo_statement                                   { $$ = $1; }
          | UNARIA                                              { $$ = $1; }
          | parizq EXPRESION pardec                             { $$ = $2; }
          | PRIMITIVO                                           { $$ = $1; }
        //  | punto id                                            { $$ = $1; }
        //  | punto id corizq EXPRESION cordec                    { $$ = $1; }
          | SENTENCIA_TERNARIO                                  { $$ = $1; }
          | LLAMADA                                             { $$ = $1; }
          | ACCESO_STRUCT                                       { $$ = $1; }
          | corizq LISTAARRAY cordec                            { $$ = new Arreglo($2); }
          | ACCESO_ARREGLO                                      { $$ = $1; }
          ;
/*
LISTEXPRESIONES: LISTEXPRESIONES coma EXPRESION                 { $$ = $1; $$.push($3); }
                | EXPRESION                                     { $$ = []; $$.push($1); }
                ;*/
ACCESO_STRUCT : EXPRESION punto id                          { $$ = new AccesoStruct($1,new Identificador($3, @1.first_line, @1.last_column),@1.first_line,@1.last_column); }
              ;


ACCESO_ARREGLO : EXPRESION corizq EXPRESION cordec                            {$$= new AccesoArreglo($1,$3,null,false,null,null,@1.first_line,@1.last_column);}
               | EXPRESION corizq EXPRESION dspuntos EXPRESION cordec         {$$= new AccesoArreglo($1,$3,$5,true,null,null,@1.first_line,@1.last_column); }
               | EXPRESION corizq EXPRESION dspuntos end cordec               {$$= new AccesoArreglo($1,$3,null,true,null,$5,@1.first_line,@1.last_column); }
               | EXPRESION corizq begin dspuntos EXPRESION cordec             {$$= new AccesoArreglo($1,null,$5,true,$3,null,@1.first_line,@1.last_column); }
               | EXPRESION corizq begin dspuntos end cordec                   {$$= new AccesoArreglo($1,null,null,true,$3,$5,@1.first_line,@1.last_column); }
               ;
/*
ACCESOS       : ACCESOS punto id                                { $$ = $1; $$.push($3); }
              | id                                             { $$ = []; $$.push($1); }
              ;*/


ARITMETICA : EXPRESION mas EXPRESION                            { $$ = new Aritmetica($1, $3, false ,'+', @1.first_line,@1.last_column);}
           | EXPRESION menos EXPRESION                          { $$ = new Aritmetica($1, $3, false ,'-', @1.first_line,@1.last_column); }
           | EXPRESION multiplicacion EXPRESION                 { $$ = new Aritmetica($1, $3, false ,'*', @1.first_line,@1.last_column);}
           | EXPRESION division EXPRESION                       { $$ = new Aritmetica($1, $3, false ,'/', @1.first_line,@1.last_column);}
           | EXPRESION modulo EXPRESION                         { $$ = new Aritmetica($1, $3, false ,'%', @1.first_line,@1.last_column);}
           ;

CADENAS : EXPRESION concat EXPRESION                         { $$ = new Aritmetica($1, $3, false ,'&', @1.first_line,@1.last_column);}
        | EXPRESION repit EXPRESION                          { $$ = new Aritmetica($1, $3, false ,'^', @1.first_line,@1.last_column);}
        ;

NAT_CAD : EXPRESION punto caracterposition parizq EXPRESION pardec                 { $$ = new Cadenas($1, $5, null ,'caracterposition', @1.first_line,@1.last_column);}
        | EXPRESION punto substring parizq EXPRESION coma EXPRESION pardec         { $$ = new Cadenas($1, $5, $7 ,'substring', @1.first_line,@1.last_column);}
        | EXPRESION punto length parizq pardec                                     { $$ = new Cadenas($1, null, null ,'length', @1.first_line,@1.last_column);}
        | EXPRESION punto touppercase parizq pardec                                { $$ = new Cadenas($1, null, null ,'touppercase', @1.first_line,@1.last_column);}
        | EXPRESION punto tolowercase parizq pardec                                { $$ = new Cadenas($1, null, null ,'tolowercase', @1.first_line,@1.last_column);}
        ;

NAT_FUN : TIPO punto parse parizq EXPRESION pardec                                 { $$ = new Conversion($1, $5,'parse', @1.first_line,@1.last_column); }
        | toint parizq EXPRESION pardec                                            { $$ = new Conversion(null, $3,'toint', @1.first_line,@1.last_column); }
        | todouble parizq EXPRESION pardec                                         { $$ = new Conversion(null, $3,'todouble', @1.first_line,@1.last_column); }
        | typeof parizq EXPRESION pardec                                           { $$ = new Conversion(null, $3,'typeof', @1.first_line,@1.last_column); }
        | tostring parizq EXPRESION pardec                                         { $$ = new Conversion(null, $3,'tostring', @1.first_line,@1.last_column); }
        ;

NATIVAS : pow parizq EXPRESION coma EXPRESION pardec         { $$ = new Nativa($3, $5, false ,'pow', @1.first_line,@1.last_column);}
        | sin parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'sin',@1.first_line, @1.last_column); }
        | cos parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'cos',@1.first_line, @1.last_column); }
        | tan parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'tan',@1.first_line, @1.last_column); }
        | sqrt parizq EXPRESION pardec                       { $$ = new Nativa($3, null, true , 'sqrt',@1.first_line, @1.last_column); }
        | log parizq EXPRESION pardec                        { $$ = new Nativa($3, null, true , 'log',@1.first_line, @1.last_column); }
        ;

RELACIONAL : EXPRESION menor EXPRESION                          { $$ = new Relacionales($1, $3, false ,'<', @1.first_line,@1.last_column); }
           | EXPRESION mayor EXPRESION                          { $$ = new Relacionales($1, $3, false ,'>', @1.first_line,@1.last_column); }
           | EXPRESION menorigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'<=', @1.first_line,@1.last_column); }
           | EXPRESION mayorigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'>=', @1.first_line,@1.last_column); }
           | EXPRESION igualigual EXPRESION                     { $$ = new Relacionales($1, $3, false ,'==', @1.first_line,@1.last_column); }
           | EXPRESION diferente EXPRESION                      { $$ = new Relacionales($1, $3, false ,'!=', @1.first_line,@1.last_column); }
           ;

LOGICA : EXPRESION or EXPRESION                                 { $$ = new Logicas($1, $3, false ,'||', @1.first_line,@1.last_column); }
       | EXPRESION and EXPRESION                                { $$ = new Logicas($1, $3, false ,'&&', @1.first_line, @1.last_column);}
       |           negacion EXPRESION                           { $$ = new Logicas($2, null, true , '!',@1.first_line, @1.last_column); }
       |           menos EXPRESION %prec UMENOS                 { $$ = new Aritmetica($2, null, true , 'UNARIO',@1.first_line, @1.last_column); }
       ;

UNARIA : incremento id                                   { $$ = new Asignacion($2, new Aritmetica(new Identificador($2, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '+',  @1.first_line, @1.last_column),@1.first_line, @1.last_column);} 
       | decremento id                                   { $$ = new Asignacion($2, new Aritmetica(new Identificador($2, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '-',  @1.first_line, @1.last_column),@1.first_line, @1.last_column);} 
       | id incremento                                   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '+',  @1.first_line, @1.last_column),@1.first_line, @1.last_column);} 
       | id decremento                                   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1, @1.first_line, @1.last_column),new Primitivo(1, @1.first_line, @1.last_column),false, '-',  @1.first_line, @1.last_column),@1.first_line, @1.last_column);} 
       ;

TERNARIO : parizq EXPRESION pardec ternario EXPRESION dspuntos EXPRESION  { $$ = $1; console.log("ternario"); }
         ;

PRIMITIVO : entero                  {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
          | decimal                 {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
          | caracter                {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
          | cadena                  {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
          | id                      {$$ = new Identificador($1, @1.first_line, @1.last_column);}
          | true                    {$$ = new Primitivo(true, @1.first_line, @1.first_column);}
          | false                   {$$ = new Primitivo(false, @1.first_line, @1.first_column);}
          | null                    {$$ = new Primitivo(null, @1.first_line, @1.first_column); }
          ;

DECLARACIONVARIABLE : TIPO LISTAIDS                                          { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column);  }
                    | TIPO id igual EXPRESION                                { $$ = new Declaracion($1, [new Simbolos(1,null, $2, $4)], @1.first_line, @1.last_column); }
                    | TIPO corizq cordec id igual corizq LISTAARRAY cordec   { $$ = new Declaracion($1, [new Simbolos(1,null, $4, new Arreglo($7))],@1.first_line,@1.first_column);}
                    | id id igual id parizq LISTAARRAY pardec                { $$ = new DeclaracionStruct($1,$2,$4,$6,@1.first_line,@1.first_column);}
                    ;

LISTAARRAY : LISTAARRAY coma EXPRESION                  {  $$ = $1; $$.push($3);}
           | EXPRESION                                  {  $$ = []; $$.push($1);}
           ;

LISTAIDS : LISTAIDS coma id                               {$1.push(new Simbolos(1,null, $3, null)); $$ = $1; }
         | id                                             { $$ = [new Simbolos(1,null, $1, null)]; }
         ;

ASIGNACION_BLOQUE : id igual EXPRESION                                     {$$ = new Asignacion($1, $3, @1.first_line, @1.last_column);  }
                  | id punto id igual EXPRESION                     {$$ = new AsignacionStruct(new Identificador($1, @1.first_line, @1.last_column), new Identificador($3, @1.first_line, @1.last_column),$5, @1.first_line, @1.last_column); }
                  | id corizq EXPRESION cordec igual EXPRESION             { $$ = []; $$.push(new AsignacionArray($1,$3,$6,@1.first_line,@1.first_column)); }
                  ;

SENTENCIA_IF: if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec                                      { $$ = new If( $3, $6, [], @1.first_line, @1.last_column ); }
        | if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else llaveizq INSTRUCCIONES llavedec      { $$ = new If( $3, $6, $10, @1.first_line, @1.last_column ); }
        | if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else SENTENCIA_IF                      { $$ = new If( $3, $6, [$9], @1.first_line, @1.last_column ); }
        ;

SENTENCIA_SWITCH : switch parizq EXPRESION pardec llaveizq LISTACASE SENTENCIA_DEFAULT llavedec          { $$ = new Switch($3,$6,$7,@1.first_line,@1.last_column);}
                 | switch parizq EXPRESION pardec llaveizq LISTACASE llavedec                            { $$ = new Switch($3,$6,null,@1.first_line,@1.last_column); }
                 ;

LISTACASE : LISTACASE SENTENCIA_CASE                                        { $1.push($2); $$ = $1; }
          | SENTENCIA_CASE                                                  { $$ = [$1]; }
          ;

SENTENCIA_CASE : case EXPRESION dspuntos INSTRUCCIONES                      {$$ = new Case($2,$4,@1.first_line,@1.last_column); }
               ;

SENTENCIA_DEFAULT : default dspuntos INSTRUCCIONES                          { $$ =new Default($3,@1.first_line,@1.last_column);}
                  ;

SENTENCIA_BREAK : break                                             { $$ = new Break(); }
                ;

SENTENCIA_TERNARIO : EXPRESION ternario EXPRESION dspuntos EXPRESION                 { $$ = new Ternario($1, $3, $5, @1.first_line, @1.last_column); }
                ;


SENTENCIA_FOR : for parizq DECLARACIONVARIABLE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec        { $$ = new For($3,$5,$7,$10,@1.first_line, @1.last_column); }
              | for parizq ASIGNACION_BLOQUE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec        { $$ = new For($3,$5,$7,$10,@1.first_line, @1.last_column); }
              ;

SENTENCIA_FOR_ESP : for id in EXPRESION llaveizq INSTRUCCIONES llavedec        { $$ = new ForEsp(new Simbolos(1,null, $2, null),$4,$6,@1.first_line, @1.last_column); }
                  ;

SENTENCIA_WHILE : while EXPRESION llaveizq INSTRUCCIONES llavedec                  { $$ = new While( $2, $4, @1.first_line, @1.last_column);  }
                ;

SENTENCIA_DOWHILE : do llaveizq INSTRUCCIONES llavedec while parizq EXPRESION pardec ptcoma           { $$ = new DoWhile($7,$3,@1.first_line,@1.first_column); }
                  ;

LLAMADA : id parizq pardec                                                { $$ = new Llamada($1, [], @1.first_line, @1.last_column); }
        | id parizq LISTAEXPRESIONES pardec                               { $$ = new Llamada($1, $3, @1.first_line, @1.last_column); }
        ;

LISTAEXPRESIONES: LISTAEXPRESIONES coma EXPRESION                            { $$ = $1; $$.push($3); }
                | EXPRESION                                                  { $$ = []; $$.push($1); }
                ;

SENTENCIA_RETURN : return EXPRESION                                             { $$ = new Return($2);}
                 | return                                                       { $$ = new Return(null);}
                 ;
/*
SENTENCIA_ARREGLO : new TIPO LISTADIMENSIONES                                { $$ = new crearArreglo($2.tipo,$2.valor,$3,@1.first_line,@1.first_column);}
                  | new id LISTADIMENSIONES                                  { $$ = new crearArreglo(Tipo.ID,$2,$3,@1.first_line,@1.first_column);}
                  ;

LISTADIMENSIONES : LISTADIMENSIONES corizq EXPRESION cordec                         { $$ = $1; $$.push($3); }
                 | corizq EXPRESION cordec                                          { $$ = []; $$.push($2); }
                 ;*/

%%