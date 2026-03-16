# 1. ARQUITECTURA DE SOFTWARE — Introducción General

## 1.1 ¿Qué es la Arquitectura de Software?

```
┌─────────────────────────────────────────────────────────┐
│              ARQUITECTURA DE SOFTWARE                   │
│                                                         │
│    "Las decisiones fundamentales de estructura          │
│     que son costosas de cambiar una vez                 │
│     implementadas"                                      │
│                                                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │Componentes│──│ Relaciones   │──│ Principios que   │ │
│  │(las piezas)│ │(cómo se      │  │guían el diseño   │ │
│  │           │  │ conectan)    │  │y la evolución    │ │
│  └───────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Definición simple: la arquitectura de software es **el plano de construcción de un sistema**. Define qué piezas tiene, cómo se relacionan entre sí y bajo qué reglas se diseñan y evolucionan.

Piensa en construir una casa: antes de poner un solo ladrillo, necesitas decidir cuántos pisos tendrá, dónde van las tuberías, cómo se distribuyen las habitaciones. Esas decisiones fundamentales que condicionan todo lo demás = arquitectura.

Hay dos perspectivas complementarias que conviene conocer:

- **Perspectiva estructural** (IEEE/SEI): la organización fundamental de un sistema, sus componentes, sus relaciones y los principios que gobiernan su diseño.
- **Perspectiva social** (Martin Fowler / Ralph Johnson): el conocimiento compartido que los desarrolladores expertos tienen sobre el diseño del sistema. Es decir, no es solo un diagrama, es el entendimiento común del equipo.

```
📌 RECUERDA:
→ Arquitectura = decisiones fundamentales + estructura + principios
→ Son decisiones COSTOSAS de cambiar después
→ Es tanto un plano técnico como un conocimiento compartido del equipo
```

---

## 1.2 ¿Por qué importa?

```
  SIN arquitectura clara              CON arquitectura clara
  ─────────────────────               ──────────────────────

  ┌──────────────────┐                ┌──────────────────┐
  │   Código         │                │   Código         │
  │   espagueti      │                │   organizado     │
  │   ┌─┐ ┌─┐ ┌─┐   │                │   ┌─┐  ┌─┐  ┌─┐ │
  │   │ ├─┤ ├─┤ │   │                │   │A│  │B│  │C│ │
  │   └┬┘ └┬┘ └┬┘   │                │   └┬┘  └┬┘  └┬┘ │
  │    └───┴───┘     │                │    │    │    │   │
  │  todo conectado  │                │    ▼    ▼    ▼   │
  │  con todo        │                │   interfaces     │
  └──────────────────┘                └──────────────────┘
         │                                    │
         ▼                                    ▼
  Cada cambio rompe                   Cambios aislados,
  3 cosas más                         predecibles
```

La arquitectura impacta directamente en tres cosas:

- **Costo de cambio:** Una buena arquitectura hace que añadir funcionalidades nuevas sea barato con el tiempo. Una mala hace que cada cambio sea más caro que el anterior.
- **Atributos de calidad:** Rendimiento, seguridad, escalabilidad, mantenibilidad... no se consiguen "al final". Se diseñan desde la arquitectura.
- **Comunicación del equipo:** La arquitectura es el lenguaje común del equipo. Cuando alguien dice "eso va en la capa de dominio", todos entienden lo mismo.

```
📌 RECUERDA:
→ La arquitectura determina cuánto cuesta cambiar el software en el futuro
→ Los atributos de calidad se DISEÑAN, no se añaden después
→ Sirve como lenguaje compartido para que el equipo se entienda
```

---

## 1.3 Arquitectura vs Diseño — No es lo mismo

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ARQUITECTURA          vs          DISEÑO        │
│  (vista de helicóptero)     (vista de calle)     │
│                                                  │
│  ┌────────────────┐        ┌────────────────┐    │
│  │ Sistema entero │        │ Un módulo o    │    │
│  │ Estructura     │        │ componente     │    │
│  │ global         │        │ específico     │    │
│  └────────────────┘        └────────────────┘    │
│                                                  │
│  Ejemplo:                  Ejemplo:              │
│  "Usaremos micro-          "Este servicio usa    │
│   servicios con            el patrón Observer    │
│   event-driven"            para notificaciones"  │
│                                                  │
│  Decisiones CARAS          Decisiones más        │
│  de cambiar                fáciles de cambiar    │
│                                                  │
└──────────────────────────────────────────────────┘
```

- **Arquitectura:** Se ocupa del sistema COMPLETO. Define la estructura global, las propiedades fundamentales y gestiona la incertidumbre. Difícil de cambiar una vez construida.
- **Diseño:** Se ocupa de módulos o componentes INDIVIDUALES. Define propiedades detalladas e implementación concreta. Más fácil de cambiar.

En la práctica, la línea entre ambos es borrosa. Pero la regla general es: si cambiarlo es caro y afecta a muchas partes del sistema, es una decisión arquitectónica.

```
📌 RECUERDA:
→ Arquitectura = decisiones MACRO (sistema completo)
→ Diseño = decisiones MICRO (módulos individuales)
→ Si cambiarlo es muy caro = probablemente es arquitectura
```

---

## 1.4 Estilo vs Patrón vs Patrón de Diseño — Las Tres Escalas

```
  NIVEL DE ABSTRACCIÓN

  ALTO    ┌─────────────────────────────┐
  │       │  ESTILO ARQUITECTÓNICO      │  "La filosofía"
  │       │  Ej: Cliente-Servidor,      │
  │       │      Event-Driven, REST     │
  │       └─────────────┬───────────────┘
  │                     │
  │       ┌─────────────▼───────────────┐
  │       │  PATRÓN ARQUITECTÓNICO      │  "La solución a nivel sistema"
  │       │  Ej: Microservicios, MVC,   │
  │       │      Layered, CQRS          │
  │       └─────────────┬───────────────┘
  │                     │
  BAJO    ┌─────────────▼───────────────┐
          │  PATRÓN DE DISEÑO           │  "La solución a nivel código"
          │  Ej: Observer, Factory,     │
          │      Strategy, Adapter      │
          └─────────────────────────────┘
```

Estos tres conceptos se confunden constantemente. La diferencia es la escala:

- **Estilo Arquitectónico:** La visión de alto nivel, el "tipo" de sistema. Ejemplo: "nuestra app sigue un estilo cliente-servidor". Es una filosofía general.
- **Patrón Arquitectónico:** Una solución concreta y reutilizable a un problema recurrente a nivel de sistema. Ejemplo: "usamos microservicios con API Gateway". Impacta horizontal y verticalmente al sistema.
- **Patrón de Diseño:** Una solución a un problema recurrente a nivel de código/objetos. Ejemplo: "usamos el patrón Observer para las notificaciones". Impacto localizado.

```
📌 RECUERDA:
→ Estilo = la filosofía general del sistema (alto nivel)
→ Patrón arquitectónico = solución reutilizable a nivel sistema (medio nivel)
→ Patrón de diseño = solución reutilizable a nivel código (bajo nivel)
```

---

## 1.5 Atributos de Calidad (los "-ilities")

```
                    ATRIBUTOS DE CALIDAD
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    OPERATIVOS        ESTRUCTURALES      DE CRUCE
    (runtime)         (desarrollo)       (ambos)
         │                 │                 │
  - Rendimiento     - Mantenibilidad   - Seguridad
  - Disponibilidad  - Testeabilidad    - Observabilidad
  - Escalabilidad   - Modularidad      - Fiabilidad
  - Tolerancia      - Extensibilidad
    a fallos         - Portabilidad
```

Los atributos de calidad son las propiedades que definen qué tan "bueno" es el sistema más allá de que funcione correctamente. La clave: **no puedes tenerlos todos al máximo. Toda arquitectura es un juego de trade-offs**.

```
  ┌──────────────┐                  ┌──────────────┐
  │  RENDIMIENTO │ ◄── tensión ──► │  SEGURIDAD   │
  └──────────────┘                  └──────────────┘

  ┌──────────────┐                  ┌──────────────┐
  │ ESCALABILIDAD│ ◄── tensión ──► │  SIMPLICIDAD │
  └──────────────┘                  └──────────────┘

  ┌──────────────┐                  ┌──────────────┐
  │ PORTABILIDAD │ ◄── tensión ──► │  RENDIMIENTO │
  └──────────────┘                  └──────────────┘

  No existe la arquitectura perfecta.
  Existe la correcta para TU contexto.
```

El trabajo del arquitecto es decidir cuáles importan MÁS en su contexto y aceptar los trade-offs. Por ejemplo: si necesitas máximo rendimiento, puede que sacrifiques portabilidad. Si necesitas máxima seguridad, puede que sacrifiques velocidad de desarrollo.

```
📌 RECUERDA:
→ Los atributos de calidad se deciden DESDE la arquitectura
→ Siempre hay trade-offs: ganar en uno implica ceder en otro
→ No hay arquitectura perfecta, hay la correcta para tu proyecto
```

---

## 1.6 Los Dos Niveles de Decisión Arquitectónica

```
  ┌────────────────────────────────────────────────────┐
  │            DECISIONES ARQUITECTÓNICAS               │
  │                                                    │
  │   NIVEL 1: SISTEMA                                 │
  │   "¿Cómo organizo y despliego las piezas?"         │
  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐         │
  │   │Mono- │ │Micro-│ │Server│ │Event-    │         │
  │   │lito  │ │serv. │ │less  │ │Driven    │   ...   │
  │   └──────┘ └──────┘ └──────┘ └──────────┘         │
  │                                                    │
  │   NIVEL 2: CÓDIGO                                  │
  │   "¿Cómo organizo el código DENTRO de cada pieza?" │
  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐         │
  │   │Layer-│ │Hexa- │ │Clean │ │Pipe &    │         │
  │   │ed    │ │gonal │ │Arch  │ │Filter    │   ...   │
  │   └──────┘ └──────┘ └──────┘ └──────────┘         │
  │                                                    │
  │   Son INDEPENDIENTES: puedes combinar cualquiera   │
  │   del Nivel 1 con cualquiera del Nivel 2           │
  └────────────────────────────────────────────────────┘
```

Esta es la distinción clave que identificaste correctamente, Ivan. Son dos decisiones diferentes que se toman a distinto nivel y se combinan libremente. Y es exactamente así como vamos a estructurar la documentación a partir de aquí:

- **Siguiente paso:** Sección 2 — Arquitectura de Código
- **Después:** Sección 3 — Arquitectura de Sistemas

```
📌 RECUERDA:
→ Nivel Sistema = cómo DESPLIEGAS y comunicas servicios
→ Nivel Código = cómo ORGANIZAS el código dentro de cada servicio
→ Son decisiones independientes que se combinan libremente
→ Ejemplo: Microservicios (sistema) + Clean Architecture (código)
```

---

**Resumen Ejecutivo — Sección 1**

```
┌─────────────────────────────────────────────────────────┐
│  ARQUITECTURA DE SOFTWARE — Lo esencial                 │
│                                                         │
│  1. Es el plano del sistema: componentes, relaciones    │
│     y principios que gobiernan su diseño                │
│                                                         │
│  2. Importa porque determina el COSTO FUTURO de         │
│     cambiar el software                                 │
│                                                         │
│  3. Arquitectura ≠ Diseño                               │
│     (macro vs micro, caro vs barato de cambiar)         │
│                                                         │
│  4. Estilo > Patrón Arquitectónico > Patrón de Diseño   │
│     (de más abstracto a más concreto)                   │
│                                                         │
│  5. Todo es trade-offs: no hay arquitectura perfecta,   │
│     hay la correcta para tu contexto                    │
│                                                         │
│  6. Se decide en dos niveles independientes:             │
│     SISTEMA (despliegue) + CÓDIGO (organización)        │
└─────────────────────────────────────────────────────────┘
```

---

# 2. ARQUITECTURA DE CÓDIGO

_"¿Cómo organizo el código DENTRO de una aplicación o servicio?"_

## 2.0 El Panorama de las Arquitecturas de Código

```
ARQUITECTURAS DE CÓDIGO
         │
         ├── TRADICIONALES (organizan por capas técnicas)
         │   └── Layered / N-Tier
         │
         ├── CENTRADAS EN EL DOMINIO (protegen la lógica de negocio)
         │   ├── Hexagonal (Ports & Adapters)
         │   ├── Onion
         │   └── Clean Architecture
         │
         ├── DE FLUJO DE DATOS (organizan por procesamiento)
         │   └── Pipe & Filter
         │
         └── DE PRESENTACIÓN (organizan la UI)
             ├── MVC
             ├── MVP
             └── MVVM
```

La idea central: todas buscan **separar responsabilidades**, pero difieren en QUÉ ponen en el centro y CÓMO dibujan las dependencias.

```
📌 RECUERDA:
→ Tradicionales: separan por FUNCIÓN técnica (UI, lógica, datos)
→ Centradas en dominio: separan para PROTEGER la lógica de negocio
→ De presentación: separan cómo se muestra la información al usuario
```

---

## 2.1 Layered Architecture (N-Tier)

```
  ┌──────────────────────────────────┐
  │      PRESENTATION LAYER          │  ← Controllers, vistas, API
  │      (lo que ve el usuario)      │
  ├──────────────────────────────────┤
  │      BUSINESS LOGIC LAYER        │  ← Reglas, validaciones, cálculos
  │      (lo que el sistema "sabe")  │
  ├──────────────────────────────────┤
  │      DATA ACCESS LAYER           │  ← Repositorios, queries, ORM
  │      (cómo guarda/lee datos)     │
  ├──────────────────────────────────┤
  │      DATABASE                    │  ← PostgreSQL, MongoDB, etc.
  └──────────────────────────────────┘

  Regla: cada capa SOLO habla con la inmediatamente inferior
  La flecha de dependencia va de ARRIBA hacia ABAJO

  Presentation ──▶ Business ──▶ Data Access ──▶ Database
```

**Qué es:** Organizar el código en capas horizontales, donde cada una tiene una responsabilidad técnica. La de arriba solo habla con la de abajo. Nunca se salta capas.

Analogía: una cadena de montaje. El paso 1 (UI) pasa trabajo al paso 2 (lógica), que pasa al paso 3 (datos). Cada persona en la cadena solo conoce a la siguiente.

**El problema fundamental:**

```
  Presentation ──▶ Business ──▶ Data Access
                       │              │
                       └──────────────┘
                       La lógica de negocio
                       DEPENDE de la capa de datos.
                       Si cambias la BD, tocas el negocio.
```

La capa de negocio "mira hacia abajo" hacia los datos. Esto significa que tu lógica más valiosa (las reglas de negocio) está acoplada a los detalles de infraestructura (la base de datos). Este problema es exactamente lo que las arquitecturas centradas en dominio vinieron a resolver.

**Cuándo usarla:** CRUDs simples, apps con poca lógica de negocio, MVPs, equipos junior.

**Cuándo NO:** Cuando la lógica de negocio es compleja y quieres que sobreviva cambios tecnológicos.

```
📌 RECUERDA:
→ La arquitectura más conocida y usada del mundo
→ Simple de entender, pero la lógica queda ACOPLADA a los datos
→ Si tu app es un CRUD glorificado, Layered es perfecta
```

### Ejemplo de estructura de carpetas

```
src/
  /routes
    task.routes.ts            ← Mapea URLs a controllers
  /controllers
    task.controller.ts        ← Recibe HTTP, llama al service
  /services
    task.service.ts           ← Lógica de negocio + orquestación
  /repositories
    task.repository.ts        ← Acceso a datos (queries, BD)
  /models
    task.model.ts             ← Schema/modelo de BD
  app.ts                      ← Setup Express
  server.ts                   ← Entry point
```

```
PRESENTATION LAYER
├── /routes          ← Mapea URLs a controllers
├── /controllers     ← Recibe Request, devuelve Response

BUSINESS LOGIC LAYER
├── /services        ← Lógica de negocio y orquestación

DATA ACCESS LAYER
├── /repositories    ← Queries, CRUD contra la BD
├── /models          ← Schemas/definición de datos
```

---

## 2.2 Hexagonal Architecture (Ports & Adapters)

```
                    MUNDO EXTERIOR
          ┌──────────────────────────────┐
          │                              │
  ┌───────┴──────┐              ┌────────┴─────┐
  │   ADAPTER    │              │   ADAPTER    │
  │  (REST API)  │              │ (PostgreSQL) │
  └───────┬──────┘              └────────┬─────┘
          │                              │
  ┌───────▼──────┐              ┌────────▼─────┐
  │  INPUT PORT  │              │ OUTPUT PORT  │
  │  (interfaz)  │              │  (interfaz)  │
  └───────┬──────┘              └────────┬─────┘
          │                              │
          │     ┌──────────────┐         │
          └────▶│   DOMINIO    │◀────────┘
                │   (CORE)     │
                │              │
                │ Entities     │
                │ Use Cases    │
                │ Business     │
                │   Rules      │
                └──────────────┘

  REGLA DE ORO: Las flechas de dependencia
  SIEMPRE apuntan HACIA el dominio.
  El dominio NO importa nada de fuera.
```

**Qué es:** Tu lógica de negocio está en el centro y JAMÁS depende de nada externo. Se comunica con el exterior a través de contratos (ports/interfaces) que ella misma define. Las implementaciones concretas (adapters) viven fuera.

Analogía: un enchufe universal. Tu portátil (dominio) funciona siempre igual. El adaptador cambia según el país (PostgreSQL, MongoDB, REST, GraphQL...).

**Los tres conceptos clave:**

```
  CORE (Dominio)
  └── Define QUÉ necesita mediante interfaces
      │
  PORTS (Puertos)
  └── Las interfaces/contratos
      │
      ├── Input Ports: "cómo entran peticiones"
      │   Ej: CreateOrderUseCase (interfaz)
      │
      └── Output Ports: "qué necesito del exterior"
          Ej: OrderRepository (interfaz)
      │
  ADAPTERS (Adaptadores)
  └── Implementaciones concretas de los ports
      │
      ├── Input Adapters: REST controller, CLI, tests
      └── Output Adapters: PostgresOrderRepo, MongoOrderRepo
```

**La inversión de dependencia en acción:**

```
  SIN Hexagonal (Layered):
  Business ──depende──▶ PostgresRepository  (el negocio conoce Postgres)

  CON Hexagonal:
  Business ──depende──▶ OrderRepository (interfaz propia)
                              ▲
                              │ implementa
                        PostgresOrderRepo  (la infra conoce la interfaz)

  ¡La flecha se INVIRTIÓ!
  Ahora la infra depende del dominio, no al revés.
```

**Cuándo usarla:** Lógica de negocio compleja, necesidad de cambiar tecnologías sin tocar el core, proyectos que requieren alta testeabilidad.

**Cuándo NO:** CRUDs simples donde el overhead de abstracciones no se justifica.

**Creada por:** Alistair Cockburn, 2005.

```
📌 RECUERDA:
→ El dominio define sus propios contratos (ports), la infra los implementa (adapters)
→ La Dependency Inversion Principle (SOLID) es el pilar de esta arquitectura
→ Puedes cambiar BD, framework o UI sin tocar UNA línea de dominio
```

### Ejemplo de estructura de carpetas

```
src/
  /core
    /entities
      task.entity.ts          ← Entidad con reglas de negocio
    /ports
      /input
        create-task.port.ts   ← Interfaz de entrada (lo que el exterior puede pedir)
        get-tasks.port.ts
      /output
        task-repository.port.ts  ← Interfaz de salida (lo que el core necesita)
    /services
      task.service.ts         ← Implementa los input ports, orquesta lógica
  /adapters
    /input
      /http
        task.controller.ts    ← Adapter de entrada: Express → Core
        task.routes.ts
    /output
      /persistence
        mongo-task.repo.ts    ← Adapter de salida: Core → MongoDB
  main.ts                     ← Wiring + entry point
```

```
CORE (el hexágono)
├── /entities        ← Reglas de negocio puras
├── /ports/input     ← Contratos: CÓMO me piden cosas
├── /ports/output    ← Contratos: QUÉ necesito del exterior
├── /services        ← Implementa input ports, orquesta

ADAPTERS (el mundo exterior)
├── /input/http      ← Adapter de entrada: Express controller
├── /output/persistence ← Adapter de salida: MongoDB repo
```

---

## 2.3 Clean Architecture

```
  ┌────────────────────────────────────────────────┐
  │           FRAMEWORKS & DRIVERS                 │
  │  (Express, React, PostgreSQL, AWS)             │
  │    ┌────────────────────────────────────────┐  │
  │    │       INTERFACE ADAPTERS               │  │
  │    │  (Controllers, Presenters, Gateways)   │  │
  │    │    ┌────────────────────────────────┐  │  │
  │    │    │         USE CASES              │  │  │
  │    │    │  (Application Business Rules)  │  │  │
  │    │    │    ┌──────────────────────┐    │  │  │
  │    │    │    │      ENTITIES        │    │  │  │
  │    │    │    │  (Enterprise Rules)  │    │  │  │
  │    │    │    └──────────────────────┘    │  │  │
  │    │    └────────────────────────────────┘  │  │
  │    └────────────────────────────────────────┘  │
  └────────────────────────────────────────────────┘

  THE DEPENDENCY RULE:
  ═══════════════════
  Las dependencias de código SOLO apuntan hacia adentro.
  Nada del centro sabe nada de lo que hay fuera.
```

**Qué es:** La formalización de Uncle Bob (Robert C. Martin, 2012) que integra las ideas de Hexagonal, Onion y otros en un modelo con cuatro capas concéntricas y una regla irrompible: las dependencias solo apuntan hacia adentro.

**Las 4 capas explicadas:**

```
  ENTITIES (centro)
  │  Objetos con reglas de negocio puras.
  │  Ej: "Un pedido no puede tener total negativo"
  │  Son lo MÁS estable. Cambian MUY poco.
  │
  USE CASES
  │  Lógica específica de la aplicación.
  │  Ej: "Crear pedido: verificar stock → calcular total → guardar"
  │  Orquestan entities y definen QUÉ hace la app.
  │
  INTERFACE ADAPTERS
  │  Convierten datos entre el formato del dominio
  │  y el formato del mundo exterior.
  │  Ej: Controllers, Presenters, DTOs, Mappers
  │
  FRAMEWORKS & DRIVERS (exterior)
     Todo lo concreto: Express, React, PostgreSQL,
     AWS SDK, etc. Aquí hay muy poco código "propio".
```

**Cómo cruza datos entre capas (la pregunta del millón):**

```
  Controller ──▶ UseCase ──▶ Entity
       │              │
       │     usa       │     define
       │     interfaz  │     interfaz
       ▼              ▼
  Request DTO    OutputPort (interfaz)
                      ▲
                      │ implementa
                 Presenter (capa exterior)

  El UseCase NUNCA llama al Presenter directamente.
  Llama a una interfaz (OutputPort) que él mismo definió.
  El Presenter la implementa desde fuera.
```

**Cuándo usarla:** Apps grandes con lógica de negocio compleja, que necesiten sobrevivir cambios de frameworks y tecnologías.

**Cuándo NO:** MVPs, CRUDs simples, prototipos rápidos. El overhead no se justifica.

```
📌 RECUERDA:
→ THE DEPENDENCY RULE: dependencias solo apuntan hacia ADENTRO
→ Entities = reglas de negocio universales, Use Cases = acciones de la app
→ Frameworks y BD son DETALLES, no el centro de tu app
```

### Ejemplo de estructura de carpetas

```
src/
  /domain
    task.entity.ts            ← Entidad con reglas de negocio
    task.repository.ts        ← Interfaz del repositorio
  /application
    create-task.use-case.ts   ← Un caso de uso = una clase
    get-tasks.use-case.ts
    find-task.use-case.ts
    complete-task.use-case.ts
    delete-task.use-case.ts
  /infrastructure
    /persistence
      in-memory-task.repo.ts  ← Implementación concreta del repo
    /http
      task.controller.ts      ← Controller Express
      task.routes.ts
  main.ts                     ← Wiring + entry point
```

```
ENTITIES (centro, reglas universales)
├── /domain          ← Entities, interfaces. TypeScript puro, cero imports externos

USE CASES (reglas de esta app)
├── /application     ← Cada use case = 1 clase con execute()

INTERFACE ADAPTERS (traductores)
├── /infrastructure/http         ← Controllers, routes (HTTP ↔ Use Cases)
├── /infrastructure/persistence  ← Repos concretos (Use Cases ↔ BD)

FRAMEWORKS & DRIVERS (pegamento técnico)
├── main.ts          ← Express, wiring, configuración
```

---

## 2.4 La Familia Hexagonal / Onion / Clean — Son Primas

```
  2005              2008              2012
   │                 │                 │
   ▼                 ▼                 ▼
Hexagonal ──────▶  Onion  ──────▶  Clean
(Cockburn)      (Palermo)       (Uncle Bob)

┌───────────────────────────────────────────────┐
│  PRINCIPIO COMPARTIDO:                        │
│                                               │
│  1. El dominio va en el CENTRO                │
│  2. La infraestructura va por FUERA           │
│  3. Las dependencias apuntan HACIA ADENTRO    │
│  4. Se usa Dependency Inversion para lograrlo │
└───────────────────────────────────────────────┘
```

**¿Qué las diferencia?**

```
  HEXAGONAL                ONION                  CLEAN
  ─────────               ───────                ───────
  Habla de:               Habla de:              Habla de:
  - Ports                 - Domain Model         - Entities
  - Adapters              - Domain Services       - Use Cases
  - Core                  - Application Services  - Interface Adapters
                          - Infrastructure        - Frameworks & Drivers

  Foco:                   Foco:                   Foco:
  Desacoplar el core      Capas concéntricas      Dependency Rule
  del exterior            con domain en centro    + capas formalizadas

  PERO EL RESULTADO PRÁCTICO ES ESENCIALMENTE EL MISMO
```

Si entiendes una, entiendes las tres. En la práctica, la mayoría de equipos toman conceptos de las tres y crean su propia variante adaptada al proyecto.

```
📌 RECUERDA:
→ Hexagonal, Onion y Clean son la MISMA filosofía con distinto vocabulario
→ Dominio al centro + Dependency Inversion = el patrón común
→ En la práctica los equipos mezclan conceptos de las tres
```

### Ejemplo de estructura de carpetas (Onion)

```
src/
  /domain
    /model
      task.entity.ts          ← Entidad con identidad y reglas
      task.repository.ts      ← Interfaz del repositorio
    /services
      pricing.service.ts      ← Lógica que cruza múltiples entidades
  /application
    create-task.use-case.ts   ← Orquestación de flujos
    complete-task.use-case.ts
  /infrastructure
    /persistence
      mongo-task.repo.ts      ← Implementación concreta del repo
    /http
      task.controller.ts      ← Controller Express
      task.routes.ts
  main.ts                     ← Wiring + entry point
```

```
DOMAIN MODEL (centro, lo más estable)
├── /domain/model    ← Entities, Value Objects, interfaces de repos

DOMAIN SERVICES (lógica que cruza entidades)
├── /domain/services ← Reglas que involucran múltiples entities

APPLICATION SERVICES (orquestación)
├── /application     ← Use cases, coordinan domain services y entities

INFRASTRUCTURE (lo más externo, lo más reemplazable)
├── /infrastructure  ← BD, framework, APIs externas
```

---

## 2.5 Pipe & Filter

```
  ┌────────┐     ┌────────────┐     ┌─────────────┐     ┌────────┐
  │ PUMP   │────▶│  FILTER 1  │────▶│   FILTER 2  │────▶│  SINK  │
  │(fuente │pipe │  Validar   │pipe │  Transformar │pipe │(destino│
  │ datos) │     │            │     │              │     │ final) │
  └────────┘     └────────────┘     └─────────────┘     └────────┘

  Cada Filter:
  ✓ Recibe datos por su entrada
  ✓ Los procesa (una sola tarea)
  ✓ Los envía por su salida
  ✗ NO conoce al filter anterior ni al siguiente
  ✗ NO comparte estado con otros filters
```

**Qué es:** Dividir el procesamiento en pasos independientes (filtros) conectados por canales (pipes). Los datos fluyen linealmente de un filtro al siguiente.

Analogía: los comandos de Unix. `cat archivo | grep "error" | sort | uniq` — Cada comando hace UNA cosa y pasa el resultado al siguiente.

**Cuándo usarla:** Procesamiento de datos en cadena (ETL), pipelines de CI/CD, compiladores, procesamiento de imágenes o audio.

**Cuándo NO:** Cuando los pasos necesitan compartir estado, o el procesamiento no es lineal.

```
📌 RECUERDA:
→ Datos entran, se procesan paso a paso, y salen transformados
→ Cada filtro es independiente, reutilizable y reemplazable
→ Ideal para procesamiento de datos, NO para apps interactivas
```

---

## 2.6 MVC / MVP / MVVM — Patrones de Presentación

```
  MVC (Model-View-Controller)
  ────────────────────────────
  ┌───────┐  input   ┌────────────┐  updates  ┌───────┐
  │  VIEW │─────────▶│ CONTROLLER │──────────▶│ MODEL │
  │       │◀─────────┤            │◀───────────┤       │
  └───────┘ observes └────────────┘  notifies  └───────┘

  MVP (Model-View-Presenter)
  ────────────────────────────
  ┌───────┐  events  ┌────────────┐  updates  ┌───────┐
  │  VIEW │─────────▶│ PRESENTER  │──────────▶│ MODEL │
  │       │◀─────────┤            │◀───────────┤       │
  └───────┘ updates  └────────────┘  data      └───────┘
  View y Presenter tienen relación 1:1

  MVVM (Model-View-ViewModel)
  ────────────────────────────
  ┌───────┐ data-binding ┌────────────┐ updates ┌───────┐
  │  VIEW │◀════════════▶│ VIEW MODEL │────────▶│ MODEL │
  │       │  automático  │            │◀─────────┤       │
  └───────┘              └────────────┘  data    └───────┘
  View y ViewModel se sincronizan automáticamente
```

**Qué son:** Tres formas de organizar la capa de presentación (UI). No son arquitecturas del sistema completo, sino patrones para separar la lógica visual del resto.

- **Model:** Los datos y la lógica de negocio
- **View:** Lo que el usuario ve y con lo que interactúa
- **Controller/Presenter/ViewModel:** El intermediario que conecta Model con View

**La diferencia clave entre los tres:**

```
  ┌──────────┬────────────────┬──────────────┬──────────────┐
  │          │     MVC        │    MVP       │    MVVM      │
  ├──────────┼────────────────┼──────────────┼──────────────┤
  │ Quién    │ Controller     │ Presenter    │ ViewModel    │
  │ decide   │ (recibe input  │ (recibe todo │ (data-binding│
  │          │  y actualiza)  │  de la View) │  automático) │
  ├──────────┼────────────────┼──────────────┼──────────────┤
  │ Relación │ Muchos Views   │ 1 View =     │ 1 ViewModel =│
  │ View/X   │ 1 Controller   │ 1 Presenter  │ N Views      │
  ├──────────┼────────────────┼──────────────┼──────────────┤
  │ Testing  │ Difícil        │ Bueno        │ El mejor     │
  ├──────────┼────────────────┼──────────────┼──────────────┤
  │ Ideal    │ Apps web       │ Apps con UI  │ Apps con UI  │
  │ para     │ tradicionales  │ compleja     │ reactiva     │
  └──────────┴────────────────┴──────────────┴──────────────┘
```

**Nota importante:** MVC/MVP/MVVM viven DENTRO de la capa de presentación de cualquier otra arquitectura. Puedes tener Clean Architecture + MVVM en la capa exterior, o Hexagonal + MVC.

```
📌 RECUERDA:
→ MVC/MVP/MVVM no son alternativas a Hexagonal o Clean
→ Son patrones para organizar la UI, viven DENTRO de la capa de presentación
→ MVC = web clásica, MVP = Android/WinForms, MVVM = React/Vue/WPF
```

---

## 2.7 Mapa de Decisión — ¿Cuál Elegir?

```
  ¿Qué tipo de app estás haciendo?
           │
           ├── CRUD simple, poca lógica ──────▶ Layered (N-Tier)
           │
           ├── Lógica de negocio compleja,
           │   quiero desacoplar del framework ──▶ Hexagonal o Clean
           │
           ├── Pipeline de procesamiento
           │   de datos en cadena ────────────▶ Pipe & Filter
           │
           └── ¿Cómo organizo la UI?
                    │
                    ├── Web clásica ───────────▶ MVC
                    ├── App móvil/desktop ─────▶ MVP o MVVM
                    └── App reactiva (React,
                        Vue, Angular) ────────▶ MVVM
```

```
  COMBINACIONES COMUNES EN EL MUNDO REAL:

  ┌─────────────────────────────────────────────┐
  │  Clean Architecture + MVVM (React)          │
  │  Hexagonal + MVC (Spring Boot)              │
  │  Layered + MVC (Django, Rails)              │
  │  Clean Architecture + CQRS (dentro de       │
  │    un microservicio)                        │
  └─────────────────────────────────────────────┘
```

---

**Resumen Ejecutivo — Sección 2**

```
┌──────────────────────────────────────────────────────────┐
│  ARQUITECTURA DE CÓDIGO — Lo esencial                    │
│                                                          │
│  1. Layered: capas horizontales, simple pero acoplada    │
│     a la BD. Ideal para CRUDs.                           │
│                                                          │
│  2. Hexagonal: dominio al centro con ports/adapters.     │
│     El dominio NO depende de nada externo.               │
│                                                          │
│  3. Clean: formaliza Hexagonal con 4 capas y la          │
│     Dependency Rule (todo apunta hacia adentro).         │
│                                                          │
│  4. Hexagonal ≈ Onion ≈ Clean: misma filosofía,          │
│     distinto vocabulario.                                │
│                                                          │
│  5. Pipe & Filter: procesamiento lineal de datos.        │
│                                                          │
│  6. MVC/MVP/MVVM: patrones de UI que viven DENTRO        │
│     de la capa de presentación de cualquier arquitectura.│
│                                                          │
│  7. EL PRINCIPIO UNIVERSAL: la lógica de negocio es lo   │
│     más valioso. Protégela de los detalles técnicos.     │
└──────────────────────────────────────────────────────────┘
```

---

# 3. ARQUITECTURA DE SISTEMAS

_"¿Cómo organizo, despliego y comunico los diferentes servicios o componentes de mi sistema?"_

## 3.0 El Panorama de las Arquitecturas de Sistema

```
ARQUITECTURAS DE SISTEMA
         │
         ├── DEPLOYMENT (cómo despliegas)
         │   ├── Monolito Clásico
         │   ├── Monolito Modular
         │   ├── Microservicios
         │   ├── Serverless
         │   └── SOA (Service-Oriented)
         │
         └── COMUNICACIÓN (cómo se hablan los servicios)
             ├── Request/Response (síncrono: REST, gRPC)
             ├── Event-Driven (asíncrono: eventos)
             └── CQRS + Event Sourcing (lectura/escritura separadas)
```

Idea central: a nivel de sistema decides dos cosas — cómo EMPAQUETAS tu código para desplegarlo, y cómo las piezas SE COMUNICAN entre sí.

```
📌 RECUERDA:
→ Deployment = cuántos artefactos despliegas y cómo
→ Comunicación = cómo se pasan datos las piezas entre sí
→ Son decisiones SEPARADAS que se combinan
```

---

## 3.1 Monolito Clásico

```
  ┌─────────────────────────────────────┐
  │          UN SOLO PROCESO            │
  │                                     │
  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
  │  │Users│ │Order│ │Paym.│ │Notif│  │
  │  │     │ │     │ │     │ │     │  │
  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘  │
  │     └───────┴───────┴───────┘      │
  │          SHARED DATABASE           │
  │          ┌──────────┐              │
  │          │    DB    │              │
  │          └──────────┘              │
  └─────────────────────────────────────┘
         │
         ▼
   1 build, 1 deploy, 1 servidor
```

**Qué es:** Todo el código de la aplicación se compila y despliega como UNA sola unidad. Todos los módulos comparten el mismo proceso y la misma base de datos.

Analogía: una casa unifamiliar. Todo bajo el mismo techo: cocina, dormitorios, baño. Simple de construir, pero si quieres ampliar la cocina puede que tengas que mover el baño.

**La verdad que nadie dice:** la mayoría de proyectos exitosos empezaron como monolito. Netflix, Amazon, Shopify, Twitter... todos nacieron así. Migrar prematuramente a microservicios es uno de los errores más caros en ingeniería.

```
  VENTAJAS                         DESVENTAJAS
  ─────────                        ───────────
  ✓ Simple de desarrollar          ✗ Un cambio = redesplegar TODO
  ✓ Simple de testear (e2e)        ✗ Escalar = escalar TODO
  ✓ Simple de depurar              ✗ Un fallo puede tumbar todo
  ✓ Un solo despliegue             ✗ Con equipos grandes, pisarse
  ✓ Bajo coste operativo           ✗ Se convierte en "bola de barro"
```

**Cuándo usarlo:** MVPs, startups, equipos < 10 personas, validación de producto, lógica no demasiado compleja.

```
📌 RECUERDA:
→ Empieza SIEMPRE por aquí a menos que tengas razones reales para no hacerlo
→ Simple no significa malo: Basecamp factura millones con un monolito
→ El problema no es el monolito, es el monolito MAL diseñado
```

---

## 3.2 Monolito Modular

```
  ┌──────────────────────────────────────────────┐
  │            UN SOLO DESPLIEGUE                 │
  │                                              │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
  │  │ MODULE A │  │ MODULE B │  │ MODULE C │   │
  │  │  Users   │  │  Orders  │  │ Payments │   │
  │  │          │  │          │  │          │   │
  │  │ domain   │  │ domain   │  │ domain   │   │
  │  │ infra    │  │ infra    │  │ infra    │   │
  │  │ api      │  │ api      │  │ api      │   │
  │  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
  │       │              │              │        │
  │       └──── PUBLIC API ─────────────┘        │
  │       (interfaces entre módulos)             │
  │                                              │
  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
  │  │  DB A   │ │  DB B   │ │  DB C   │        │
  │  │(schema) │ │(schema) │ │(schema) │        │
  │  └─────────┘ └─────────┘ └─────────┘        │
  │  (pueden ser schemas separados o tablas      │
  │   con regla estricta: no acceder a datos     │
  │   de otro módulo directamente)               │
  └──────────────────────────────────────────────┘
```

**Qué es:** Un solo despliegue (como un monolito), pero internamente dividido en módulos con fronteras claras. Cada módulo tiene su propio dominio, su propia infraestructura y solo se comunica con otros módulos a través de interfaces públicas bien definidas. Jamás accede directamente a los datos de otro módulo.

Analogía: un edificio de oficinas. Un solo edificio (un despliegue), pero cada planta es una empresa diferente con su propia puerta, sus propias reglas, y se comunican solo por recepción.

**La diferencia clave con un monolito clásico:**

```
  MONOLITO CLÁSICO                 MONOLITO MODULAR
  ────────────────                 ─────────────────

  OrderService                     OrderModule
    ↓                                ↓
  userRepository.findById(1)       userModule.getPublicProfile(1)
  (accede DIRECTO a datos          (pide datos a través de
   de otro dominio)                 interfaz pública)

  ┌────────────────┐               ┌───────────┐  ┌───────────┐
  │ SHARED DB      │               │ Orders DB │  │ Users DB  │
  │ users + orders │               │ (propio)  │  │ (propio)  │
  │ todo mezclado  │               └───────────┘  └───────────┘
  └────────────────┘
```

**¿Por qué es tan popular ahora?** Porque te da el 80% de los beneficios de microservicios (separación, equipos independientes, dominio claro) sin el 80% de la complejidad operativa (red, latencia, deployments independientes, consistencia distribuida).

**Cuándo usarlo:** Equipos de 5-20 personas, lógica compleja que necesita separación clara, cuando quieres preparar el terreno para una posible migración futura a microservicios.

**Ejemplo real:** Shopify migró de monolito clásico a monolito modular y lo ha mantenido así a escala masiva.

```
📌 RECUERDA:
→ Un despliegue + módulos con fronteras ESTRICTAS dentro
→ Cada módulo: su dominio, su BD/schema, su API pública
→ El "sweet spot" para la mayoría de proyectos medianos-grandes
```

---

## 3.3 Microservicios

```
  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
  │Service A│   │Service B│   │Service C│   │Service D│
  │  Users  │   │ Orders  │   │Payments │   │  Notif  │
  │         │   │         │   │         │   │         │
  │  +DB    │   │  +DB    │   │  +DB    │   │  +DB    │
  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
       │              │              │              │
       │    ┌─────────┴──────────────┘              │
       │    │                                       │
       └────┼───────────────────────────────────────┘
            │
  ┌─────────▼──────────┐
  │     API GATEWAY    │  ← Punto de entrada único
  │  (routing, auth)   │
  └─────────┬──────────┘
            │
         Cliente

  Cada servicio:
  ✓ Su propio proceso
  ✓ Su propia base de datos
  ✓ Su propio despliegue
  ✓ Potencialmente su propio lenguaje
  ✓ Su propio equipo responsable
```

**Qué es:** Dividir el sistema en servicios pequeños, independientes y desplegables por separado. Cada servicio es responsable de una capacidad de negocio y se comunica con otros por red (HTTP/REST, gRPC, mensajería).

Analogía: una ciudad con comercios especializados. La panadería, la carnicería y la frutería son negocios independientes. Cada uno tiene su local, su almacén y sus empleados. Si la panadería crece, amplía SU local sin afectar a los demás.

**Lo que NADIE te cuenta en los tutoriales:**

```
  LO QUE GANAS                     LO QUE PAGAS
  ──────────────                    ──────────────
  ✓ Escalar servicio por            ✗ Complejidad de red
    servicio                          (latencia, timeouts, retries)
  ✓ Equipos independientes          ✗ Consistencia de datos
    (cada uno dueño de su             (transacciones distribuidas)
     servicio)                      ✗ Debugging MUY complejo
  ✓ Deploy independiente              (tracing, logs distribuidos)
  ✓ Fallo aislado                   ✗ Coste de infraestructura
    (un servicio cae, el              (Kubernetes, service mesh,
     resto sigue)                      monitoring, CI/CD por servicio)
  ✓ Libertad tecnológica            ✗ Necesitas DevOps maduro
```

**Cuándo usarlos:** Equipos grandes (+20 personas), necesidad real de escalar partes independientes, organización con madurez DevOps, dominio bien entendido con bounded contexts claros.

**Cuándo NO:** Equipos pequeños, startups tempranas, dominio no bien definido, sin infraestructura DevOps.

**Ejemplo real:** Netflix, Amazon, Spotify, Uber.

```
📌 RECUERDA:
→ Cada servicio = su BD + su deploy + su equipo
→ Gran poder, GRAN complejidad operativa
→ La regla de oro: no empieces por microservicios a menos que el dolor lo justifique
```

---

## 3.4 La Evolución Natural

```
  FASE 1              FASE 2                 FASE 3
  Monolito ──────▶  Monolito Modular ──────▶ Microservicios
  Clásico                                    (solo si necesitas)

  ┌─────────┐       ┌──┬──┬──┐              ┌──┐ ┌──┐ ┌──┐
  │ TODO    │       │A │B │C │              │A │ │B │ │C │
  │ JUNTO   │       │  │  │  │              │  │ │  │ │  │
  └─────────┘       └──┴──┴──┘              └──┘ └──┘ └──┘
  1 bloque          1 bloque,               N bloques,
                    N módulos               N despliegues

  Complejidad:  BAJA        MEDIA              ALTA
  Equipos:      1-5         5-20               20+
  Velocidad
  inicial:      ALTA        ALTA               BAJA
```

La mejor práctica en 2025: empieza monolito (o monolito modular), y extrae microservicios SOLO cuando un módulo concreto necesite escalarse independientemente o un equipo distinto quiera autonomía total.

```
📌 RECUERDA:
→ Monolito → Modular → Microservicios es el camino natural
→ No saltes fases: cada una tiene su momento
→ Puedes quedarte en "Monolito Modular" para siempre si funciona
```

---

## 3.5 SOA (Service-Oriented Architecture)

```
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │Service A │  │Service B │  │Service C │
  │ (CRM)    │  │ (ERP)    │  │(Legacy)  │
  └─────┬────┘  └─────┬────┘  └─────┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                ┌──────▼──────┐
                │     ESB     │  Enterprise Service Bus
                │             │
                │ - Routing   │  "Controlador de tráfico"
                │ - Transform │  que dirige, transforma
                │ - Orchestr. │  y orquesta mensajes
                └─────────────┘
```

**Qué es:** Organizar el sistema como servicios reutilizables que se comunican a través de un bus centralizado (ESB). El ESB es el cerebro que enruta, transforma y orquesta la comunicación.

Analogía: una centralita telefónica de los 90. Todos los departamentos llaman a la centralita, y la operadora redirige al destino correcto, traduciendo si es necesario.

**SOA vs Microservicios — la evolución:**

```
  SOA (2000s)                      MICROSERVICIOS (2010s)
  ──────────                       ──────────────────────
  Bus centralizado (ESB)           Comunicación descentralizada
  Servicios GRANDES                Servicios PEQUEÑOS
  Contratos formales (WSDL/SOAP)   APIs ligeras (REST/gRPC)
  Gobernanza top-down              Equipos autónomos
  Integrar sistemas legacy         Construir sistemas nuevos

  Microservicios = la evolución de SOA
  sin el cuello de botella del ESB
```

**Cuándo usarlo:** Grandes empresas que necesitan integrar sistemas legacy heterogéneos (bancos, aseguradoras, gobierno).

**Cuándo NO:** Proyectos nuevos. Hoy se prefiere microservicios o event-driven.

```
📌 RECUERDA:
→ SOA = servicios + bus central (ESB) como orquestador
→ Microservicios heredaron las buenas ideas de SOA sin el ESB
→ SOA sigue vivo en enterprise legacy, no en proyectos greenfield
```

---

## 3.6 Serverless

```
  EVENTO                  CLOUD PROVIDER
  ──────                  ──────────────
  HTTP request ──┐
  Timer ─────────┤        ┌─────────────────────┐
  Queue msg ─────┼───────▶│   TU FUNCIÓN        │──▶ Resultado
  DB change ─────┤        │   (solo tu código)  │
  File upload ───┘        └─────────────────────┘
                                   │
                          El cloud gestiona:
                          ✓ Servidores
                          ✓ Escalado (0 → miles → 0)
                          ✓ Disponibilidad
                          ✓ Pago por ejecución (ms)

  Tú escribes funciones.
  No gestionas NADA de infraestructura.
```

**Qué es:** Escribes funciones que se ejecutan en respuesta a eventos. El proveedor cloud (AWS Lambda, Azure Functions, Google Cloud Functions) gestiona toda la infraestructura. Pagas solo por el tiempo de ejecución, literalmente por milisegundo.

Analogía: un taxi vs comprar coche. No pagas seguro, aparcamiento ni mantenimiento. Llamas al taxi cuando lo necesitas, y pagas solo el viaje.

```
  VENTAJAS                          DESVENTAJAS
  ─────────                         ───────────
  ✓ Cero gestión de servidores      ✗ Cold starts (latencia inicial)
  ✓ Escala automática (a 0 y a ∞)   ✗ Vendor lock-in (atado a AWS/GCP)
  ✓ Pagas solo lo que usas          ✗ Límites de ejecución (timeouts)
  ✓ Ideal para tráfico variable     ✗ Debugging más difícil
  ✓ Velocidad de desarrollo         ✗ Lógica compleja se fragmenta
```

**Cuándo usarlo:** APIs con tráfico variable, procesamiento de eventos (subida de imágenes, webhooks), tareas programadas, backends de apps móviles.

**Cuándo NO:** Apps con latencia crítica, lógica de negocio muy compleja y entrelazada, necesidad de control fino de la infra.

```
📌 RECUERDA:
→ Sin servidores, solo escribes funciones
→ Ideal para tráfico impredecible y tareas event-driven
→ Cold starts + vendor lock-in son los trade-offs principales
```

---

## 3.7 Event-Driven Architecture (EDA)

```
  ┌──────────┐                                  ┌──────────┐
  │ PRODUCER │   Evento                          │CONSUMER A│
  │ (Order   │──"OrderCreated"──┐                │(Inventory│
  │  Service)│                  │                │  Service)│
  └──────────┘                  ▼                └──────────┘
                         ┌──────────────┐              ▲
                         │  EVENT BUS   │──────────────┘
                         │              │
                         │ Kafka        │──────────────┐
                         │ RabbitMQ     │              ▼
                         │ SQS/SNS      │        ┌──────────┐
                         └──────────────┘        │CONSUMER B│
                                                 │(Email    │
                                                 │ Service) │
                                                 └──────────┘

  REGLAS:
  1. El Producer NO sabe quién consume
  2. El Consumer NO sabe quién produce
  3. Solo saben del EVENTO (el contrato)
  4. La comunicación es ASÍNCRONA
```

**Qué es:** Los componentes se comunican emitiendo y reaccionando a eventos, no llamándose directamente. Un evento = "algo pasó" (un hecho inmutable). Quien lo emite no sabe ni le importa quién lo consume.

Analogía: un tablón de anuncios. Alguien cuelga un anuncio ("se ha creado un pedido"), y cualquiera interesado lo lee y actúa por su cuenta. El que lo cuelga no necesita saber quién lo lee.

**Los dos modelos principales:**

```
  CHOREOGRAPHY (coreografía)         ORCHESTRATION (orquestación)
  ────────────────────────           ──────────────────────────

  Cada servicio reacciona            Un "director" coordina
  por su cuenta a eventos.           el flujo de los servicios.

  A ──evento──▶ B                    Director ──▶ A
  B ──evento──▶ C                    Director ──▶ B
  C ──evento──▶ D                    Director ──▶ C

  ✓ Más desacoplado                  ✓ Flujo más visible
  ✗ Flujo difícil de rastrear        ✗ Director = punto de fallo
```

**Cuándo usarlo:** Sistemas en tiempo real, comunicación entre microservicios, procesamiento asíncrono, cuando necesitas desacoplar servicios al máximo.

**Cuándo NO:** Operaciones que necesitan respuesta inmediata, sistemas simples, equipos sin experiencia en sistemas distribuidos.

**Ejemplo real:** Sistemas de trading, procesamiento de pedidos (Amazon), notificaciones en tiempo real.

```
📌 RECUERDA:
→ Productor emite, Consumidor reacciona, no se conocen
→ Desacoplamiento máximo + procesamiento asíncrono
→ Trade-off: debugging y trazabilidad se complican mucho
```

---

## 3.8 CQRS + Event Sourcing

```
  CQRS (Command Query Responsibility Segregation)
  ────────────────────────────────────────────────

                ┌───────────┐
                │  Cliente   │
                └─────┬─────┘
                      │
           ┌──────────┴──────────┐
           │                     │
     ┌─────▼──────┐        ┌────▼──────┐
     │  COMMAND    │        │   QUERY   │
     │  (Escribe)  │        │   (Lee)   │
     │             │        │           │
     │ - Validar   │        │ - Buscar  │
     │ - Procesar  │        │ - Filtrar │
     │ - Guardar   │        │ - Paginar │
     └─────┬──────┘        └────┬──────┘
           │                     │
     ┌─────▼──────┐        ┌────▼──────┐
     │  WRITE DB  │──sync──▶│  READ DB  │
     │ (normaliz.) │  async │(desnormal.)│
     └────────────┘        └───────────┘
```

**Qué es CQRS:** Separar las operaciones de escritura (commands) de las de lectura (queries) en modelos completamente diferentes, incluso bases de datos diferentes. Cada lado se optimiza para su propósito.

Analogía: en un restaurante, la cocina (escritura) tiene una organización muy diferente al mostrador de entrega (lectura). Si los metes en el mismo espacio, se estorban.

**Qué es Event Sourcing:**

```
  SIN Event Sourcing (lo normal):

  Estado actual:  { saldo: 150 }  ← solo sabes el "ahora"

  CON Event Sourcing:

  Evento 1:  CuentaCreada       { saldo_inicial: 0 }
  Evento 2:  DineroDepositado   { cantidad: 200 }
  Evento 3:  DineroRetirado     { cantidad: 50 }
  ─────────────────────────────────────────────
  Estado actual = reproducir todos los eventos = 150

  Nunca borras ni modificas. Solo AGREGAS eventos.
  Puedes reconstruir el estado de CUALQUIER momento.
```

**CQRS + Event Sourcing juntos:**

```
  Command ──▶ Validate ──▶ Store EVENT ──▶ Event Bus
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼──────┐        ┌────▼──────┐
              │ Event Store│        │ Read Model│
              │(immutable) │──────▶ │(projection)│
              │ Evento 1   │  async │           │
              │ Evento 2   │        │ Vista     │
              │ Evento 3   │        │ optimizada│
              └────────────┘        └───────────┘
```

**Cuándo usarlo:** Sistemas donde las lecturas son mucho más frecuentes que las escrituras, auditoría completa necesaria, reconstrucción de estado, modelos de lectura y escritura muy diferentes.

**Cuándo NO:** CRUDs simples, equipos sin experiencia en eventual consistency.

```
📌 RECUERDA:
→ CQRS: separa escritura de lectura para optimizar cada lado
→ Event Sourcing: guarda CADA cambio como evento inmutable
→ Juntos son poderosos pero MUY complejos — úsalos solo cuando el beneficio es claro
```

---

## 3.9 Mapa de Decisión — ¿Cuál Elegir?

```
  ¿Cuál es tu situación?
           │
  Equipo pequeño, producto nuevo,
  validando idea ─────────────────────────▶ MONOLITO CLÁSICO
           │
  Equipo medio, lógica compleja,
  quiero separación sin complejidad
  operativa ──────────────────────────────▶ MONOLITO MODULAR
           │
  Equipos grandes, necesidad real de
  escalar partes independientes,
  DevOps maduro ──────────────────────────▶ MICROSERVICIOS
           │
  Integrar sistemas legacy enterprise ────▶ SOA
           │
  Tráfico impredecible, tareas
  event-driven, cero gestión infra ───────▶ SERVERLESS
           │
  ¿Cómo se comunican los servicios?
           │
  ├── Respuesta inmediata necesaria ──────▶ REQUEST/RESPONSE (REST, gRPC)
  ├── Desacoplamiento máximo,
  │   procesamiento asíncrono ────────────▶ EVENT-DRIVEN
  └── Lecturas >>> escrituras,
      auditoría total necesaria ──────────▶ CQRS + EVENT SOURCING
```

**Combinaciones del mundo real:**

```
  ┌──────────────────────────────────────────────────────┐
  │  Microservicios + Event-Driven + CQRS                │
  │  (Netflix, Uber — máxima escala)                     │
  │                                                      │
  │  Monolito Modular + Clean Architecture               │
  │  (Shopify — escala masiva, complejidad controlada)   │
  │                                                      │
  │  Serverless + Event-Driven                           │
  │  (Startups cloud-native, procesamiento de datos)     │
  │                                                      │
  │  Monolito + Layered                                  │
  │  (MVPs, la mayoría de apps que empiezan)             │
  └──────────────────────────────────────────────────────┘
```

---

**Resumen Ejecutivo — Sección 3**

```
┌──────────────────────────────────────────────────────────┐
│  ARQUITECTURA DE SISTEMAS — Lo esencial                  │
│                                                          │
│  1. Monolito: 1 bloque, simple, barato.                  │
│     El punto de partida correcto.                        │
│                                                          │
│  2. Monolito Modular: 1 despliegue + módulos aislados.   │
│     El "sweet spot" para la mayoría.                     │
│                                                          │
│  3. Microservicios: N servicios independientes.           │
│     Máxima flexibilidad, máxima complejidad.             │
│                                                          │
│  4. SOA: servicios + ESB central. El abuelo de micro.    │
│                                                          │
│  5. Serverless: funciones sin servidor. Ideal para       │
│     tráfico variable y event-driven.                     │
│                                                          │
│  6. Event-Driven: comunicación por eventos asíncronos.   │
│     Desacoplamiento total, debugging complejo.           │
│                                                          │
│  7. CQRS + Event Sourcing: lectura y escritura           │
│     separadas + historial inmutable de todo.             │
│                                                          │
│  PRINCIPIO UNIVERSAL: empieza simple, complejiza         │
│  solo cuando el DOLOR real lo justifique.                │
└──────────────────────────────────────────────────────────┘
```

---

# Dudas y Aclaraciones sobre Arquitectura de Software — Notas Personales

---

## DUDA 1: Arquitectura de Código vs Arquitectura de Sistema

```
  ARQUITECTURA DE SOFTWARE
           │
           ├── ARQUITECTURA DE CÓDIGO
           │   "¿Cómo organizo el código DENTRO de una app?"
           │
           │   - Layered (N-Layer)
           │   - Hexagonal (Ports & Adapters)
           │   - Clean Architecture
           │   - Pipe & Filter
           │   - MVC / MVP / MVVM
           │
           └── ARQUITECTURA DE SISTEMA
               "¿Cómo organizo y despliego los SERVICIOS?"

               - Monolito
               - Monolito Modular
               - Microservicios
               - Serverless
               - SOA
               - 3-Tier
```

Son dos decisiones DIFERENTES que se toman a distinto nivel:

- Arquitectura de sistema = el "plano de la ciudad" (edificios y calles)
- Arquitectura de codigo = el "plano de cada edificio" (habitaciones y pasillos)

Se combinan libremente. Puedes tener Microservicios (sistema) donde cada servicio usa Clean Architecture (codigo). O un Monolito (sistema) con Hexagonal (codigo) dentro.

```
  Ejemplo de combinacion:

  ┌──────────────────────────────────────┐
  │  SISTEMA: Microservicios             │
  │                                      │
  │  ┌────────────┐   ┌────────────┐     │
  │  │ Service A  │   │ Service B  │     │
  │  │ (Clean     │   │ (Hexagonal │     │
  │  │  Arch)     │   │  Arch)     │     │
  │  └────────────┘   └────────────┘     │
  │                                      │
  │  CODIGO: cada servicio tiene su      │
  │  propia arquitectura interna         │
  └──────────────────────────────────────┘
```

```
RECUERDA:
→ Son dos niveles INDEPENDIENTES de decision
→ Sistema = como DESPLIEGAS (1 bloque o muchos)
→ Codigo = como ORGANIZAS el codigo dentro de cada pieza
```

---

## DUDA 2: ¿Donde encaja DDD?

```
  DDD (Domain-Driven Design)
           │
           │  NO es una arquitectura.
           │  Es una METODOLOGIA de diseno.
           │
           │  Tiene dos partes:
           │
           ├── STRATEGIC DESIGN
           │   "¿Como divido el sistema en partes?"
           │   - Bounded Contexts (fronteras del dominio)
           │   - Ubiquitous Language (lenguaje compartido)
           │   - Context Maps
           │         │
           │         └──▶ Impacta ARQUITECTURA DE SISTEMA
           │              (cada Bounded Context = 1 modulo o 1 servicio)
           │
           └── TACTICAL DESIGN
               "¿Como modelo el codigo dentro de cada parte?"
               - Entities, Value Objects
               - Aggregates, Domain Events
               - Repositories, Domain Services
                     │
                     └──▶ Impacta ARQUITECTURA DE CODIGO
                          (vive dentro de la capa de dominio)
```

DDD es el PUENTE entre los dos niveles. El Strategic te dice donde cortar el sistema. El Tactical te dice como organizar el codigo dentro de cada corte.

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  DDD Strategic ──▶ Bounded Context "Orders"  │
  │                         │                    │
  │                    se convierte en:           │
  │                    - 1 microservicio, O       │
  │                    - 1 modulo del monolito    │
  │                         │                    │
  │  DDD Tactical ──▶ Dentro: Entities, VOs,     │
  │                    Aggregates organizados     │
  │                    con Clean/Hexagonal        │
  │                                              │
  └──────────────────────────────────────────────┘
```

```
RECUERDA:
→ DDD = metodologia, NO arquitectura
→ Strategic DDD define los LIMITES (Bounded Contexts)
→ Tactical DDD define como MODELAR dentro de cada limite
```

---

## DUDA 3: 3-Tier, Client-Server y estilos arquitectonicos

```
  NIVEL DE ABSTRACCION
  ════════════════════

  ALTO    ┌──────────────────────────────────┐
          │  ESTILO ARQUITECTONICO           │
          │  "La filosofia general"           │
          │                                  │
          │  Client-Server, Peer-to-Peer,    │
          │  Event-Driven, REST              │
          └──────────────┬───────────────────┘
                         │
                         │  se implementa con
                         ▼
  BAJO    ┌──────────────────────────────────┐
          │  PATRON ARQUITECTONICO           │
          │  "La solucion concreta"          │
          │                                  │
          │  3-Tier, Microservicios,         │
          │  Monolito Modular, Serverless    │
          └──────────────────────────────────┘
```

**Client-Server** es un estilo (una filosofia: uno pide, otro responde). No es algo que "eliges", es el agua donde nadan todos los peces de la web moderna. 3-Tier, Microservicios, Serverless... todos son Client-Server.

**3-Tier** es un patron concreto que implementa Client-Server con 3 niveles FISICOS:

```
  Client-Server (estilo) implementado como:

  2-Tier:  [Client] ◄──► [Server+DB]
           (app antigua tipo Access)

  3-Tier:  [Client] ◄──► [Server] ◄──► [DB]
           (la web moderna estandar)

  N-Tier:  [Client] ◄► [API GW] ◄► [Services] ◄► [DB]
           (microservicios)
```

**Y la diferencia CLAVE: Layer vs Tier:**

```
  LAYER = separacion LOGICA (dentro del codigo)
          Carpetas/proyectos en el mismo servidor.

  TIER  = separacion FISICA (maquinas diferentes)
          Cada nivel corre en su propia maquina.

  /presentation  ┐
  /business      ├── N-Layer (1 maquina, 3 carpetas)
  /data-access   ┘

  [Browser] ──► [API Server] ──► [DB Server]
     Tier 1        Tier 2          Tier 3
     (3 maquinas diferentes)
```

No merecen seccion propia. Los estilos ya estan cubiertos en la teoria (Seccion 1.4) y sus implementaciones concretas en las Secciones 2 y 3.

```
RECUERDA:
→ Client-Server = estilo (filosofia), 3-Tier = patron (solucion)
→ Layer = logico (codigo), Tier = fisico (maquinas)
→ Casi toda app web moderna ya ES 3-Tier por defecto
```

---

## DUDA 4: ¿Que es realmente un monolito?

```
  LO QUE PARECE QUE SIGNIFICA:         LO QUE REALMENTE SIGNIFICA:
  ═════════════════════════════         ════════════════════════════

  ┌──────────────────────────┐          Monolito = tu APLICACION
  │  1 SERVIDOR              │          (normalmente el backend)
  │  Front + Back + BD       │          es 1 SOLO artefacto
  │  todo en la misma caja   │          desplegable.
  └──────────────────────────┘
                                        NO importa DONDE corre.
  ❌ NO es esto                         NO importa cuantos servidores.
```

Tu setup (Vercel + Azure + Atlas) se define asi:

```
  ┌──────────┐         ┌──────────────┐        ┌────────┐
  │ Next.js  │──JSON──▶│   API        │──────▶  │MongoDB │
  │ Frontend │◀────────│   Backend    │◀──────  │        │
  │ (Vercel) │         │(Azure W.App) │        │(Atlas) │
  └──────────┘         └──────────────┘        └────────┘
   Maquina 1            Maquina 2               Maquina 3

  INFRAESTRUCTURA: 3-Tier (3 maquinas separadas)
  APLICACION:      Backend monolito (1 API con toda la logica)

  Las dos cosas COEXISTEN.
```

**Lo que determina si es monolito o micro:**

```
  ¿Tu BACKEND es 1 app o varias?

  1 app con todo:
  /api/users    ┐
  /api/orders   ├── 1 proceso, 1 deploy = MONOLITO
  /api/content  ┘

  Varias apps separadas:
  Azure Web App 1: /api/users    (su propio deploy)
  Azure Web App 2: /api/orders   (su propio deploy)
  = MICROSERVICIOS
```

**La evolucion historica del termino:**

```
  ANTES (2000s):                    AHORA (2025):
  ──────────────                    ─────────────

  ┌───────────────────┐             ┌────────┐ ┌────────┐ ┌──────┐
  │ 1 SERVIDOR        │             │Frontend│ │Backend │ │  BD  │
  │ PHP + HTML + MySQL│             │Vercel  │ │Azure   │ │Atlas │
  │ Todo junto        │             └────────┘ └────────┘ └──────┘
  └───────────────────┘             Separados fisicamente.
  "Monolito" = todo                 "Monolito" = el backend
  en una caja literal               es 1 sola app.
```

En 2025, cuando alguien dice "monolito" sin mas contexto, SIEMPRE se refiere al backend. Aunque el frontend monolito y micro-frontends tambien existen, son conversaciones mucho mas raras.

```
RECUERDA:
→ Monolito = la APP es 1 artefacto desplegable, no que todo este en 1 servidor
→ En 2025 "monolito" = hablar del backend, siempre
→ Vercel + Azure + Atlas = 3-Tier (infra) + monolito backend (app)
→ Lo que determina monolito vs micro = si el BACKEND es 1 deploy o varios
```

---

## DUDA 5: Clean vs Hexagonal + Reglas vs Logica vs Orquestacion

### Parte A: Clean vs Hexagonal

```
  HEXAGONAL (2005, Cockburn)           CLEAN (2012, Uncle Bob)
  ════════════════════════             ════════════════════════

  Define 3 conceptos:                  Define 4 capas:
  - Core                              - Entities
  - Ports (interfaces)                - Use Cases
  - Adapters (implementaciones)       - Interface Adapters
                                      - Frameworks & Drivers

  Regla:                               Regla:
  "Core no depende de nada"            "Dependencias apuntan adentro"
  (= LO MISMO)                        (= LO MISMO)

  MINIMALISTA                          PRESCRIPTIVA
  (tu decides como                     (te dice que va
   organizar el core)                   en cada capa)
```

La diferencia practica que importa:

```
  HEXAGONAL:
  ──────────
  El core es una caja negra:
  ┌──────────────────────┐
  │       CORE           │
  │  ¿Como lo organizo?  │
  │  No me dice.         │
  └──────────────────────┘

  CLEAN:
  ──────
  El core se divide EXPLICITAMENTE en dos:
  ┌──────────────────────┐
  │  ENTITIES            │  ← Reglas de negocio puras
  │  "pedido no puede    │
  │   ser negativo"      │
  ├──────────────────────┤
  │  USE CASES           │  ← Logica de la aplicacion
  │  "crear pedido:      │
  │   validar, calcular, │
  │   guardar"           │
  └──────────────────────┘

  Clean OBLIGA a separar reglas de negocio
  de los flujos de la app. Hexagonal no te obliga.
```

En la practica, todo el mundo mezcla: toman ports/adapters de Hexagonal + capas entities/use cases de Clean.

### Parte B: Reglas vs Logica vs Orquestacion

```
  Controller (recibe peticion)
       │
       ▼
  ORQUESTACION ──── "Llama a Use Case, luego a Payment,
       │              luego a Notifications"
       │              Coordina el flujo. Sin logica propia.
       ▼
  LOGICA DE NEGOCIO ── "Valida stock, calcula total,
       │                 aplica descuento, guarda pedido"
       │                 El proceso de la aplicacion.
       ▼
  REGLAS DE NEGOCIO ── "Total no puede ser negativo.
                        Descuento maximo 50%.
                        Menores no compran alcohol."
                        Verdades del dominio. Existen sin software.
```

Ejemplo con codigo:

```
  REGLA DE NEGOCIO (Entity):
  ──────────────────────────
  class Order {
    constructor(items) {
      this.total = items.reduce((s, i) => s + i.price, 0)
      if (this.total < 0)
        throw new Error("Total no puede ser negativo") // REGLA
    }
  }

  LOGICA DE NEGOCIO (Use Case):
  ─────────────────────────────
  class CreateOrderUseCase {
    execute(userId, items) {
      const user = this.userRepo.findById(userId)
      const order = new Order(items)       // entity se valida sola
      this.orderRepo.save(order)
      return order
    }
  }

  ORQUESTACION (Orchestrator/App Service):
  ────────────────────────────────────────
  class PurchaseFlow {
    execute(userId, items, paymentInfo) {
      const order = this.createOrder.execute(userId, items)
      this.payment.charge(paymentInfo, order.total)
      this.email.sendConfirmation(userId, order)
    }
  }
```

El problema clasico: el "Service gigante" que mezcla los tres es el sintoma de no separar. Clean Architecture te ensena a ponerlos cada uno en su sitio.

```
  ┌──────────────┬──────────────────┬──────────────┬──────────────┐
  │              │ REGLAS           │ LOGICA       │ ORQUESTACION │
  ├──────────────┼──────────────────┼──────────────┼──────────────┤
  │ Depende      │ NO. Existe sin   │ SI. Es como  │ SI. Es como  │
  │ de la app?   │ software.        │ la app usa   │ se conectan  │
  │              │                  │ las reglas.  │ servicios.   │
  ├──────────────┼──────────────────┼──────────────┼──────────────┤
  │ Donde vive   │ Entity (centro)  │ Use Case     │ App Service  │
  │ en Clean     │                  │              │ (borde)      │
  ├──────────────┼──────────────────┼──────────────┼──────────────┤
  │ Cambia       │ Casi NUNCA       │ Cuando       │ Cuando       │
  │ cuando...    │                  │ cambian      │ anades/quitas│
  │              │                  │ requisitos   │ servicios    │
  └──────────────┴──────────────────┴──────────────┴──────────────┘
```

```
RECUERDA:
→ Clean = Hexagonal + capas explicitas dentro del core (Entities vs Use Cases)
→ Reglas de negocio = verdades del dominio (Entity). Existen sin software.
→ Logica de negocio = proceso de la app (Use Case). Usa las reglas.
→ Orquestacion = coordinar servicios (Orchestrator). No tiene logica propia.
→ El "Service gigante" es el sintoma de mezclar los tres.
```

---

## DUDA 6: ¿Que es lo mas importante que debo dominar?

```
  PRIORIDADES PARA ROL SENIOR AI/FULL STACK ENGINEER
  ══════════════════════════════════════════════════

  TIER 1 — DOMINAR (aplicar con los ojos cerrados)
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ★ Clean / Hexagonal Architecture            │
  │    → Crear proyecto desde 0 con esta         │
  │      estructura                              │
  │    → Explicar en 2 minutos en entrevista     │
  │                                              │
  │  ★ Monolito vs Modular vs Microservicios     │
  │    → Argumentar cuando usar cada uno         │
  │    → Dibujar la evolucion natural            │
  │                                              │
  │  ★ DDD Strategic (Bounded Contexts)          │
  │    → Identificar BCs en un dominio           │
  │    → Mapear BC a modulo o servicio            │
  │                                              │
  └──────────────────────────────────────────────┘

  TIER 2 — CONOCER BIEN (explicar en entrevista)
  ┌──────────────────────────────────────────────┐
  │  ★ Event-Driven Architecture                 │
  │  ★ CQRS                                      │
  │  ★ Layered / N-Tier                          │
  │  ★ Serverless                                │
  └──────────────────────────────────────────────┘

  TIER 3 — SABER QUE EXISTE (mencionar con criterio)
  ┌──────────────────────────────────────────────┐
  │  ★ SOA                                       │
  │  ★ Pipe & Filter                             │
  │  ★ Event Sourcing                            │
  │  ★ MVC / MVP / MVVM                          │
  │  ★ Onion Architecture                        │
  └──────────────────────────────────────────────┘
```

```
  MAPA DE IMPACTO:

  ENTREVISTAS ▲
              │
              │  ★ Clean/Hexagonal    ★ Monolito vs Micro
              │                  \       /
              │                   ★ DDD
              │
              │        ★ Event-Driven
              │                 ★ CQRS
              │
              │    ★ Layered       ★ Serverless
              │
              │  ★ SOA   ★ Pipe&Filter   ★ MVC
              │
              └──────────────────────────────────▶ DIA A DIA
```

```
RECUERDA:
→ Clean/Hexagonal + Monolito vs Micro + DDD = el 80% del valor
→ En entrevistas senior buscan CRITERIO para elegir, no definiciones
→ La pregunta de oro siempre es: "¿por que elegirias X y no Y?"
```

---

## RESUMEN EJECUTIVO — Todas las dudas en 30 segundos

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  1. Codigo vs Sistema = dos decisiones INDEPENDIENTES    │
│     que se combinan libremente                           │
│                                                          │
│  2. DDD = METODOLOGIA (no arquitectura), es el puente    │
│     entre codigo y sistema via Bounded Contexts          │
│                                                          │
│  3. Layer = logico (codigo), Tier = fisico (maquinas)    │
│     Client-Server = estilo, 3-Tier = patron              │
│                                                          │
│  4. Monolito = el BACKEND es 1 deploy, no que todo       │
│     este en 1 servidor. Tu setup con Vercel+Azure+Atlas  │
│     = 3-Tier + backend monolito                          │
│                                                          │
│  5. Clean = Hexagonal + capas explicitas.                 │
│     Reglas (Entity) > Logica (Use Case) > Orquestacion   │
│     El "Service gigante" = sintoma de mezclarlos          │
│                                                          │
│  6. Dominar: Clean/Hexa + Monolito vs Micro + DDD        │
│     El resto es contexto que enriquece esos 3 pilares    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Onion Architecture (Jeffrey Palermo, 2008)

```
  ┌───────────────────────────────────────────┐
  │          INFRASTRUCTURE                   │
  │  (BD, APIs externas, frameworks, UI)      │
  │    ┌───────────────────────────────────┐  │
  │    │      APPLICATION SERVICES         │  │
  │    │  (orquestacion de casos de uso)   │  │
  │    │    ┌───────────────────────────┐  │  │
  │    │    │    DOMAIN SERVICES        │  │  │
  │    │    │  (logica entre entities)  │  │  │
  │    │    │    ┌───────────────────┐  │  │  │
  │    │    │    │   DOMAIN MODEL   │  │  │  │
  │    │    │    │                   │  │  │  │
  │    │    │    │  Entities         │  │  │  │
  │    │    │    │  Value Objects    │  │  │  │
  │    │    │    │  Interfaces       │  │  │  │
  │    │    │    └───────────────────┘  │  │  │
  │    │    └───────────────────────────┘  │  │
  │    └───────────────────────────────────┘  │
  └───────────────────────────────────────────┘

  Regla: dependencias SOLO apuntan hacia adentro.
  (la misma regla que Hexagonal y Clean)
```

**Las 4 capas de Onion:**

```
  DOMAIN MODEL (centro)
  │  Entities, Value Objects, interfaces de repos.
  │  Las reglas de negocio MAS puras.
  │  No depende de NADA.
  │
  DOMAIN SERVICES
  │  Logica de negocio que involucra
  │  MULTIPLES entities y no pertenece a una sola.
  │  Ej: "CalcularPrecioConDescuento" que necesita
  │      Order + User + DiscountPolicy
  │
  APPLICATION SERVICES
  │  Orquestacion de casos de uso.
  │  Coordina Domain Services y entities
  │  para resolver un flujo completo.
  │  Ej: "CrearPedido" → validar → calcular → guardar
  │
  INFRASTRUCTURE (exterior)
     Todo lo concreto: BD, frameworks, UI, APIs.
     Implementa las interfaces del centro.
```

## La comparacion directa de las 3 primas

```
  ┌──────────────┬───────────────┬───────────────┬───────────────┐
  │              │  HEXAGONAL    │    ONION       │    CLEAN      │
  │              │  (2005)       │    (2008)      │    (2012)     │
  ├──────────────┼───────────────┼───────────────┼───────────────┤
  │ Capas del    │ "Core"        │ Domain Model  │ Entities      │
  │ centro       │ (no las       │ Domain Servs  │ Use Cases     │
  │              │  detalla)     │ App Services  │               │
  ├──────────────┼───────────────┼───────────────┼───────────────┤
  │ Capas de     │ Adapters      │Infrastructure │ Interf.Adapt  │
  │ fuera        │               │               │ Framew&Driv   │
  ├──────────────┼───────────────┼───────────────┼───────────────┤
  │ Vocabulario  │ Ports         │ Interfaces    │ Interfaces    │
  │ para los     │ Adapters      │ (en Domain    │ (en Use Case  │
  │ contratos    │               │  Model)       │  layer)       │
  ├──────────────┼───────────────┼───────────────┼───────────────┤
  │ Lo que       │ Desacoplar    │ Capas como    │ Formalizar    │
  │ ANADE        │ core del      │ una cebolla   │ con Depend.   │
  │ respecto     │ exterior      │ + Domain      │ Rule + 4      │
  │ al anterior  │ (el original) │ Services      │ capas claras  │
  │              │               │ como capa     │               │
  └──────────────┴───────────────┴───────────────┴───────────────┘
```

## Lo que Onion anade que las otras no

```
  La capa de DOMAIN SERVICES.
  ═══════════════════════════

  Hexagonal: no distingue. Todo es "core".
  Clean: tiene Use Cases pero no Domain Services explicitos.
  Onion: separa EXPLICITAMENTE:

  ┌──────────────────────────────────────────┐
  │                                          │
  │  Domain Model = reglas de UNA entity     │
  │  "Un pedido no puede ser negativo"       │
  │                                          │
  │  Domain Services = reglas que CRUZAN     │
  │  multiples entities                      │
  │  "Calcular precio final necesita Order   │
  │   + User + DiscountPolicy + TaxRules"    │
  │                                          │
  │  Application Services = orquestacion     │
  │  "Crear pedido: llamar a esto,           │
  │   luego a esto, luego guardar"           │
  │                                          │
  └──────────────────────────────────────────┘

  En la practica, Clean Architecture absorbe
  los Domain Services dentro de los Use Cases
  o dentro de las Entities.
  Onion los hace una capa EXPLICITA.
```
