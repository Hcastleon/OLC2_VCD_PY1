<br><br><br><br>

<h1 align="center" style="font-size: 40px; font-weight: bold;">Proyecto 1</h1>
<h3 align="center" style="font-size: 20px; font-weight: bold;">Manual Técnico</h3>

## <br><br><br>

<h1>Tabla de Contenido</h1>

- [**1. Introduccion**](#1-introduccion)
- [**2. Requisitos del Sistema**](#2-requisitos-del-sistema)
- [**3. Descripción del Código**](#3-descripcion-del-codigo)
- [**4. Jison**](#4-jison)
- [**5. Código de 3 Direcciones**](#5-código-de3-direcciones)

## <br><br>

# **1. Introduccion**

En la ingenieria en sistemas comprender cada una de las partes de un compilador es de suma importancia para un desarrollo de los y refuerzo de los conocimientos adquiridos en programación. Este proyecto busca llevar a la práctica la interpretacion y traduccion a codigo intermedio un lenguaje de programación predefinido, con el objetivo de ccomprender todas las reglas y normas que se llevan a cabo en todos estos procesos inlcuyendo aquellos de código intermedio.
<br><br>

---

# **2. Requisitos del Sistema**

| Componente | Mínimo                                                                | Recomendado                                                    |
| ---------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| Procesador | Procesador de x86 o x64 bits de doble núcleo de 1,9 gigahercios (GHz) | Procesador de 64 bits de doble núcleo de 3,3 gigahercios (GHz) |
| Memoria    | 2 GB de RAM                                                           | 4 GB de RAM o más                                              |
| Disco Duro | 3 GB de espacio disponible en el disco duro                           | 3 GB de espacio disponible en el disco duro                    |
| Pantalla   | 1024 x 768                                                            | 1024 x 768                                                     |

<br><br>

---

# **3. Descripción del Código**

En esta sección se detalla y explican algunos de los métodos relevantes de ejecución del programa que permiten su funcionamientos y una salida de información adecuada a lo que se requiere.

<br><br>

## Interfaces

EL interprete maneja dos interfaces fundamentales de la que se extiende la mayoria de las clases para abstraer de mejor manera los metodos y funciones que se realiza en cada instrucción, opor lo que se implementa la ejecución especifica para cada calse segun lo requiera.

```typescript
export interface Expresion {
  getTipo(controlador: Controller, ts: TablaSim, ts_u: TablaSim): any;
  getValor(controlador: Controller, ts: TablaSim, ts_u: TablaSim): any;
  recorrer(): Nodo;
  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim): any;
}
export interface Instruccion {
  ejecutar(controlador: Controller, ts: TablaSim, ts_u: TablaSim): any;
  recorrer(): Nodo;
  traducir(Temp: Temporales, controlador: Controller, ts: TablaSim, ts_u: TablaSim): any;
}
```

## Controller

El controlador es donde se concatenan las respuestas en consola de las funciones o traducciones realizadas ademas de llevar contros de los errores que se van generando durante la ejecución del programa

```typescript
export class Controller {
  public errores: Array<Errores>;
  public consola: string;
  public texto: string;
}
```

## Tabla de Simbolos

Esta clase nos ayuda a analizar y guardar todos los simbolos que se encuentran en la clase y tener infroamcion importate al respecto, ademas de poder manejar entornos por medio de esta clase ya que van conectados una con otra cada una de las tablas que se generan.

```typescript
export class TablaSim {
  public ant: TablaSim;
  public sig: Array<any>;
  public tabla: Map<string, Simbolos>;
  public nombre: string;
  public entorno: number = 0;
}
```

## Nodo

La clase Nodo es de suma importancia para crear el arbol AST y tener cada una de las hojas generadas al momento que se evalua y ejecuta la salida recibida por la gramatica de jison, aqui se guarda solo los nodos relevantes para la ejecución del arbol abstracto.

```typescript
export class Nodo {
  public token: string;
  public lexema: string;
  public hijos: Array<Nodo>;
  public id = 0;

  constructor(t: string, l: string) {
    this.id = 0;
    this.token = t;
    this.lexema = l;
    this.hijos = new Array<Nodo>();
  }
}
```

El resto de clases son la implementacion de la ejecuciony traduccion segun se requiera para el lenguaje dado.

---

# **4. Jison**

Jison es un generador de analizadores lexicos y sintacticos que los ayudo con todo el analisis del lenguaje que definimos y con las reglas que se contruyeron en base a las limitaciones y normas establecidas.

![imagen1](https://www.dovetail.ie/media/1032/jison.png)

- **[Jison Documentacion](https://gerhobbelt.github.io/jison/docs/)**

# **4. Código de 3 Direcciones**

El C3D es un lenguaje intermedio usado por compiladores optimizadores para ayudar en las transformaciones de mejora de código.Ya que el código de tres direcciones es usado como un lenguaje intermedio en los compiladores, los operandos normalmente no contendrán direcciones de memoria o registros concretos, sino que direcciones simbólicas que serán convertidas en direcciones reales durante la asignación de registros.

```c
 t0=2 * 9;
 t1=t0 / 5;
 t2=1 + t1;
 printf("%f", (double)t2);
 printf("%c", (char)10);
```

Este proyecto tiene la parte importante de generar la traduccion de las acciones a este tipo de codigo intermedio por lo que los metodos de traduccion de las clases buscan realizar estas acciones

## <br><br>
