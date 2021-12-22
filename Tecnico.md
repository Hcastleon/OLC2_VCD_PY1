

---

<h1>Tabla de Contenido</h1>

- [**1. Introduccion**](#1-introduccion)
- [**2. Requisitos del Sistema**](#2-arquitectura)
- [**2. Descripción del Código**](#2-arquitectura)
- [**3. Diagrama**](#2-arquitectura)
- [**4. Especificaciones del Sistema**](#3-iam-permisos-y-roles)

<br><br>

---

# **1. Introduccion**

En la ingenieria en sistemas comprender cada una de las partes de un compilador es de suma importancia para un desarrollo de los y refuerzo de los conocimientos adquiridos en programación. Este proyecto busca llevar a la práctica la interpretacion y traduccion a codigo intermedio un lenguaje de programación predefinido, con el objetivo de ccomprender todas las reglas y normas que se llevan a cabo en todos estos procesos inlcuyendo aquellos de código intermedio.
<br><br>

---

# **2. Requisitos del Sistema**

| Componente      | Mínimo | Recomendado|
| ----------- | ----------- | --------- |
| Procesador      | Procesador de x86 o x64 bits de doble núcleo de 1,9 gigahercios (GHz)     |Procesador de 64 bits de doble núcleo de 3,3 gigahercios (GHz)|
| Memoria   | 2 GB de RAM        |4 GB de RAM o más|
| Disco Duro   | 3 GB de espacio disponible en el disco duro        |3 GB de espacio disponible en el disco duro|
| Pantalla   | 1024 x 768        |1024 x 768|

<br><br>

---
# **3. Descripción del Código**

En esta sección se detalla y explican algunos de los métodos relevantes de ejecución del programa que permiten su funcionamientos y una salida de información adecuada a lo que se requiere.

<br><br>
## Interfaces

EL interprete maneja dos interfaces fundamentales de la que se extiende la mayoria de las clases para abstraer de mejor manera los metodos y funciones que se realiza en cada instrucción, opor lo que se implementa la ejecución especifica para cada calse segun lo requiera.

```typescript
export interface Expresion{

    getTipo(controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;
    getValor(controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;
    recorrer(): Nodo;
    traducir(Temp: Temporales, controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;
}
export interface Instruccion{

    ejecutar(controlador: Controller, ts: TablaSim, ts_u:TablaSim): any;
    recorrer(): Nodo; 
    traducir(Temp: Temporales, controlador : Controller, ts : TablaSim, ts_u:TablaSim): any;
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

---
