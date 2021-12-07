/*
    LEXICO
*/
%lex
%options case-insensitive
%%
[ \r\t\n]+                                      {} // ESPACIOS
\/\/.([^\n])*                                   {} // COMENTARIO SIMPLE
\/\*(.?\n?)*\*\/                                {} // COMENTARIO MULTILINEA
[0-9]+("."[0-9]+)                               return 'decimal'       // NUMERICO
[0-9]+                                          return 'entero'

"++"                                            return 'incremento'
"--"                                            return 'decremento'
"&"                                             return 'concat'
"^"                                            return 'repit'

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

"||"                                            return 'or'        //RELACIONAL
"&&"                                            return 'and'
"!"                                             return 'negacion'

[\'\‘\’].[\'\’\‘]                               return 'caracter'
[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”]       return 'cadena'

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

"toUpperCase"                                   return 'touppercase'
"toLowerCase"                                   return 'tolowercase'
"toString"                                      return 'tostring'

[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*                  return 'id'
<<EOF>>                                         return 'EOF'
.                                               { console.log("error lexico"); }//ERRORES LEXICOS
/lex

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

INICIO : CONTENIDO EOF         { $$ = $1; return $$; }
       ;
/*  ------------------------------  CUERPO DE TRABAJO --------------------------------- */

CONTENIDO : CONTENIDO FUNCION_BLOQUE      { $$ = $1; $$ = $$.concat($2); } 
          | FUNCION_BLOQUE                { $$ = $1; }
          ;

FUNCION_BLOQUE : void id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$ = $5; }
               | TIPO id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec   { $$ = $5; }
               | void main parizq pardec llaveizq INSTRUCCIONES llavedec        { $$ = $5; }
               ;

PARAMETROS_SENTENCIA: parizq LISTPARAMETROS pardec                                { $$ = $2; }
                    | parizq pardec                                               { $$ = []; }
                    ;

LISTPARAMETROS: LISTPARAMETROS coma PARAMETRO                                  { $$ = $1; $$.push($3); }
               | PARAMETRO                                                     { $$ = []; $$.push($1); }
               ;

PARAMETRO: TIPO id                                      { $$ = $1; console.log("Parametro"); }
         | TIPO corizq cordec id                        { $$ = $1; console.log("Parametro"); }
         | id id                                        { $$ = $1; console.log("Parametro"); }
         | id corizq cordec id                          { $$ = $1; console.log("Parametro"); }
         ;

TIPO : string                                       { $$ = $1; console.log("Tipo"); }
     | int                                          { $$ = $1; console.log("Tipo"); }
     | double                                       { $$ = $1; console.log("Tipo"); }
     | char                                         { $$ = $1; console.log("Tipo"); }
     | boolean                                      { $$ = $1; console.log("Tipo"); }
     ;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION           { $$ = $1; $$ = $$.concat($2); } 
              | INSTRUCCION                         { $$ = $1; }
              ;

INSTRUCCION : DECLARACIONVARIABLE ptcoma            { $$ = $1; }
            | ASIGNACION_BLOQUE ptcoma              { $$ = $1; }
            | PRINT_BLOQUE ptcoma                   { $$ = $1; }
            ;

/*
       SENTENCIAS EN BLOQUE
*/

PRINT_BLOQUE : print parizq EXPRESION pardec                     { $$ = []; console.log("Imprime"); }
             | println parizq EXPRESION pardec                   { $$ = []; console.log("Imprime"); }
             ;

EXPRESION : ARITMETICA                                          { $$ = $1; }
          | RELACIONAL                                          { $$ = $1; }
          | LOGICA                                              { $$ = $1; }
          | TERNARIO                                            { $$ = $1; }
          //| arreglo_statement                                   { $$ = $1; }
          | TOINT_STATEMENT                                     { $$ = $1; }
          | UNARIA                                              { $$ = $1; }
          | parizq EXPRESION pardec                             { $$ = $2; }
          | EXPRESION punto length parizq pardec                { $$ = $1; }
          | PRIMITIVO                                           { $$ = $1; }
          | ID PARIZQ pardec                                    { $$ = $1; }
          | ID PARIZQ LISTEXPRESIONES pardec                    { $$ = $1; }
          | EXPRESION punto id                                  { $$ = $1; }
          | EXPRESION punto id parizq pardec                    { $$ = $1; }
          | EXPRESION punto id parizq LISTEXPRESIONES pardec    { $$ = $1; }
          | EXPRESION punto touppercase parizq pardec           { $$ = $1; }
          | EXPRESION punto tolowercase parizq pardec           { $$ = $1; }
          | EXPRESION punto id corizq EXPRESION cordec          { $$ = $1; }
          | ID corizq EXPRESION cordec                          { $$ = $1; }
          | punto id                                            { $$ = $1; }
          | punto id corizq EXPRESION cordec                    { $$ = $1; }
          | EXPRESION punto tostring parizq pardec              { $$ = $1; }
          ;

LISTEXPRESIONES: LISTEXPRESIONES coma EXPRESION                 { $$ = $1; $$.push($3); }
                | EXPRESION                                     { $$ = []; $$.push($1); }
                ;

ARITMETICA : EXPRESION mas EXPRESION                            { $$ = $1; console.log("suma"); }
           | EXPRESION menos EXPRESION                          { $$ = $1; console.log("resta"); }
           | EXPRESION multiplicacion EXPRESION                 { $$ = $1; console.log("multiplicacion");}
           | EXPRESION division XPRESION                        { $$ = $1; console.log("division");}
           | EXPRESION modulo EXPRESION                         { $$ = $1; console.log("modulo");}
           | pow parizq EXPRESION coma EXPRESION pardec         { $$ = $1; console.log("potencia");}
           ;

RELACIONAL : EXPRESION menor EXPRESION                          { $$ = $1; console.log("menor"); }
           | EXPRESION mayor EXPRESION                          { $$ = $1; console.log("mayor"); }
           | EXPRESION menorigual EXPRESION                     { $$ = $1; console.log("menorigual"); }
           | EXPRESION mayorigual EXPRESION                     { $$ = $1; console.log("mayorigual"); }
           | EXPRESION igualigual EXPRESION                     { $$ = $1; console.log("igualigual"); }
           | EXPRESION diferente EXPRESION                      { $$ = $1; console.log("diferente"); }
           ;

LOGICA : EXPRESION or EXPRESION                                 { $$ = $1; console.log("or"); }
       | EXPRESION and EXPRESION                                { $$ = $1; console.log("and"); }
       |           negacion EXPRESION                           { $$ = $1; console.log("negado"); }
       |           menos EXPRESION %prec UMENOS                 { $$ = $1; console.log("negacion"); }
       ;

UNARIA : incremento EXPRESION                                   { $$ = $1; console.log("unaria"); }
       | decremento EXPRESION                                   { $$ = $1; console.log("unaria"); }
       | EXPRESION incremento                                   { $$ = $1; console.log("unaria"); }
       | EXPRESION decremento                                   { $$ = $1; console.log("unaria"); }
       ;

TERNARIO : parizq EXPRESION pardec ternario EXPRESION dspuntos EXPRESION  { $$ = $1; console.log("ternario"); }
         ;

TOINT_STATEMENT : toint parizq EXPRESION pardec                                         { $$ = $1; console.log("toInt"); }
                | todouble parizq EXPRESION pardec                                      { $$ = $1; console.log("toDouble"); }
                ;

PRIMITIVO : entero                  {$$ = $1; console.log("entero");}
          | decimal                 {$$ = $1; console.log("decimal");}
          | caracter                {$$ = $1; console.log("caracter");}
          | cadena                  {$$ = $1; console.log("cadena");}
          | id                      {$$ = $1; console.log("id");}
          | true                    {$$ = $1; console.log("true");}
          | false                   {$$ = $1; console.log("false");}
          | null                    {$$ = $1; console.log("null"); }
          ;

DECLARACIONVARIABLE : TIPO LISTAIDS                                        { $$ = []; console.log("lista ids") }
                    | TIPO id igual EXPRESION                              { $$ = []; console.log("declaracion con valor"); }
                    | id id igual EXPRESION                                { $$ = []; console.log("declaracion con valor de una instancia"); }
                    | id LISTAIDS                                          { $$ = []; console.log("lista ids de una instancia"); }
                    ;

LISTAIDS : LISTAIDS coma id { $$ =$1; }
         | id               { $$ = $1; }
         ;

ASIGNACION_BLOQUE : id igual EXPRESION                                     {$$ = []; console.log("asignacion valor") }
                  | EXPRESION punto id igual EXPRESION                     {$$ = []; console.log("asignacion valor de instancia"); }
                  ;
%%