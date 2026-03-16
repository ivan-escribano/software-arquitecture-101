## Plan de Práctica — De lo Esencial a lo Extra

```
  ESTRUCTURA DEL PLAN
  ═══════════════════

  FASE 1 ──▶ Clean/Hexagonal (2 semanas)         TIER 1
  FASE 2 ──▶ Monolito vs Modular vs Micro (1 sem) TIER 1
  FASE 3 ──▶ DDD Strategic (1 semana)             TIER 1
  FASE 4 ──▶ Event-Driven + CQRS (1-2 semanas)   TIER 2
  FASE 5 ──▶ Extras (ongoing)                     TIER 3

  METODO POR FASE:
  Teoria ──▶ Construir ──▶ Explicar en voz alta
  (ya la     (proyecto     (si no lo explicas
   tienes)    real)         en 2 min, no lo sabes)
```

---

## FASE 1: Clean / Hexagonal (semanas 1-2)

```
  OBJETIVO: Construir un proyecto desde 0
  con Clean/Hexagonal en tu stack real.
  Al final debes poder CAMBIAR la BD
  sin tocar el dominio.
```

### Ejercicio 1.1 — Proyecto "Task Manager API"

```
  Stack: Node.js + TypeScript (o Next.js API Routes)
  BD: empezar SIN base de datos (en memoria)

  Estructura OBLIGATORIA:

  /src
    /domain
      task.entity.ts             ← reglas de negocio
      task.repository.ts         ← interfaz (PORT)

    /application
      create-task.use-case.ts    ← logica de negocio
      complete-task.use-case.ts
      get-tasks.use-case.ts

    /infrastructure
      /persistence
        in-memory-task.repo.ts   ← adapter (implementa interfaz)
        mongo-task.repo.ts       ← otro adapter (mismo port)
      /http
        task.controller.ts       ← adapter de entrada

    main.ts                      ← wiring (conecta todo)
```

**Las 3 reglas que NO puedes romper:**

```
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  1. /domain NO importa NADA de fuera.                │
  │     Cero imports de /infrastructure o /application.  │
  │                                                      │
  │  2. /application solo importa de /domain.            │
  │                                                      │
  │  3. /infrastructure importa de ambos                 │
  │     (implementa las interfaces del domain).          │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

**El flujo paso a paso de lo que construyes:**

```
  Semana 1, dia 1-2:
  ──────────────────
  1. Crear task.entity.ts con reglas:
     - titulo no puede estar vacio
     - titulo maximo 100 caracteres
     - task se crea siempre en estado "pending"

  2. Crear task.repository.ts (solo la INTERFAZ):
     - save(task): Promise<void>
     - findById(id): Promise<Task | null>
     - findAll(): Promise<Task[]>

  3. Crear InMemoryTaskRepository
     (implementa interfaz con un array en memoria)

  Semana 1, dia 3-4:
  ──────────────────
  4. Crear CreateTaskUseCase:
     - recibe titulo
     - crea Task (entity se valida sola)
     - guarda via repository (interfaz)

  5. Crear GetTasksUseCase y CompleteTaskUseCase

  6. Crear TaskController (Express o similar)
     que llama a los use cases

  Semana 1, dia 5:
  ────────────────
  7. Conectar todo en main.ts:
     const repo = new InMemoryTaskRepository()
     const createTask = new CreateTaskUseCase(repo)
     const controller = new TaskController(createTask)

  Probar con Postman/curl. Funciona sin BD.
```

### Ejercicio 1.2 — El test que DEMUESTRA que funciona

```
  Semana 2, dia 1-2:
  ──────────────────
  Escribir tests para Use Cases usando InMemoryRepo:

  create-task.use-case.test.ts:
  - Crear con titulo valido → OK
  - Crear con titulo vacio → Error
  - Crear con titulo > 100 chars → Error

  complete-task.use-case.test.ts:
  - Completar task existente → status = "done"
  - Completar task que no existe → Error
  - Completar task ya completada → Error

  ┌──────────────────────────────────────────────┐
  │  Si puedes correr TODOS los tests            │
  │  sin MongoDB, sin Express, sin HTTP,         │
  │  sin Docker, sin NADA externo...             │
  │                                              │
  │  ══▶ Tu arquitectura esta BIEN.              │
  └──────────────────────────────────────────────┘
```

### Ejercicio 1.3 — La prueba de fuego

```
  Semana 2, dia 3-4:
  ──────────────────
  Crear MongoTaskRepository que implementa
  la MISMA interfaz task.repository.ts.

  Cambiar en main.ts:
  - const repo = new InMemoryTaskRepository()
  + const repo = new MongoTaskRepository(mongoUri)

  ┌──────────────────────────────────────────────┐
  │  Si al cambiar de InMemory a Mongo           │
  │  NO tocaste ni UNA linea en /domain          │
  │  ni en /application...                       │
  │                                              │
  │  ══▶ Has entendido Hexagonal/Clean.          │
  │                                              │
  │  Si tuviste que tocar algo ahi,              │
  │  tu arquitectura tiene un leak.              │
  │  Revisar donde se rompio la regla.           │
  └──────────────────────────────────────────────┘
```

### Ejercicio 1.4 — Explicar (crucial para entrevistas)

```
  Semana 2, dia 5:
  ────────────────
  Grabarte respondiendo estas preguntas (2 min cada una):

  1. "¿Por que organizaste el codigo asi?"
  2. "¿Que pasa si cambias MongoDB por PostgreSQL?"
  3. "¿Donde vive la regla de que el titulo no
      puede estar vacio? ¿Por que ahi?"
  4. "¿Que ventaja tiene esto sobre meter todo
      en un controller gordo?"

  Si no puedes responder fluido, repetir.
```

```
RECUERDA:
→ El TEST de esta fase: cambiar BD sin tocar domain ni application
→ Si los tests pasan sin BD real, la arquitectura es correcta
→ Bonus extra: cambiar Express por Fastify sin tocar domain
```

---

## FASE 2: Monolito vs Modular vs Micro (semana 3)

```
  OBJETIVO: Evolucionar el proyecto de la Fase 1
  de monolito a modular. Disenar (sin implementar)
  la extraccion a microservicio.
```

### Ejercicio 2.1 — De monolito a modular

```
  PASO 1: Dibujar en Excalidraw como esta ahora
  (1 modulo, Task Manager = monolito)

  PASO 2: Anadir segundo dominio "Users"
  (autenticacion basica: registro + login)
  Meterlo en el MISMO proyecto.
  ──▶ Sigue siendo monolito con 2 dominios mezclados.

  PASO 3: Refactorizar a MONOLITO MODULAR:

  /src
    /modules
      /tasks
        /domain
        /application
        /infrastructure
        index.ts          ← API PUBLICA del modulo
      /users
        /domain
        /application
        /infrastructure
        index.ts          ← API PUBLICA del modulo
    /shared               ← solo interfaces compartidas
    main.ts

  REGLA ESTRICTA:
  ┌──────────────────────────────────────────────┐
  │  /tasks NO puede importar de /users/domain   │
  │  ni de /users/infrastructure.                │
  │                                              │
  │  Solo puede usar /users/index.ts             │
  │  (la API publica del modulo).                │
  │                                              │
  │  Si necesitas datos de un usuario en tasks,  │
  │  pides via la API publica, NO accedes        │
  │  directo a la BD de users.                   │
  └──────────────────────────────────────────────┘
```

### Ejercicio 2.2 — Disenar la extraccion (sin implementar)

```
  En Excalidraw, dibujar:

  1. ¿Que modulo extraerias primero a microservicio?
     ¿Tasks o Users? ¿Por que?

  2. ¿Como se comunicarian?
     - HTTP sincrono? (REST)
     - Eventos asincronos? (mensajeria)
     - Ambos?

  3. ¿Que problemas aparecen?
     - Datos compartidos (¿user data en tasks?)
     - Transacciones distribuidas
     - Latencia de red
     - Deployment independiente

  NO implementar. Solo DISENAR y ARGUMENTAR.
  Esto es exactamente lo que te piden
  en entrevistas de system design.
```

### Ejercicio 2.3 — Respuesta de entrevista

```
  Escribir (y practicar en voz alta) respuesta a:

  "Tienes una app que esta creciendo. Actualmente
   es un monolito. El equipo va a pasar de 5 a 25
   personas. ¿Que haces?"

  Tu respuesta debe cubrir:
  1. Por que NO saltar directo a microservicios
  2. Paso 1: refactorizar a monolito modular
  3. Paso 2: identificar que modulo extraer primero
  4. Criterio: extraer cuando un equipo necesita
     autonomia total o escalar independientemente
  5. Trade-offs de cada opcion
```

```
RECUERDA:
→ El TEST de esta fase: poder dibujar la evolucion en una pizarra
→ Saber argumentar POR QUE cada paso y no otro
→ "Empieza simple, complejiza solo cuando el dolor lo justifique"
```

---

## FASE 3: DDD Strategic (semana 4)

```
  OBJETIVO: Aprender a identificar Bounded Contexts
  en un dominio real. Esto es lo que te permite
  dibujar los limites de modulos/servicios
  con criterio de NEGOCIO, no tecnico.
```

### Ejercicio 3.1 — Mapear WeUp

```
  Tomar WeUp (tu producto real) y hacer
  Event Storming simplificado:

  PASO 1: Listar todos los EVENTOS del sistema
  (cosas que pasan, en pasado):

  - UsuarioRegistrado
  - PerfilLinkedInConectado
  - IdeaGenerada
  - TendenciaDetectada
  - ContenidoCreado
  - CarruselGenerado
  - PostPublicado
  - MetricasActualizadas
  ...

  PASO 2: Agrupar eventos por CONTEXTO
  (los que hablan del mismo "tema"):

  ┌─────────────────┐  ┌─────────────────┐
  │ BC: Identity    │  │ BC: Content     │
  │                 │  │                 │
  │UsuarioRegistrado│  │IdeaGenerada     │
  │PerfilConectado  │  │ContenidoCreado  │
  │                 │  │CarruselGenerado │
  └─────────────────┘  │PostPublicado    │
                       └─────────────────┘
  ┌─────────────────┐  ┌─────────────────┐
  │ BC: Trends      │  │ BC: Analytics   │
  │                 │  │                 │
  │TendenciaDetect. │  │MetricasActualiz.│
  │                 │  │                 │
  └─────────────────┘  └─────────────────┘

  PASO 3: Cada BC = 1 modulo (monolito modular)
          o 1 servicio (microservicios)

  PASO 4: Dibujar el Context Map
  (como se comunican los BCs entre si)
```

### Ejercicio 3.2 — Ubiquitous Language

```
  Para cada Bounded Context, definir:

  ¿Que significa "contenido" en cada contexto?

  En BC: Content  → "un post de LinkedIn con texto y formato"
  En BC: Analytics → "un item con metricas de engagement"
  En BC: Trends   → "una referencia para detectar patrones"

  MISMA palabra, DIFERENTE significado segun el contexto.
  Esto es Ubiquitous Language.
  Y es la razon por la que existen los Bounded Contexts.
```

### Ejercicio 3.3 — Mapear a arquitectura

```
  Dibujar en Excalidraw:

  "Si WeUp creciera a 30 personas,
   ¿como organizarias los equipos
   alrededor de los Bounded Contexts?"

  ┌────────────────────────────────────────┐
  │  Equipo Identity (2-3 personas)       │
  │  → Modulo/servicio de auth + perfiles │
  │                                        │
  │  Equipo Content (4-5 personas)        │
  │  → Modulo/servicio de ideas, posts,   │
  │    carruseles                          │
  │                                        │
  │  Equipo Analytics (2-3 personas)      │
  │  → Modulo/servicio de metricas        │
  └────────────────────────────────────────┘

  DDD Strategic te da el CRITERIO para
  decidir donde cortar, basado en el NEGOCIO,
  no en la tecnologia.
```

```
RECUERDA:
→ El TEST de esta fase: poder dibujar los BCs de cualquier dominio
→ Evento Storming (simplificado) = tu herramienta practica
→ Bounded Context = la respuesta a "¿donde corto el sistema?"
```

---

## FASE 4: Event-Driven + CQRS (semanas 5-6)

```
  OBJETIVO: Entender comunicacion asincrona
  y separacion lectura/escritura.
  Nivel conceptual + diseno, no implementacion compleja.
```

### Ejercicio 4.1 — Anadir eventos al proyecto

```
  Volver al Task Manager de la Fase 1/2.
  Anadir Domain Events:

  Cuando se crea una task:
  → Emitir evento "TaskCreated"

  Cuando se completa una task:
  → Emitir evento "TaskCompleted"

  Crear un Consumer simple que escuche:
  - TaskCompleted → log "Enviar notificacion"
  - TaskCompleted → log "Actualizar estadisticas"

  Implementacion simple (event emitter en memoria).
  No necesitas Kafka ni RabbitMQ para entender el patron.

  ┌──────────┐  TaskCompleted  ┌──────────────────┐
  │ Task     │────────────────▶│ NotificationSvc  │
  │ Module   │                 └──────────────────┘
  │          │  TaskCompleted  ┌──────────────────┐
  │          │────────────────▶│ StatsSvc         │
  └──────────┘                 └──────────────────┘

  El modulo Task NO sabe quien consume.
  Solo emite el evento.
```

### Ejercicio 4.2 — Disenar CQRS (en papel)

```
  Dibujar en Excalidraw un sistema de e-commerce:

  WRITE SIDE:
  - CreateOrder (command)
  - Valida stock
  - Guarda en BD normalizada

  READ SIDE:
  - GetOrderHistory (query)
  - Lee de BD desnormalizada
  - Optimizada para lecturas rapidas

  ┌─────────────┐              ┌─────────────┐
  │  COMMANDS   │              │  QUERIES    │
  │  (escribir) │              │  (leer)     │
  │             │              │             │
  │ CreateOrder │              │ GetHistory  │
  │ CancelOrder │              │ SearchItems │
  └──────┬──────┘              └──────┬──────┘
         │                            │
  ┌──────▼──────┐              ┌──────▼──────┐
  │  Write DB   │───  sync  ──▶│  Read DB    │
  │(normalizada)│    async     │(desnormaliz)│
  └─────────────┘              └─────────────┘

  NO implementar. Solo DIBUJAR y saber EXPLICAR:
  - ¿Por que separar lectura de escritura?
  - ¿Cuando tiene sentido?
  - ¿Que pasa con la consistencia?
```

### Ejercicio 4.3 — Respuesta de entrevista

```
  Preparar respuesta a:

  "¿Cuando usarias Event-Driven Architecture
   y cuando NO?"

  SI:
  - Comunicacion entre microservicios
  - Procesamiento asincrono (no necesitas respuesta inmediata)
  - Desacoplar servicios al maximo

  NO:
  - Operaciones que necesitan respuesta sincona
  - Sistemas simples donde anade complejidad sin valor
  - Equipos sin experiencia en sistemas distribuidos
```

```
RECUERDA:
→ Puedes entender Event-Driven sin Kafka (event emitter basta)
→ CQRS: solo disenarlo y saber explicar cuando usarlo
→ Ambos son patrones de COMUNICACION, no de despliegue
```

---

## FASE 5: Extras (ongoing)

```
  Esto no tiene fecha. Es para ir profundizando
  cuando tengas tiempo o cuando salga en contexto.
```

### 5.1 — Serverless (relevante para tu perfil AI Engineer)

```
  Ejercicio: Migrar una de las API routes
  del Task Manager a una Azure Function
  o Vercel Serverless Function.

  Observar:
  - ¿Que cambia en la arquitectura?
  - Cold starts
  - Limites de ejecucion
```

### 5.2 — Layered vs Clean (saber argumentar)

```
  Ejercicio: Reescribir el Task Manager
  con arquitectura Layered clasica
  (controller → service → repository, todo acoplado).

  Despues comparar:
  - ¿Que pasa si intento cambiar la BD? (hay que tocar el service)
  - ¿Puedo testear sin BD? (probablemente no)
  - ¿Cuando esta bien usar Layered? (CRUDs simples)
```

### 5.3 — Estudiar un caso real

```
  Leer como Shopify organizo su monolito modular.
  O como Netflix migro a microservicios.
  Tomar notas sobre:
  - ¿Por que tomaron esa decision?
  - ¿Que problemas tenian ANTES?
  - ¿Que problemas aparecieron DESPUES?
```

---

## Mapa Completo del Plan

```
  SEMANA 1  │ FASE 1: Clean/Hexagonal
  SEMANA 2  │ Proyecto + tests + cambiar BD
  ──────────┤
  SEMANA 3  │ FASE 2: Monolito → Modular → Micro
            │ Evolucionar proyecto + Excalidraw
  ──────────┤
  SEMANA 4  │ FASE 3: DDD Strategic
            │ Event Storming WeUp + Bounded Contexts
  ──────────┤
  SEMANA 5  │ FASE 4: Event-Driven + CQRS
  SEMANA 6  │ Eventos en proyecto + disenar CQRS
  ──────────┤
  ONGOING   │ FASE 5: Serverless, Layered, casos reales
```

```
  EL PRINCIPIO QUE GUIA TODO EL PLAN:

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │  NO aprendes arquitectura leyendo.               │
  │  Aprendes CONSTRUYENDO + EXPLICANDO.             │
  │                                                  │
  │  1. Construir un proyecto real (por pequeno      │
  │     que sea) aplicando el patron                 │
  │                                                  │
  │  2. Romperlo a proposito (cambiar BD, anadir     │
  │     modulo, extraer servicio) para VER           │
  │     que se rompe y que no                        │
  │                                                  │
  │  3. Explicar en voz alta en 2 minutos            │
  │     (si no puedes, no lo has entendido)          │
  │                                                  │
  └──────────────────────────────────────────────────┘
```

```
RECUERDA:
→ FASE 1 (Clean/Hexagonal) es la mas importante. Dedica el doble de tiempo ahi.
→ El TEST universal: ¿puedo cambiar infraestructura sin tocar dominio?
→ Todo se construye sobre el MISMO proyecto, evoluciona de fase en fase.
→ Explicar > Leer. Si no lo puedes explicar en 2 min, no lo sabes.
```

https://claude.ai/share/c669c451-0768-4324-b2f0-4edf890616bb
