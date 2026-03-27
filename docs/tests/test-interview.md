# Software Architecture 101 — Explain Test (10 Questions)

Answer each question as if you were in an interview. Write 2-4 sentences max per answer.

---

### 1. Explain what Clean Architecture is and why would you use it.

> Your answer:

Arquitectura limpia digamos que es una manera de separar el codigo por capas y proteger el dominio, las reglas de negocio como tal, para que no dependa de nada externo. Estaria la capa de infra, la capa de application y la capa de dominio como tal. A nivel de dependencias, las dependencias pueden ser usadas de fuera hacia dentro, es decir infra podra usar application, application las de domain. Es una manera de proteger al dominio para que sea agnostico a tecnologias y que aun cambiando por completo el dia de manana de tecnologias, las reglas de negocio no tocarlas como tal. Es una manera de estructurar el codigo con responsabilidades bastante bien separadas y ademas es mucho mas facil testear ya que nos basamos mucho en abstracciones mas que en implementaciones.

**Score: 8/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → Capas, dependency rule, agnostico a tecnologias, testeabilidad
  → Mencionas abstracciones vs implementaciones (clave)

  LO QUE FALTA
  ═════════════
  Clean tiene 4 capas, no 3:

  ┌─ Frameworks & Drivers ─────────────────┐
  │  ┌─ Interface Adapters (controllers) ──┐  │
  │  │  ┌─ Use Cases ─────────────────────┐  │  │
  │  │  │  ┌─ Entities ──────────────────┐  │  │  │
  │  │  │  └─────────────────────────────┘  │  │  │
  │  │  └───────────────────────────────────┘  │  │
  │  └─────────────────────────────────────────┘  │
  └───────────────────────────────────────────────┘

  Tu respuesta mezcla "infra" como una sola capa,
  pero Clean distingue Interface Adapters (controllers, DTOs)
  de Frameworks & Drivers (Express, DB drivers).

  En entrevista, pasa bien. Para nota alta,
  menciona las 4 capas por nombre.
```

---

### 2. What is the Dependency Rule and why does it matter?

> Your answer:

La dependency rule quiere decir que puedes importar dependencias de fuera hacia dentro, es decir desde fuera podras importar cosas. Por ejemplo infra podras importar cosas de application, de application domain. Domain es agnostico a todo. Se hace esto para que sea facil de testear y cambiar en un futuro.

**Score: 7/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → Direction correcta: de fuera hacia dentro
  → Domain agnostico
  → Testeabilidad + cambio futuro

  LO QUE FALTA
  ═════════════
  Lo explicas desde el PERMISO:
  "puedes importar de fuera hacia dentro"

  Pero la regla es mas fuerte desde la PROHIBICION:

  ┌──────────────────────────────────────────┐
  │  NADA del centro puede saber NADA        │
  │  de lo que hay fuera.                    │
  │                                          │
  │  Domain NO importa de Application        │
  │  Application NO importa de Infra         │
  │                                          │
  │  Hacia adentro = OK                      │
  │  Hacia afuera = PROHIBIDO                │
  └──────────────────────────────────────────┘

  En entrevista, di primero la prohibicion:
  "El dominio no puede saber nada del exterior"
  y luego el permiso:
  "Las capas externas pueden importar de las internas"
```

---

### 3. Explain the difference between a Monolith, Modular Monolith, and Microservices. When would you use each?

> Your answer:

Monolito = Todo junto a nivel de deploy, todo esta relacionado entre si los diferentes modulos que existen.
Monolito modular = Sigue siendo un unico deploy, pero hay una separacion de responsabilidades y se comunican por APIs publicas.
Microservicios = Cada modulo tiene su propio deploy a nivel fisico, y tiene separacion de responsabilidades en el codigo obviamente.

Monolito cuando estas empezando 1-3 personas, monolito modular 4-12, microservicio mas de 12.

**Score: 7/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → Definiciones claras y concisas
  → Numeros de personas como guia (bueno para entrevista)
  → Modular = unico deploy + APIs publicas

  LO QUE FALTA
  ═════════════
  Diferencias clave que no mencionas:

  MONOLITO CLASICO              MODULAR               MICRO
  ════════════════              ═══════               ═════
  Modulos acceden               Modulos SOLO          Cada servicio
  DIRECTO a datos               via API publica       tiene SU propia BD
  de otros                      (index.ts)            y SU propio deploy

  OrderService                  OrderModule           OrderService
    ↓                             ↓                     ↓
  userRepo.findById()           users.findById()      HTTP call a Users
  (mete las manos              (pide por la puerta    (red, latencia,
   en otro dominio)              principal)             complejidad)

  Tambien falta: en microservicios cada servicio
  tiene su PROPIA base de datos. Eso es clave.
```

---

### 4. What is coupling? Give a concrete example of high coupling and how you would fix it.

> Your answer:

Coupling significa cuanto los otros modulos saben de otros modulos, cuanto saben del otro y cuanto dependen de otro. Es decir, cuanto depende y cuantas cosas se llama, por ejemplo en la clase User pues cuanto depende de la clase Email por ejemplo que no tiene nada que ver.

**Score: 5/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → La definicion es correcta: cuanto depende un modulo de otro

  LO QUE FALTA
  ═════════════
  La pregunta pide EJEMPLO CONCRETO + COMO ARREGLARLO.
  No diste ninguno de los dos.

  Ejemplo ideal para entrevista:

  ALTO COUPLING (antes):
  task.entity.ts → import { User } from './user.entity'
  Task tiene assignedTo: User  ← conoce la clase entera

  BAJO COUPLING (despues):
  Task tiene assignedTo: string | null  ← solo un userId
  No sabe que existe User

  ¿Como lo arregle?
  → Cambie el objeto User por un string (userId)
  → Pase userId como parametro, no como dependencia
  → Task ya no importa nada del modulo Users

  En entrevista, SIEMPRE da el ejemplo concreto.
  La teoria sin ejemplo suena a que no lo has hecho.
```

---

### 5. Your app is growing from 5 to 25 developers. What do you do with the architecture and why?

> Your answer:

Arquitectura fisica iriamos con microservicios, arquitectura codigo podriamos ir con clean o n-layered si se hace bien, depende.

Microservicios porque supongo que la app crece como tal y habra muchas partes que mantener, y clean o layered pues depende de lo que estes haciendo.

**Score: 4/10**

> Feedback:

```
  EL ERROR CLAVE
  ══════════════
  Saltar de 5 a 25 personas directamente a microservicios
  es el error clasico que un entrevistador quiere detectar.

  LA RESPUESTA CORRECTA:
  ══════════════════════

  Paso 1: Refactorizar a MONOLITO MODULAR
  ────────────────────────────────────────
  → Separar el codigo en modulos con fronteras claras
  → Cada modulo: su dominio, su infra, su API publica
  → UN solo deploy, complejidad operativa BAJA

  Paso 2: Extraer a microservicio SOLO si es necesario
  ─────────────────────────────────────────────────────
  → Cuando un equipo necesita autonomia TOTAL
  → Cuando un modulo necesita escalar INDEPENDIENTEMENTE
  → NO extraer todo, solo lo que el dolor justifique

  ┌──────────────────────────────────────────────┐
  │  5 personas ──▶ Monolito (o ya modular)      │
  │  25 personas ──▶ Monolito Modular            │
  │  Solo si hay dolor real ──▶ Extraer a micro  │
  └──────────────────────────────────────────────┘

  La frase clave en entrevista:
  "No saltaria a microservicios directamente.
   Primero modular, luego extraer solo lo necesario."
```

---

### 6. Explain what a Use Case is and how it differs from an Entity.

> Your answer:

Use case es la parte de application de clean architecture. Esta parte dice las acciones del usuario, tiene que cumplir con SRP, Dependency Inversion y Open/Close. Es la que orquesta entre la infra y la entidad como tal. Y la entidad digamos es QUE ES ESTE OBJETO O ENTIDAD COMO TAL, que propiedades tiene, que acciones tiene sobre ella.

**Score: 6/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → Use case = acciones del usuario
  → Entity = que es el objeto, sus propiedades y acciones
  → Mencionas SRP

  LO QUE ESTA MAL O CONFUSO
  ══════════════════════════
  "Orquesta entre la infra y la entidad"
  → NO. El use case orquesta entre el REPO y la entity.
     No sabe que existe infra.

  Mencionas SRP, DI, Open/Close pero no explicas como aplican.
  En entrevista, si mencionas principios, da un ejemplo.

  RESPUESTA CLARA:
  ════════════════

  ENTITY                          USE CASE
  ══════                          ════════
  Muta sus datos en MEMORIA       Busca, llama a la entity, PERSISTE

  task.complete()                 1. repo.findById(id)
  this.state = "completed"        2. task.complete()
       ↑                          3. repo.save(task)
  Solo RAM                              ↑
  Si nadie guarda, se pierde      Lo hace permanente

  Entity = COMO cambiar datos (reglas de negocio)
  Use Case = CUANDO buscar y CUANDO guardar (orquestacion)
```

---

### 7. In a modular monolith, how do two modules communicate without breaking boundaries? Give an example.

> Your answer:

A traves de una API publica. Pues Email service necesita saber el email del user, pues haria la peticion como tal para saber el email del user al Service User.

**Score: 7/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → API publica como mecanismo
  → Ejemplo de un modulo pidiendo datos a otro

  LO QUE FALTA
  ═════════════
  Mas concreto. En entrevista, di COMO se implementa:

  ┌──────────────┐                ┌──────────────┐
  │ Tasks Module │                │ Users Module │
  │              │                │              │
  │ controller   │──llama──▶     │ index.ts     │
  │ (infra)      │                │ findById()   │
  └──────────────┘                └──────────────┘

  "Cada modulo tiene un index.ts que expone
   SOLO lo que otros modulos necesitan.
   Nunca importas de las tripas del otro modulo
   (su domain, su application, su infra).
   Solo del index.ts."

  Ejemplo concreto de tu proyecto:
  → Tasks controller llama usersModule.findById(userId)
  → NO importa User entity ni UserRepository
  → Solo recibe el dato via API publica
```

---

### 8. Why would you inject a repository via constructor but pass a userId as a parameter? What principle is behind this?

> Your answer:

Digamos que una dependencia es mejor cuando queremos que algo perdure, que no cambia como tal, y parametro cuando necesitas cambiar las cosas o cuando es modificable.

**Score: 4/10**

> Feedback:

```
  HAY 3 RAZONES, NO 1
  ════════════════════

  RAZON 1: ¿Llamas METODOS o solo LEES?
  ──────────────────────────────────────

  INYECTAR (constructor)                 PARAMETRO (execute)
  ══════════════════════                 ══════════════════

  taskRepo.save(task)                    userId = "abc123"
  taskRepo.findById(id)                       ↑
  taskRepo.delete(id)                    es un string
       ↑                                 no tiene .save()
  llamas .save()                         no tiene .find()
  llamas .findById()                     solo lo LEES
  = necesitas el objeto
    VIVO para operar


  RAZON 2: ¿Cambia entre llamadas o es siempre el mismo?
  ──────────────────────────────────────────────────────

  Constructor = se crea UNA VEZ           Parametro = cambia CADA VEZ
  ══════════════════════════              ═══════════════════════════

  const useCase = new CreateTask(repo)   useCase.execute("titulo 1", "user1")
                              ↑          useCase.execute("titulo 2", "user2")
                  siempre el mismo repo              ↑
                  no cambia entre                 datos diferentes
                  llamadas                        en cada llamada

  No tiene sentido inyectar userId en el constructor
  porque cada llamada necesita un userId DISTINTO.

  No tiene sentido pasar taskRepo por parametro
  porque es SIEMPRE el mismo en todas las llamadas.


  RAZON 3: ¿Es de TU modulo o de OTRO?
  ─────────────────────────────────────

  INYECTAR                               PARAMETRO
  ════════                               ═════════

  TaskRepository                         userId: string
       ↑                                      ↑
  es de Tasks                            viene de Users
  es MIO                                 es de OTRO modulo
  no genera coupling                     si lo inyectara como
  con otro modulo                        UserRepository, acoplo
                                         Tasks con Users


  EJEMPLO CONCRETO DE TU PROYECTO:
  ════════════════════════════════

  ACOPLADO (inyectar repo de otro modulo):

  class CreateTaskUseCase {
    constructor(
      taskRepo,     ← mio, OK
      userRepo      ← de Users, COUPLING
    ) {}
  }

  DESACOPLADO (pasar dato como parametro):

  class CreateTaskUseCase {
    constructor(
      taskRepo      ← mio, OK. Solo esto.
    ) {}

    execute(title, userId?) {
                     ↑
        string puro. No sabe que existe Users.
        No llama metodos sobre el.
        Cambia en cada llamada.
    }
  }
```

```
  RESUMEN: LAS 3 RAZONES JUNTAS
  ══════════════════════════════

  ┌──────────────────┬───────────────────┬────────────────────┐
  │                  │  CONSTRUCTOR      │  PARAMETRO         │
  ├──────────────────┼───────────────────┼────────────────────┤
  │ ¿Llamas metodos? │  SI (save, find)  │  NO (solo leer)    │
  ├──────────────────┼───────────────────┼────────────────────┤
  │ ¿Cambia entre    │  NO (siempre el   │  SI (distinto en   │
  │  llamadas?       │   mismo repo)     │   cada llamada)    │
  ├──────────────────┼───────────────────┼────────────────────┤
  │ ¿De que modulo?  │  DEL MIO          │  DE OTRO (o input  │
  │                  │                   │   del usuario)     │
  └──────────────────┴───────────────────┴────────────────────┘
```

```
REMEMBER:
→ Razon 1: llamas metodos = inyectar, solo lees = parametro
→ Razon 2: siempre igual = inyectar, cambia cada vez = parametro
→ Razon 3: de tu modulo = inyectar, de otro modulo = parametro
→ Las 3 van juntas. El principio detras: reducir COUPLING.
```

---

### 9. What is Event-Driven Architecture? When would you use it and when would you NOT?

> Your answer:

*(sin respuesta)*

**Score: 0/10**

> Feedback:

```
  EVENT-DRIVEN ARCHITECTURE
  ═════════════════════════

  ┌──────────┐                      ┌──────────┐
  │ PRODUCER │──"OrderCreated"──▶   │CONSUMER A│
  │          │                 │    └──────────┘
  └──────────┘          EVENT BUS
                               │    ┌──────────┐
                               └──▶ │CONSUMER B│
                                    └──────────┘

  Los componentes se comunican emitiendo EVENTOS,
  no llamandose directamente.

  3 reglas:
  → El producer NO sabe quien consume
  → El consumer NO sabe quien produce
  → La comunicacion es ASINCRONA

  CUANDO SI:
  → Comunicacion entre microservicios
  → Procesamiento asincrono (no necesitas respuesta inmediata)
  → Desacoplar servicios al maximo
  → Sistemas en tiempo real

  CUANDO NO:
  → Operaciones que necesitan respuesta inmediata
  → Sistemas simples (anade complejidad sin valor)
  → Equipos sin experiencia en sistemas distribuidos

  RESPUESTA DE ENTREVISTA:
  "Event-Driven es cuando los servicios se comunican
   por eventos en vez de llamadas directas.
   El productor emite un evento y no sabe quien lo consume.
   Lo usaria para comunicacion entre microservicios
   y procesamiento asincrono. No lo usaria en sistemas
   simples o cuando necesito respuesta inmediata,
   porque la trazabilidad se complica mucho."
```

---

### 10. You need to change from InMemoryRepository to MongoRepository. Walk me through what you change and what you don't touch. Why?

> Your answer:

Bueno, crearia un nuevo archivo repo en la parte de infra con esta implementacion y le pasaria pues el TaskRepository para que implemente las funciones especificadas pero la implementacion como tal en Mongo. Y luego cambiaria en donde esta instanciado los use cases con el repository, lo cambiaria por Mongo.

**Score: 7/10**

> Feedback:

```
  LO QUE HICISTE BIEN
  ════════════════════
  → Nuevo repo en infra que implementa la interfaz
  → Cambiar el wiring donde se instancia

  LO QUE FALTA
  ═════════════
  La frase CLAVE que un entrevistador quiere oir:

  ┌──────────────────────────────────────────────┐
  │                                              │
  │  "NO toco ni UNA linea en domain             │
  │   ni en application.                         │
  │                                              │
  │   Solo creo el nuevo repo en infra           │
  │   y cambio 1 linea en main.ts."              │
  │                                              │
  │   ESO demuestra que la arquitectura           │
  │   esta bien hecha.                           │
  │                                              │
  └──────────────────────────────────────────────┘

  QUE CAMBIO:
  → infra: creo MongoTaskRepository (implements TaskRepository)
  → main.ts: cambio new InMemoryTaskRepository()
              por new MongoTaskRepository(uri)

  QUE NO TOCO:
  → domain (entity, interfaces) = CERO cambios
  → application (use cases) = CERO cambios

  POR QUE: porque los use cases dependen de la INTERFAZ
  (TaskRepository), no de la implementacion.
  Eso es Dependency Inversion en accion.
```

---

## Final Score

| # | Question | Score |
|---|----------|-------|
| 1 | Clean Architecture | 8/10 |
| 2 | Dependency Rule | 7/10 |
| 3 | Mono/Modular/Micro | 7/10 |
| 4 | Coupling + example | 5/10 |
| 5 | Growing 5→25 | 4/10 |
| 6 | Use Case vs Entity | 6/10 |
| 7 | Modular communication | 7/10 |
| 8 | Constructor vs Param | 4/10 |
| 9 | Event-Driven | 0/10 |
| 10 | Swap repo | 7/10 |
| **Total** | | **55/100** |

### Areas to reinforce

```
  PRIORITY 1: Repasar Event-Driven Architecture
  → No pudiste responder la pregunta 9

  PRIORITY 2: Constructor vs Parametro
  → La regla es: metodos = inyectar, solo datos = parametro
  → El principio es reducir coupling entre modulos

  PRIORITY 3: No saltar a microservicios
  → De 5 a 25 personas = monolito modular
  → Microservicios solo si el dolor real lo justifica

  PRIORITY 4: Dar ejemplos concretos
  → En entrevista, la teoria sin ejemplo no convence
  → Usa tu proyecto real: "en mi task manager hice X"
```
