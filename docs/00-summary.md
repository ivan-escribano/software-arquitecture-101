# Software Architecture 101 — Complete Summary

---

## 1. Foundations

```
  WHAT IS SOFTWARE ARCHITECTURE?
  ══════════════════════════════

  ┌───────────┐     ┌──────────────┐     ┌──────────────────┐
  │Components │────▶│ Relationships │────▶│ Principles that  │
  │(the pieces)│    │(how they      │     │guide design and  │
  │           │     │ connect)      │     │evolution         │
  └───────────┘     └──────────────┘     └──────────────────┘

  "Fundamental decisions that are EXPENSIVE to change once implemented"
```

Two independent levels of decision:

```
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  LEVEL 1: SYSTEM                                    │
  │  "How do I DEPLOY and communicate the pieces?"      │
  │  Monolith, Microservices, Serverless, Event-Driven  │
  │                                                     │
  │  LEVEL 2: CODE                                      │
  │  "How do I ORGANIZE code INSIDE each piece?"        │
  │  Layered, Hexagonal, Clean, Pipe & Filter           │
  │                                                     │
  │  They combine FREELY:                               │
  │  Microservices + Clean Architecture ← valid         │
  │  Monolith + Hexagonal ← valid                       │
  │                                                     │
  └─────────────────────────────────────────────────────┘
```

```
REMEMBER:
→ Architecture = macro, expensive to change
→ Design = micro, cheaper to change
→ System + Code are two SEPARATE decisions
→ No perfect architecture. Only the right one for YOUR context.
```

---

## 2. Code Architecture

### Layered (N-Tier)

```
  ┌──────────────────────────┐
  │  PRESENTATION            │  controllers, routes
  ├──────────────────────────┤
  │  BUSINESS LOGIC          │  services
  ├──────────────────────────┤
  │  DATA ACCESS             │  repositories, models
  ├──────────────────────────┤
  │  DATABASE                │  PostgreSQL, Mongo
  └──────────────────────────┘

  Dependency: TOP → DOWN
  Each layer ONLY talks to the one below.
```

```
  PROBLEM:
  Business Logic ──depends──▶ Data Access
  Change the DB → touch the business logic

  WHEN TO USE:      CRUDs, simple apps, MVPs
  WHEN NOT:         complex business logic
```

```
REMEMBER:
→ Simplest architecture. Everyone knows it.
→ Business logic COUPLED to database
→ If your app is a glorified CRUD, Layered is perfect
```

---

### Hexagonal (Ports & Adapters)

```
  OUTSIDE                        OUTSIDE
  REST, CLI ──▶ INPUT PORTS ──▶ CORE ──▶ OUTPUT PORTS ──▶ DB, APIs
  (adapters)     (interfaces)  (domain)   (interfaces)     (adapters)

  ┌──────────────────────────────────────┐
  │  The CORE defines its own contracts  │
  │  (ports). Adapters implement them.   │
  │  The Core NEVER depends on outside.  │
  └──────────────────────────────────────┘
```

```
  THE INVERSION:

  WITHOUT Hexagonal:  Business ──depends──▶ PostgresRepo
  WITH Hexagonal:     Business ──depends──▶ RepoInterface ◀──implements── PostgresRepo

  The arrow FLIPPED. Infra depends on domain, not the other way.
```

```
REMEMBER:
→ Domain defines ports, infra implements adapters
→ Dependency Inversion Principle is the pillar
→ Can swap DB, framework, UI without touching domain
```

---

### Clean Architecture

```
  ┌─────────────────────────────────────────────┐
  │  FRAMEWORKS & DRIVERS (Express, DB)         │
  │   ┌─────────────────────────────────────┐   │
  │   │  INTERFACE ADAPTERS (Controllers)   │   │
  │   │   ┌─────────────────────────────┐   │   │
  │   │   │  USE CASES (app logic)      │   │   │
  │   │   │   ┌─────────────────────┐   │   │   │
  │   │   │   │  ENTITIES (rules)   │   │   │   │
  │   │   │   └─────────────────────┘   │   │   │
  │   │   └─────────────────────────────┘   │   │
  │   └─────────────────────────────────────┘   │
  └─────────────────────────────────────────────┘

  THE DEPENDENCY RULE:
  Dependencies ONLY point INWARD.
  Nothing in the center knows anything about the outside.
```

```
  ENTITIES ──────── Universal business rules. Most stable.
  USE CASES ─────── THIS app's logic. 1 class per use case.
  ADAPTERS ──────── Translators (controllers, DTOs).
  FRAMEWORKS ────── Glue code (Express, DB). Most replaceable.
```

```
REMEMBER:
→ Dependencies ONLY point inward
→ Entities = business rules, Use Cases = app actions
→ Frameworks and DB are DETAILS, not the center
```

---

### Hexagonal ≈ Onion ≈ Clean

```
  HEXAGONAL (2005)     ONION (2008)          CLEAN (2012)
  ═══════════════      ══════════════        ═════════════

  Core ────────────── Domain Model ──────── Entities
                      Domain Services       (absorbed into Use Cases)
                      App Services ──────── Use Cases
  Ports ───────────── Interfaces ─────────── Interfaces
  Adapters ─────────── Infrastructure ───── Adapters + Frameworks
```

```
REMEMBER:
→ Same philosophy, different vocabulary
→ Domain at center + Dependency Inversion = the shared principle
→ Teams mix concepts from all three in practice
```

---

### MVC / MVP / MVVM

```
  NOT alternatives to Hexagonal or Clean.
  They live INSIDE the presentation layer.

              ┌── MVC  = web (Django, Rails, Express)
  UI Patterns ┤── MVP  = mobile/desktop (Android)
              └── MVVM = reactive (React, Vue, Angular)
```

---

### Pipe & Filter

```
  Input ──▶ [Validate] ──▶ [Transform] ──▶ [Save] ──▶ Output

  Each filter: independent, reusable, replaceable.
  Like Unix: cat file | grep "error" | sort | uniq
```

```
REMEMBER:
→ Linear data processing, each step independent
→ Ideal for ETL, CI/CD pipelines, compilers
→ NOT for interactive apps
```

---

## 3. System Architecture

### Monolith

```
  ┌──────────────────────────┐
  │  ALL CODE IN ONE BLOCK   │
  │                          │
  │  1 build, 1 deploy       │
  │  Shared database         │
  │                          │
  │  Simple to develop       │
  │  Simple to test          │
  │  Simple to debug         │
  └──────────────────────────┘

  Start HERE. Always.
  Netflix, Amazon, Shopify all started as monoliths.
```

```
REMEMBER:
→ Simple is not bad. Basecamp makes millions with a monolith.
→ The problem is a BADLY designed monolith, not the monolith itself.
```

---

### Modular Monolith

```
  ┌──────────────────────────────────────────┐
  │  ONE DEPLOYMENT                          │
  │                                          │
  │  ┌──────────┐      ┌──────────┐         │
  │  │ Module A │      │ Module B │         │
  │  │ domain   │      │ domain   │         │
  │  │ infra    │      │ infra    │         │
  │  │ index.ts │◄────▶│ index.ts │         │
  │  └──────────┘      └──────────┘         │
  │      communicate ONLY through            │
  │      public API (index.ts)               │
  └──────────────────────────────────────────┘
```

```
  CLASSIC MONOLITH               MODULAR MONOLITH
  ════════════════               ════════════════

  OrderService                   OrderModule
    ↓                              ↓
  userRepo.findById(1)           userModule.getProfile(1)
  (reaches DIRECTLY into         (asks through
   another domain's guts)         public interface)
```

```
REMEMBER:
→ 80% of microservices benefits without 80% of complexity
→ The "sweet spot" for most medium-large projects
→ Shopify runs at massive scale with this
```

---

### Microservices

```
  ┌─────┐  ┌─────┐  ┌─────┐
  │Svc A│  │Svc B│  │Svc C│     Each service:
  │+DB  │  │+DB  │  │+DB  │     own process, own DB,
  └──┬──┘  └──┬──┘  └──┬──┘     own deploy, own team
     └────┬────┘───────┘
       API Gateway

  WHAT YOU GAIN              WHAT YOU PAY
  ══════════════             ════════════
  Scale per service          Network complexity
  Independent teams          Distributed transactions
  Independent deploy         Debugging VERY hard
  Isolated failures          Infra cost (K8s, monitoring)
```

```
REMEMBER:
→ Maximum flexibility, MAXIMUM complexity
→ When: 20+ people, mature DevOps, clear bounded contexts
→ Don't start here unless the pain justifies it
```

---

### The Natural Evolution

```
  Monolith ──────▶ Modular Monolith ──────▶ Microservices
  (1-5 people)      (5-20 people)            (20+, only if needed)

  BAJA                MEDIA                   ALTA
  complejidad         complejidad             complejidad
```

```
REMEMBER:
→ Don't skip phases
→ You can stay at Modular Monolith forever if it works
→ Extract to microservice ONLY when a module needs independent scaling
```

---

### Serverless

```
  Event ──▶ YOUR FUNCTION ──▶ Result
  (HTTP, timer, queue)

  Cloud manages: servers, scaling, availability
  You pay: per millisecond of execution
```

```
REMEMBER:
→ Zero server management, auto-scaling to 0 and to infinity
→ Trade-offs: cold starts, vendor lock-in, execution limits
→ Ideal for variable traffic and event-driven tasks
```

---

### Event-Driven Architecture

```
  ┌──────────┐                      ┌──────────┐
  │ PRODUCER │──"OrderCreated"──▶   │CONSUMER A│
  │          │                 │    └──────────┘
  └──────────┘          EVENT BUS
                               │    ┌──────────┐
                               └──▶ │CONSUMER B│
                                    └──────────┘

  Producer doesn't know who consumes.
  Consumer doesn't know who produces.
  Communication is ASYNCHRONOUS.
```

```
  CHOREOGRAPHY                   ORCHESTRATION
  ══════════════                 ═══════════════
  Each service reacts            A "director" coordinates
  on its own to events           the flow

  A ──event──▶ B                 Director ──▶ A ──▶ B ──▶ C
  More decoupled                 Flow more visible
  Harder to trace                Director = single point of failure
```

```
REMEMBER:
→ Maximum decoupling + async processing
→ Trade-off: debugging and traceability get very complex
→ When: microservices communication, real-time systems
```

---

### CQRS + Event Sourcing

```
  CQRS: separate WRITE from READ
  ═══════════════════════════════

  Commands ──▶ Write DB (normalized)
  Queries ───▶ Read DB (denormalized, fast)


  EVENT SOURCING: store EVERY change as immutable event
  ════════════════════════════════════════════════════

  Event 1: AccountCreated   { balance: 0 }
  Event 2: MoneyDeposited   { amount: 200 }
  Event 3: MoneyWithdrawn   { amount: 50 }
  ─────────────────────────────────────────
  Current state = replay all events = 150

  Never delete, never modify. Only APPEND.
```

```
REMEMBER:
→ CQRS: optimize each side independently
→ Event Sourcing: complete audit trail, reconstruct any point in time
→ Together = powerful but VERY complex. Use only when benefit is clear.
```

---

### SOA

```
  Services ──▶ ESB (Enterprise Service Bus) ──▶ Services

  The grandfather of microservices.
  Centralized bus. Enterprise legacy.
  Not for new projects.
```

---

## 4. DDD (Domain-Driven Design)

```
  DDD is NOT an architecture. It's a METHODOLOGY.
  ═══════════════════════════════════════════════

  ┌─────────────────────┐     ┌─────────────────────┐
  │  STRATEGIC DESIGN   │     │  TACTICAL DESIGN    │
  │                     │     │                     │
  │  "Where do I CUT    │     │  "How do I MODEL    │
  │   the system?"      │     │   inside each cut?" │
  │                     │     │                     │
  │  - Bounded Contexts │     │  - Entities         │
  │  - Ubiquitous Lang  │     │  - Value Objects    │
  │  - Context Maps     │     │  - Aggregates       │
  │                     │     │  - Domain Events    │
  │  Impacts SYSTEM     │     │  - Repositories     │
  │  architecture       │     │  Impacts CODE       │
  │                     │     │  architecture       │
  └─────────────────────┘     └─────────────────────┘

  DDD is the BRIDGE between system and code architecture.
```

```
REMEMBER:
→ Strategic = where to cut (Bounded Contexts)
→ Tactical = how to model inside (Entities, VOs, Aggregates)
→ Each Bounded Context = 1 module or 1 microservice
```

---

## 5. Key Concepts (from exercises)

### Cohesion vs Coupling

```
  COHESION (inside a module)           COUPLING (between modules)
  ══════════════════════════           ════════════════════════════

  ┌──────────────────┐                ┌──────────┐     ┌──────────┐
  │  Task Module     │                │  Tasks   │────▶│  Users   │
  │  task.entity     │                │          │────▶│          │
  │  task.repository │ Everything     │          │────▶│          │
  │  create-task     │ talks about    └──────────┘     └──────────┘
  │  complete-task   │ TASKS
  └──────────────────┘                Many arrows = high coupling = BAD
  = HIGH cohesion = GOOD
```

```
REMEMBER:
→ Cohesion = related things TOGETHER (inside module)
→ Coupling = how much one module DEPENDS on another
→ Goal: HIGH cohesion + LOW coupling
```

---

### Dependency Injection vs Parameters

```
  ┌────────────────────────────────────────┐
  │                                        │
  │  Will you call METHODS on it?          │
  │                                        │
  │  YES → inject in constructor           │
  │        taskRepo.save(), .findById()    │
  │        = you need it alive to operate  │
  │                                        │
  │  NO  → pass as parameter               │
  │        userId = "abc123"               │
  │        = just dead data, no methods    │
  │                                        │
  └────────────────────────────────────────┘

  Constructor → things from YOUR module
  Parameters  → data from OTHER modules (ids, strings)
```

```
REMEMBER:
→ Inject repos/services from YOUR module
→ Pass data from OTHER modules as primitives
→ If you inject another module's repo, you're coupled
```

---

### Which Module Owns a Use Case?

```
  QUESTION 1: Which ENTITY changes?
  assign-task → Task changes → belongs to TASKS
  delete-user → User deleted → belongs to USERS

  QUESTION 2: Side effects?
  delete-user unassigns tasks → side effect → via public API

  QUESTION 3: Without which module it doesn't exist?
  assign-task without Tasks → doesn't exist → belongs to TASKS
```

```
REMEMBER:
→ Who CHANGES? → that module
→ Side effects? → via public API
→ Can't exist without? → that's where it belongs
```

---

### Cross-Module Orchestration

```
  DOMAIN      → sees NOTHING outside          (the chef)
  APPLICATION → sees only ITS OWN domain      (the waiter)
  INFRA       → can see EVERYTHING            (the manager)
                 ↑
          only place where you can
          call another module
```

```
REMEMBER:
→ Controller (infra) orchestrates between modules
→ Use case receives clean data, doesn't know where it came from
→ Cross-module validation lives in infra, not in application
```

---

### Entity vs Use Case

```
  ENTITY (memory)                USE CASE (persistence)
  ═══════════════                ════════════════════════

  task.unassign()                1. repo.findByUserId(id)
  this.assignedTo = null         2. task.unassign()
       ↑                         3. repo.save(task)
  Changes in RAM.                      ↑
  If nobody saves,               Makes the change
  it DISAPPEARS.                 PERMANENT.
```

```
REMEMBER:
→ Entity = knows HOW to change its data. Doesn't know persistence.
→ Use Case = knows WHERE to find and WHEN to save. Doesn't know HOW data changes.
→ Without the use case, the entity's change is lost.
```

---

## 6. Decision Maps

### Code Architecture

```
               ┌── CRUD simple ──────────────▶ Layered
               │
  Your app ────┤── Complex business logic ───▶ Hexagonal or Clean
               │
               ├── Data processing pipeline ─▶ Pipe & Filter
               │
               └── Organizing UI ────────────▶ MVC / MVP / MVVM
```

### System Architecture

```
               ┌── Small team, new product ──────▶ Monolith
               │
               ├── Medium team, complex logic ───▶ Modular Monolith
               │
  Your team ───┤── Large teams, need scale ──────▶ Microservices
               │
               ├── Variable traffic, events ─────▶ Serverless
               │
               ├── Async communication ──────────▶ Event-Driven
               │
               └── Reads >>> Writes, audit ──────▶ CQRS + Event Sourcing
```

---

## 7. What You Built

### Exercise 1: todo-ddd-api (Clean Architecture)

```
  src/domain       → Task entity + TaskRepository interface (0 external imports)
  src/application  → 5 use cases (create, find, list, complete, delete)
  src/infrastructure → InMemoryRepo, Controller, Routes
  main.ts          → wiring with manual dependency injection

  PROOF: can swap InMemory for Mongo changing only main.ts
```

### Exercise 2: monolith-to-modular

```
  BEFORE: 6 coupling threads between Tasks and Users
  ══════════════════════════════════════════════════

  task.entity ──import User──────────▶ Users
  create-task ──import UserRepo──────▶ Users
  assign-task ──import UserRepo──────▶ Users
  delete-user ──import TaskRepo──────▶ Tasks
  routes.ts ──mixes both─────────────▶ Both


  AFTER: 1 thin thread per module via public API
  ═══════════════════════════════════════════════

  src/modules/tasks → own domain, application, infra, index.ts
  src/modules/users → own domain, application, infra, index.ts
  main.ts           → wires both via public APIs

  Task uses userId: string (not User object)
  Use cases only inject their OWN module's repos
  Cross-module calls go through index.ts only
```
