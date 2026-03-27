# Code Architecture

_"How do I organize code WITHIN an application or service?"_

## 2.0 The Code Architecture Landscape

```
CODE ARCHITECTURES
         |
         +-- TRADITIONAL (organize by technical layers)
         |   +-- Layered / N-Tier
         |
         +-- DOMAIN-CENTRIC (protect business logic)
         |   +-- Hexagonal (Ports & Adapters)
         |   +-- Onion
         |   +-- Clean Architecture
         |
         +-- DATA FLOW (organize by processing)
         |   +-- Pipe & Filter
         |
         +-- PRESENTATION (organize the UI)
             +-- MVC
             +-- MVP
             +-- MVVM
```

The core idea: all of them seek to **separate responsibilities**, but they differ in WHAT they place at the center and HOW they draw the dependencies.

```
REMEMBER:
> Traditional: separate by technical FUNCTION (UI, logic, data)
> Domain-centric: separate to PROTECT business logic
> Presentation: separate how information is displayed to the user
```

---

## 2.1 Layered Architecture (N-Tier)

```
  +----------------------------------+
  |      PRESENTATION LAYER          |  <- Controllers, views, API
  |      (what the user sees)        |
  +----------------------------------+
  |      BUSINESS LOGIC LAYER        |  <- Rules, validations, calculations
  |      (what the system "knows")   |
  +----------------------------------+
  |      DATA ACCESS LAYER           |  <- Repositories, queries, ORM
  |      (how it stores/reads data)  |
  +----------------------------------+
  |      DATABASE                    |  <- PostgreSQL, MongoDB, etc.
  +----------------------------------+

  Rule: each layer ONLY talks to the one immediately below
  The dependency arrow goes from TOP to BOTTOM

  Presentation --> Business --> Data Access --> Database
```

**What it is:** Organizing code in horizontal layers, where each one has a technical responsibility. The upper layer only talks to the one below it. Layers are never skipped.

Analogy: an assembly line. Step 1 (UI) passes work to step 2 (logic), which passes it to step 3 (data). Each person in the chain only knows the next one.

**The fundamental problem:**

```
  Presentation --> Business --> Data Access
                       |              |
                       +--------------+
                       Business logic
                       DEPENDS on the data layer.
                       If you change the DB, you touch the business logic.
```

The business layer "looks down" toward the data. This means the most valuable logic (business rules) is coupled to infrastructure details (the database). This problem is exactly what domain-centric architectures came to solve.

**When to use it:** Simple CRUDs, apps with little business logic, MVPs, junior teams.

**When NOT to:** When business logic is complex and needs to survive technology changes.

```
REMEMBER:
> The most well-known and widely used architecture in the world
> Simple to understand, but logic remains COUPLED to data
> If your app is a glorified CRUD, Layered is perfect
```

### Folder structure example

```
src/
  /routes
    task.routes.ts            <- Maps URLs to controllers
  /controllers
    task.controller.ts        <- Receives HTTP, calls the service
  /services
    task.service.ts           <- Business logic + orchestration
  /repositories
    task.repository.ts        <- Data access (queries, DB)
  /models
    task.model.ts             <- DB schema/model
  app.ts                      <- Express setup
  server.ts                   <- Entry point
```

```
PRESENTATION LAYER
+-- /routes          <- Maps URLs to controllers
+-- /controllers     <- Receives Request, returns Response

BUSINESS LOGIC LAYER
+-- /services        <- Business logic and orchestration

DATA ACCESS LAYER
+-- /repositories    <- Queries, CRUD against the DB
+-- /models          <- Schemas/data definitions
```

---

## 2.2 Hexagonal Architecture (Ports & Adapters)

```
                    OUTSIDE WORLD
          +------------------------------+
          |                              |
  +-------+------+              +--------+-----+
  |   ADAPTER    |              |   ADAPTER    |
  |  (REST API)  |              | (PostgreSQL) |
  +-------+------+              +--------+-----+
          |                              |
  +-------v------+              +--------v-----+
  |  INPUT PORT  |              | OUTPUT PORT  |
  |  (interface) |              |  (interface) |
  +-------+------+              +--------+-----+
          |                              |
          |     +--------------+         |
          +---->|   DOMAIN     |<--------+
                |   (CORE)     |
                |              |
                | Entities     |
                | Use Cases    |
                | Business     |
                |   Rules      |
                +--------------+

  GOLDEN RULE: Dependency arrows
  ALWAYS point TOWARD the domain.
  The domain does NOT import anything from outside.
```

**What it is:** Business logic sits at the center and NEVER depends on anything external. It communicates with the outside world through contracts (ports/interfaces) that it defines itself. Concrete implementations (adapters) live outside.

Analogy: a universal plug adapter. A laptop (domain) always works the same way. The adapter changes depending on the country (PostgreSQL, MongoDB, REST, GraphQL...).

**The three key concepts:**

```
  CORE (Domain)
  +-- Defines WHAT it needs through interfaces
      |
  PORTS
  +-- The interfaces/contracts
      |
      +-- Input Ports: "how requests come in"
      |   E.g.: CreateOrderUseCase (interface)
      |
      +-- Output Ports: "what I need from the outside"
          E.g.: OrderRepository (interface)
      |
  ADAPTERS
  +-- Concrete implementations of the ports
      |
      +-- Input Adapters: REST controller, CLI, tests
      +-- Output Adapters: PostgresOrderRepo, MongoOrderRepo
```

**Dependency inversion in action:**

```
  WITHOUT Hexagonal (Layered):
  Business --depends--> PostgresRepository  (business knows Postgres)

  WITH Hexagonal:
  Business --depends--> OrderRepository (own interface)
                              ^
                              | implements
                        PostgresOrderRepo  (infra knows the interface)

  The arrow has been INVERTED!
  Now infra depends on the domain, not the other way around.
```

**When to use it:** Complex business logic, need to swap technologies without touching the core, projects that require high testability.

**When NOT to:** Simple CRUDs where the abstraction overhead is not justified.

**Created by:** Alistair Cockburn, 2005.

```
REMEMBER:
> The domain defines its own contracts (ports), infra implements them (adapters)
> The Dependency Inversion Principle (SOLID) is the pillar of this architecture
> You can change DB, framework, or UI without touching a SINGLE line of domain code
```

### Folder structure example

```
src/
  /core
    /entities
      task.entity.ts          <- Entity with business rules
    /ports
      /input
        create-task.port.ts   <- Input interface (what the outside can request)
        get-tasks.port.ts
      /output
        task-repository.port.ts  <- Output interface (what the core needs)
    /services
      task.service.ts         <- Implements input ports, orchestrates logic
  /adapters
    /input
      /http
        task.controller.ts    <- Input adapter: Express -> Core
        task.routes.ts
    /output
      /persistence
        mongo-task.repo.ts    <- Output adapter: Core -> MongoDB
  main.ts                     <- Wiring + entry point
```

```
CORE (the hexagon)
+-- /entities        <- Pure business rules
+-- /ports/input     <- Contracts: HOW things are requested
+-- /ports/output    <- Contracts: WHAT is needed from the outside
+-- /services        <- Implements input ports, orchestrates

ADAPTERS (the outside world)
+-- /input/http      <- Input adapter: Express controller
+-- /output/persistence <- Output adapter: MongoDB repo
```

---

## 2.3 Clean Architecture

```
  +------------------------------------------------+
  |           FRAMEWORKS & DRIVERS                 |
  |  (Express, React, PostgreSQL, AWS)             |
  |    +----------------------------------------+  |
  |    |       INTERFACE ADAPTERS               |  |
  |    |  (Controllers, Presenters, Gateways)   |  |
  |    |    +--------------------------------+  |  |
  |    |    |         USE CASES              |  |  |
  |    |    |  (Application Business Rules)  |  |  |
  |    |    |    +----------------------+    |  |  |
  |    |    |    |      ENTITIES        |    |  |  |
  |    |    |    |  (Enterprise Rules)  |    |  |  |
  |    |    |    +----------------------+    |  |  |
  |    |    +--------------------------------+  |  |
  |    +----------------------------------------+  |
  +------------------------------------------------+

  THE DEPENDENCY RULE:
  ====================
  Code dependencies ONLY point inward.
  Nothing at the center knows anything about what is outside.
```

**What it is:** The formalization by Uncle Bob (Robert C. Martin, 2012) that integrates the ideas from Hexagonal, Onion, and others into a model with four concentric layers and one unbreakable rule: dependencies only point inward.

**The 4 layers explained:**

```
  ENTITIES (center)
  |  Objects with pure business rules.
  |  E.g.: "An order cannot have a negative total"
  |  They are the MOST stable. They change VERY rarely.
  |
  USE CASES
  |  Application-specific logic.
  |  E.g.: "Create order: verify stock -> calculate total -> save"
  |  They orchestrate entities and define WHAT the app does.
  |
  INTERFACE ADAPTERS
  |  Convert data between the domain format
  |  and the outside world format.
  |  E.g.: Controllers, Presenters, DTOs, Mappers
  |
  FRAMEWORKS & DRIVERS (outermost)
     Everything concrete: Express, React, PostgreSQL,
     AWS SDK, etc. Very little "custom" code lives here.
```

**How data crosses between layers (the million-dollar question):**

```
  Controller --> UseCase --> Entity
       |              |
       |     uses      |     defines
       |     interface |     interface
       v              v
  Request DTO    OutputPort (interface)
                      ^
                      | implements
                 Presenter (outer layer)

  The UseCase NEVER calls the Presenter directly.
  It calls an interface (OutputPort) that it defined itself.
  The Presenter implements it from the outside.
```

**When to use it:** Large apps with complex business logic that need to survive framework and technology changes.

**When NOT to:** MVPs, simple CRUDs, rapid prototypes. The overhead is not justified.

```
REMEMBER:
> THE DEPENDENCY RULE: dependencies only point INWARD
> Entities = universal business rules, Use Cases = app actions
> Frameworks and DBs are DETAILS, not the center of your app
```

### Folder structure example

```
src/
  /domain
    task.entity.ts            <- Entity with business rules
    task.repository.ts        <- Repository interface
  /application
    create-task.use-case.ts   <- One use case = one class
    get-tasks.use-case.ts
    find-task.use-case.ts
    complete-task.use-case.ts
    delete-task.use-case.ts
  /infrastructure
    /persistence
      in-memory-task.repo.ts  <- Concrete repository implementation
    /http
      task.controller.ts      <- Express controller
      task.routes.ts
  main.ts                     <- Wiring + entry point
```

```
ENTITIES (center, universal rules)
+-- /domain          <- Entities, interfaces. Pure TypeScript, zero external imports

USE CASES (rules for this app)
+-- /application     <- Each use case = 1 class with execute()

INTERFACE ADAPTERS (translators)
+-- /infrastructure/http         <- Controllers, routes (HTTP <-> Use Cases)
+-- /infrastructure/persistence  <- Concrete repos (Use Cases <-> DB)

FRAMEWORKS & DRIVERS (technical glue)
+-- main.ts          <- Express, wiring, configuration
```

---

## 2.4 The Hexagonal / Onion / Clean Family -- They Are Cousins

```
  2005              2008              2012
   |                 |                 |
   v                 v                 v
Hexagonal -------> Onion --------> Clean
(Cockburn)      (Palermo)       (Uncle Bob)

+-----------------------------------------------+
|  SHARED PRINCIPLE:                            |
|                                               |
|  1. The domain goes in the CENTER             |
|  2. Infrastructure goes on the OUTSIDE        |
|  3. Dependencies point INWARD                 |
|  4. Dependency Inversion is used to achieve it|
+-----------------------------------------------+
```

**What differentiates them?**

```
  HEXAGONAL                ONION                  CLEAN
  ---------               -------                -------
  Talks about:            Talks about:           Talks about:
  - Ports                 - Domain Model         - Entities
  - Adapters              - Domain Services       - Use Cases
  - Core                  - Application Services  - Interface Adapters
                          - Infrastructure        - Frameworks & Drivers

  Focus:                  Focus:                  Focus:
  Decouple the core       Concentric layers       Dependency Rule
  from the outside        with domain at center   + formalized layers

  BUT THE PRACTICAL RESULT IS ESSENTIALLY THE SAME
```

Understanding one means understanding all three. In practice, most teams take concepts from all three and create their own variant adapted to the project.

```
REMEMBER:
> Hexagonal, Onion, and Clean are the SAME philosophy with different vocabulary
> Domain at the center + Dependency Inversion = the common pattern
> In practice, teams mix concepts from all three
```

### Folder structure example (Onion)

```
src/
  /domain
    /model
      task.entity.ts          <- Entity with identity and rules
      task.repository.ts      <- Repository interface
    /services
      pricing.service.ts      <- Logic that spans multiple entities
  /application
    create-task.use-case.ts   <- Flow orchestration
    complete-task.use-case.ts
  /infrastructure
    /persistence
      mongo-task.repo.ts      <- Concrete repository implementation
    /http
      task.controller.ts      <- Express controller
      task.routes.ts
  main.ts                     <- Wiring + entry point
```

```
DOMAIN MODEL (center, the most stable)
+-- /domain/model    <- Entities, Value Objects, repository interfaces

DOMAIN SERVICES (logic that spans entities)
+-- /domain/services <- Rules involving multiple entities

APPLICATION SERVICES (orchestration)
+-- /application     <- Use cases, coordinate domain services and entities

INFRASTRUCTURE (outermost, most replaceable)
+-- /infrastructure  <- DB, framework, external APIs
```

---

## 2.5 Pipe & Filter

```
  +--------+     +------------+     +-------------+     +--------+
  | PUMP   |---->|  FILTER 1  |---->|   FILTER 2  |---->|  SINK  |
  |(data   |pipe |  Validate  |pipe |  Transform  |pipe |(final  |
  | source)|     |            |     |             |     | dest.) |
  +--------+     +------------+     +-------------+     +--------+

  Each Filter:
  + Receives data through its input
  + Processes it (a single task)
  + Sends it through its output
  x Does NOT know the previous or next filter
  x Does NOT share state with other filters
```

**What it is:** Splitting processing into independent steps (filters) connected by channels (pipes). Data flows linearly from one filter to the next.

Analogy: Unix commands. `cat file | grep "error" | sort | uniq` -- Each command does ONE thing and passes the result to the next.

**When to use it:** Chain data processing (ETL), CI/CD pipelines, compilers, image or audio processing.

**When NOT to:** When steps need to share state, or processing is not linear.

```
REMEMBER:
> Data comes in, gets processed step by step, and comes out transformed
> Each filter is independent, reusable, and replaceable
> Ideal for data processing, NOT for interactive apps
```

---

## 2.6 MVC / MVP / MVVM -- Presentation Patterns

```
  MVC (Model-View-Controller)
  ----------------------------
  +-------+  input   +------------+  updates  +-------+
  |  VIEW |--------->| CONTROLLER |---------->| MODEL |
  |       |<---------|            |<----------|       |
  +-------+ observes +------------+  notifies +-------+

  MVP (Model-View-Presenter)
  ----------------------------
  +-------+  events  +------------+  updates  +-------+
  |  VIEW |--------->| PRESENTER  |---------->| MODEL |
  |       |<---------|            |<----------|       |
  +-------+ updates  +------------+  data     +-------+
  View and Presenter have a 1:1 relationship

  MVVM (Model-View-ViewModel)
  ----------------------------
  +-------+ data-binding +------------+ updates +-------+
  |  VIEW |<============>| VIEW MODEL |-------->| MODEL |
  |       |  automatic   |            |<--------|       |
  +-------+              +------------+  data   +-------+
  View and ViewModel synchronize automatically
```

**What they are:** Three ways to organize the presentation layer (UI). They are not full system architectures, but patterns for separating visual logic from the rest.

- **Model:** The data and business logic
- **View:** What the user sees and interacts with
- **Controller/Presenter/ViewModel:** The intermediary that connects Model with View

**The key difference between the three:**

```
  +----------+----------------+--------------+--------------+
  |          |     MVC        |    MVP       |    MVVM      |
  +----------+----------------+--------------+--------------+
  | Who      | Controller     | Presenter    | ViewModel    |
  | decides  | (receives      | (receives    | (data-binding|
  |          |  input and     |  everything  |  automatic)  |
  |          |  updates)      |  from View)  |              |
  +----------+----------------+--------------+--------------+
  | View/X   | Many Views     | 1 View =     | 1 ViewModel =|
  | relation | 1 Controller   | 1 Presenter  | N Views      |
  +----------+----------------+--------------+--------------+
  | Testing  | Difficult      | Good         | The best     |
  +----------+----------------+--------------+--------------+
  | Ideal    | Traditional    | Apps with    | Apps with    |
  | for      | web apps       | complex UI   | reactive UI  |
  +----------+----------------+--------------+--------------+
```

**Important note:** MVC/MVP/MVVM live INSIDE the presentation layer of any other architecture. You can have Clean Architecture + MVVM in the outer layer, or Hexagonal + MVC.

```
REMEMBER:
> MVC/MVP/MVVM are not alternatives to Hexagonal or Clean
> They are patterns for organizing the UI, they live INSIDE the presentation layer
> MVC = classic web, MVP = Android/WinForms, MVVM = React/Vue/WPF
```

---

## 2.7 Decision Map -- Which One to Choose?

```
  What type of app are you building?
           |
           +-- Simple CRUD, little logic ------------> Layered (N-Tier)
           |
           +-- Complex business logic,
           |   want to decouple from framework ------> Hexagonal or Clean
           |
           +-- Data processing pipeline
           |   in a chain --------------------------> Pipe & Filter
           |
           +-- How do I organize the UI?
                    |
                    +-- Classic web ------------------> MVC
                    +-- Mobile/desktop app -----------> MVP or MVVM
                    +-- Reactive app (React,
                        Vue, Angular) ---------------> MVVM
```

```
  COMMON COMBINATIONS IN THE REAL WORLD:

  +---------------------------------------------+
  |  Clean Architecture + MVVM (React)          |
  |  Hexagonal + MVC (Spring Boot)              |
  |  Layered + MVC (Django, Rails)              |
  |  Clean Architecture + CQRS (inside          |
  |    a microservice)                          |
  +---------------------------------------------+
```

---

**Executive Summary -- Section 2**

```
+----------------------------------------------------------+
|  CODE ARCHITECTURE -- The essentials                      |
|                                                          |
|  1. Layered: horizontal layers, simple but coupled       |
|     to the DB. Ideal for CRUDs.                          |
|                                                          |
|  2. Hexagonal: domain at the center with ports/adapters. |
|     The domain does NOT depend on anything external.     |
|                                                          |
|  3. Clean: formalizes Hexagonal with 4 layers and the    |
|     Dependency Rule (everything points inward).          |
|                                                          |
|  4. Hexagonal ~ Onion ~ Clean: same philosophy,          |
|     different vocabulary.                                |
|                                                          |
|  5. Pipe & Filter: linear data processing.               |
|                                                          |
|  6. MVC/MVP/MVVM: UI patterns that live INSIDE           |
|     the presentation layer of any architecture.          |
|                                                          |
|  7. THE UNIVERSAL PRINCIPLE: business logic is the       |
|     most valuable thing. Protect it from technical       |
|     details.                                             |
+----------------------------------------------------------+
```
