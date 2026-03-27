# Todo DDD API

A hands-on exercise to practice **Clean/Hexagonal Architecture** by building a simple Task Manager API with Node.js, Express, and TypeScript.

The goal is NOT to build a complex app — it's to practice **separation of concerns** and understand how layers communicate through contracts (interfaces), not concrete implementations.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
  - [Hexagonal Architecture](#hexagonal-architecture-ports--adapters)
  - [Onion Architecture](#onion-architecture)
  - [Clean Architecture](#clean-architecture)
  - [Equivalence Table](#equivalence-table)
- [Exercise Requirements](#exercise-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Business Rules](#business-rules)
  - [Endpoints](#endpoints)
  - [Folder Structure](#folder-structure)
  - [Architectural Constraints](#architectural-constraints)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Phase A: Domain](#phase-a-domain)
  - [Phase B: Application](#phase-b-application-use-cases)
  - [Phase C: Infrastructure](#phase-c-infrastructure)
  - [Phase D: Test](#phase-d-test)
- [Key Concepts](#key-concepts)
  - [Thinking About Entities](#thinking-about-entities)
  - [Entity Actions vs System Actions](#entity-actions-vs-system-actions)
  - [SRP in Use Cases](#srp-in-use-cases)
  - [Dependency Injection vs Inversion](#dependency-injection-vs-inversion)
- [Checkpoints & Litmus Test](#checkpoints--litmus-test)

---

## Architecture Overview

### Hexagonal Architecture (Ports & Adapters)

_Cockburn, 2005_

```
                OUTSIDE WORLD (input)
       REST API, CLI, Tests, GraphQL, WebSockets
                       │
                       ▼
              ┌─────────────────┐
              │   INPUT PORTS   │
              │   (interfaces)  │
              │                 │
              │   Contracts     │
              │   defining HOW  │
              │   requests      │
              │   come in       │
              └────────┬────────┘
                       │
          ┌────────────▼────────────┐
          │                         │
          │          CORE           │
          │                         │
          │   Your business logic   │
          │   Entities, rules,      │
          │   everything that       │
          │   matters               │
          │                         │
          └────────────┬────────────┘
                       │
              ┌────────▼────────┐
              │  OUTPUT PORTS   │
              │  (interfaces)   │
              │                 │
              │  Contracts      │
              │  defining WHAT  │
              │  the core needs │
              │  from outside   │
              └────────┬────────┘
                       │
                       ▼
                OUTSIDE WORLD (output)
       PostgreSQL, Redis, External APIs, Email, S3
```

**Only 3 concepts:**

| Concept      | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| **Core**     | Your business. Imports nothing from outside. Doesn't know Express exists. |
| **Ports**    | Interfaces/contracts. Input: "how things ask me". Output: "what I need from outside". |
| **Adapters** | Concrete implementations. Input: Express controller. Output: MongoRepository. |

**The rule:** The Core defines contracts (ports). Adapters implement them. The Core NEVER depends on an adapter.

---

### Onion Architecture

_Palermo, 2008_

```
  ┌──────────────────────────────────────────────────────┐
  │  INFRASTRUCTURE (outer layer)                        │
  │  Express, MongoDB, Prisma, AWS SDK, controllers,     │
  │  repository implementations. Most replaceable.       │
  │                                                      │
  │   ┌──────────────────────────────────────────────┐   │
  │   │  APPLICATION SERVICES                        │   │
  │   │  Orchestrates complete flows.                │   │
  │   │  "Create order: check stock, calculate       │   │
  │   │   price, charge, save"                       │   │
  │   │  Coordinates Domain Services and entities.   │   │
  │   │  Has NO business rules of its own.           │   │
  │   │                                              │   │
  │   │   ┌──────────────────────────────────────┐   │   │
  │   │   │  DOMAIN SERVICES                     │   │   │
  │   │   │  Logic involving MULTIPLE entities   │   │   │
  │   │   │  that doesn't belong to one.         │   │   │
  │   │   │  "CalculateFinalPrice needs           │   │   │
  │   │   │   Order + User + DiscountPolicy"     │   │   │
  │   │   │                                      │   │   │
  │   │   │   ┌──────────────────────────────┐   │   │   │
  │   │   │   │  DOMAIN MODEL (center)       │   │   │   │
  │   │   │   │  Entities: objects with      │   │   │   │
  │   │   │   │  identity and own rules      │   │   │   │
  │   │   │   │  Value Objects: immutable,   │   │   │   │
  │   │   │   │  no identity (Email, Money)  │   │   │   │
  │   │   │   │  Repository interfaces       │   │   │   │
  │   │   │   │  Most stable. Rarely changes.│   │   │   │
  │   │   │   └──────────────────────────────┘   │   │   │
  │   │   └──────────────────────────────────────┘   │   │
  │   └──────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────┘
```

**4 layers (inside out):**

| Layer                | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Domain Model**     | Entities + Value Objects + interfaces. Pure TypeScript, no external imports. |
| **Domain Services**  | Logic that CROSSES entities. Unique to Onion (not in the other two). |
| **App Services**     | Flow orchestration. Calls domain services and entities in the right order. No business rules. |
| **Infrastructure**   | Everything concrete: DB, framework, UI. Implements the center's interfaces. Most replaceable. |

**The rule:** Dependencies only point inward. Infrastructure can import everything. Domain Model imports from NOBODY.

---

### Clean Architecture

_Uncle Bob, 2012_

```
  ┌──────────────────────────────────────────────────────┐
  │  FRAMEWORKS & DRIVERS (outer layer)                  │
  │  Express, React, PostgreSQL driver, AWS SDK.         │
  │  Mostly "glue" code, just configuration.             │
  │                                                      │
  │   ┌──────────────────────────────────────────────┐   │
  │   │  INTERFACE ADAPTERS                          │   │
  │   │  Convert data between domain format and      │   │
  │   │  external format.                            │   │
  │   │  Controllers, Presenters, Gateways, DTOs     │   │
  │   │                                              │   │
  │   │   ┌──────────────────────────────────────┐   │   │
  │   │   │  USE CASES                           │   │   │
  │   │   │  Application Business Rules.         │   │   │
  │   │   │  Each use case is ONE class.         │   │   │
  │   │   │  Orchestrate data flow to/from       │   │   │
  │   │   │  entities.                           │   │   │
  │   │   │                                      │   │   │
  │   │   │   ┌──────────────────────────────┐   │   │   │
  │   │   │   │  ENTITIES (center)           │   │   │   │
  │   │   │   │  Enterprise Business Rules.  │   │   │   │
  │   │   │   │  Rules that exist             │   │   │   │
  │   │   │   │  INDEPENDENT of the app.     │   │   │   │
  │   │   │   │  Most stable. Rarely changes.│   │   │   │
  │   │   │   └──────────────────────────────┘   │   │   │
  │   │   └──────────────────────────────────────┘   │   │
  │   └──────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────┘
```

**4 layers (inside out):**

| Layer                    | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| **Entities**             | Universal business rules. Exist even without an app. Can be shared across apps. |
| **Use Cases**            | THIS app's business rules. Each use case = 1 class. Changes when requirements change. |
| **Interface Adapters**   | Translators: Controllers, Presenters, Gateways. Convert Request → DTO → Entity and back. |
| **Frameworks & Drivers** | Express, PostgreSQL, React. Just technical "glue". Most replaceable. |

**The Dependency Rule:** Code dependencies ONLY point inward. Nothing in the center knows ANYTHING about what's outside.

---

### Equivalence Table

```
  HEXAGONAL          ONION                 CLEAN
  ═════════          ═════                 ═════

  Core ──────────── Domain Model ──────── Entities
                    Domain Services       (absorbed into Use Cases
                                           or Entities)
                    App Services ──────── Use Cases
  Ports ─────────── Interfaces ─────────── Interfaces
  Adapters ──────── Infrastructure ─────── Interface Adapters
                                           + Frameworks & Drivers
```

---

## Exercise Requirements

### Functional Requirements

The API must allow:

1. Create a task (title required)
2. List all tasks
3. Get a task by ID
4. Complete a task
5. Delete a task

### Business Rules

> These must live inside the Entity.

1. Title cannot be empty
2. Title cannot exceed 200 characters
3. A task is always created with status `"pending"`
4. Only a `"pending"` task can be completed
5. A completed task cannot be completed again
6. A task has an automatic creation date

### Endpoints

| Method   | Path                      | Description     | Response          |
| -------- | ------------------------- | --------------- | ----------------- |
| `POST`   | `/api/tasks`              | Create task     | `201` + task      |
| `GET`    | `/api/tasks`              | List all        | `200` + task[]    |
| `GET`    | `/api/tasks/:id`          | Get by ID       | `200` + task / `404` |
| `PATCH`  | `/api/tasks/:id/complete` | Complete task   | `200` + task / `404` / `400` |
| `DELETE` | `/api/tasks/:id`          | Delete task     | `204` / `404`     |

### Folder Structure

```
/src
  /domain
    task.entity.ts             ← Entity with business rules
    task.repository.ts         ← Interface (Port) for the repository

  /application
    create-task.use-case.ts    ← Use case: create
    list-task.use-case.ts      ← Use case: list all
    find-task.use-case.ts      ← Use case: get by ID
    complete-task.use-case.ts  ← Use case: complete
    delete-task.use-case.ts    ← Use case: delete

  /infrastructure
    /persistence
      in-memory-task.repo.ts   ← Adapter: in-memory repository
    /http
      task.controller.ts       ← Adapter: Express controller
      task.routes.ts           ← Express routes

main.ts                        ← Wiring: connects everything
```

### Architectural Constraints

> These CANNOT be broken.

1. `/domain` imports NOTHING from `/application` or `/infrastructure`. Zero external imports. Pure TypeScript only.
2. `/application` ONLY imports from `/domain`. Uses the `TaskRepository` interface, NEVER the `InMemoryTaskRepository` implementation.
3. `/infrastructure` imports from `/domain` and `/application`. This is where Express and any external dependency lives.
4. `main.ts` is the ONLY file that knows the concrete implementations. It's where manual dependency injection happens.

---

## Step-by-Step Guide

### Phase A: Domain

> Start HERE. Always.

#### File 1: `task.entity.ts`

This is the representation of a Task in your domain. A class that:

- Contains the DATA of a task
- SELF-PROTECTS with its business rules
- Does NOT know Express, MongoDB, or HTTP exist

**Properties:**

- `id` — Unique identifier
- `title` — The task title
- `state` — `"pending"` or `"completed"`
- `createdAt` — Creation timestamp

**Constructor validation:**

- Empty title → error
- Title > 200 characters → error
- State always starts as `"pending"`
- `createdAt` is generated automatically

**Methods:**

- `complete()` — Changes state to `"completed"`. If already completed → error.

Reference example (do NOT copy directly, adapt to Task):

```typescript
class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public price: number,
  ) {
    if (!name) throw new Error('Name required');
    if (price < 0) throw new Error('Price cannot be negative');
  }

  applyDiscount(percent: number) {
    if (percent > 50) throw new Error('Max discount 50%');
    this.price = this.price * (1 - percent / 100);
  }
}
```

#### File 2: `task.repository.ts`

An INTERFACE. A contract. Says WHAT operations the domain needs, but NOT HOW they are implemented.

**Operations needed:**

- `save` — Save a task
- `findById` — Find one by ID
- `findAll` — Get all tasks
- `delete` — Remove a task

Each method returns a `Promise` because it will eventually talk to a database (async).

What does NOT go here: no Mongoose, no SQL, no "how" — only method signatures.

Reference example:

```typescript
interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
}
```

#### Phase A Checkpoint

- Does Task self-validate in the constructor?
- Does `complete()` have its rule?
- Is `TaskRepository` ONLY an interface?
- Are there ZERO external library imports?

If all YES → move to Phase B.

---

### Phase B: Application (Use Cases)

Each Use Case is ONE class with ONE method (`execute`). Does ONE thing. Receives the repository through the constructor (dependency injection with the INTERFACE, not the implementation).

**Flow:** Request → Validate/Search → Operate with Entity → Persist → Respond

#### File 3: `create-task.use-case.ts`

1. Receives a `title` (string)
2. Creates `new Task()` → the entity self-validates
3. Saves via repository (interface)
4. Returns the created task

The use case does NOT repeat validations. It trusts the entity.

#### File 4: `list-task.use-case.ts`

1. Calls `repository.findAll()`
2. Returns the task array

The simplest use case. Almost a "pass-through". Exists as a separate class for consistency and future extensibility (filters, pagination).

#### File 5: `find-task.use-case.ts`

1. Receives an `id` (string)
2. Searches with `findById()`
3. If not found → throws error ("Task not found")
4. If found → returns the task

> Who throws the "not found" error? The USE CASE. Because "not finding something" is not a business rule (entity) nor a DB problem (infra). It's APPLICATION logic.

#### File 6: `complete-task.use-case.ts`

1. Receives an `id` (string)
2. Finds the task in the repo (`findById`)
3. If not found → error
4. Calls `task.complete()` → the entity validates if it can
5. Saves the updated task (`save`)
6. Returns the task

The use case does NOT validate if already completed. That's `task.complete()`'s job in the entity. The use case only ORCHESTRATES: find → operate → save.

#### File 7: `delete-task.use-case.ts`

1. Receives an `id` (string)
2. Finds the task (exists?)
3. If not found → error
4. Deletes via `repository.delete(id)`

Reference example:

```typescript
class DeleteProductUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Product not found');
    await this.productRepo.delete(id);
  }
}
```

#### Phase B Checkpoint

- Does each use case have ONE responsibility?
- Do they receive `TaskRepository` (interface), not `InMemoryTaskRepository`?
- Does the Entity handle business validations, not the use case?
- Does the use case only orchestrate: find → operate → save?
- Are there ZERO imports of Express, Mongo, etc?

If all YES → move to Phase C.

---

### Phase C: Infrastructure

#### File 8: `in-memory-task.repo.ts`

The CONCRETE implementation of `TaskRepository`. Uses an in-memory array (no database).

**Why start with in-memory?**

- No Docker or MongoDB needed to develop
- Tests run instantly
- Proves the domain works WITHOUT infra
- Later you create `MongoTaskRepository` and only change 1 line in `main.ts`

**Hints:**

- `save` — What if the task already exists? (update vs insert). Search by id. If exists, replace. If not, push.
- `findById` — Returns the task or `null`
- `findAll` — Returns a COPY of the array (not the reference)
- `delete` — Filters the array

#### File 9: `task.controller.ts`

The TRANSLATOR between HTTP and your use cases. Receives Express `Request`, calls the use case, returns `Response`.

- Has NO business logic
- Does NOT validate rules (the entity does that)
- Only translates: HTTP → Use Case → HTTP

**Receives via constructor:** the 5 use cases (already instantiated).

**Error handling:** try/catch in each method:

- "not found" → `res.status(404)`
- Broken business rule → `res.status(400)`
- All good → `res.status(200 | 201 | 204)`

Reference example:

```typescript
async create(req: Request, res: Response) {
  try {
    const result = await this.createProduct.execute(req.body.name, req.body.price);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

#### File 10: `task.routes.ts`

A function that receives the controller and returns an Express Router with connected routes.

```
POST   /              → controller.create
GET    /              → controller.list
GET    /:id           → controller.getById
PATCH  /:id/complete  → controller.complete
DELETE /:id           → controller.delete
```

The "dumbest" file. Just connects URLs to methods.

#### File 11: `main.ts`

The ONLY file that knows EVERYTHING. Knows the concrete implementations. Where manual dependency injection happens.

**Steps in order:**

1. Create the concrete repository (`InMemoryTaskRepository`)
2. Create each use case passing the repo
3. Create the controller passing the use cases
4. Create the Express app
5. Register the routes
6. `app.listen()`

This is the only place where `new InMemoryTaskRepository()` appears. If you switch to Mongo tomorrow, you only change HERE.

---

### Phase D: Test

Test all endpoints with curl or Postman and verify that business rules are enforced.

---

## Key Concepts

### Thinking About Entities

When designing an entity, ask yourself these questions in order:

1. **What THING am I modeling?** — A Task is something someone wants to remember and complete. It has its own identity. It has a lifecycle: created → completed.

2. **What DATA does it need to exist?** — Think of a paper card for a task. What fields would it have? ID, title, state, date.

3. **What is VALID and what is NOT?** — Every answer that is "no, that can't happen" = a BUSINESS RULE.

4. **What ACTIONS can it do on itself?** — Each action with conditions = a METHOD with rules.

### Entity Actions vs System Actions

| Entity (Task)                          | System (Use Cases)                        |
| -------------------------------------- | ----------------------------------------- |
| "What can a Task do TO ITSELF?"        | "What can the USER do with tasks?"        |
| Complete itself                        | Create a task                             |
| Validate its own data                  | Get / List / Complete / Delete tasks      |
| Actions that modify internal state     | Actions the user asks the system to do    |

### SRP in Use Cases

Even though the actor is "the user" in all cases, the REASONS FOR CHANGE are different:

| Use Case        | Changes if...                                      |
| --------------- | -------------------------------------------------- |
| `CreateTask`    | Creation requirements change ("now assign a category") |
| `ListTasks`     | Listing requirements change ("now add filters, pagination") |
| `CompleteTask`  | Completion requirements change ("now log who did it") |
| `DeleteTask`    | Deletion requirements change ("now soft-delete instead") |

If they were all in one `TaskService` class, a change in listing (adding filters) could accidentally break creation. Separated, each change only affects ITS use case.

> SRP = "one reason to change", not "one actor"

### Dependency Injection vs Inversion

- **Dependency INVERSION** = Principle (depend on abstractions)
- **Dependency INJECTION** = Technique (dependencies are passed from outside)
- They always go together. One without the other doesn't work.
- You inject SERVICES and INFRASTRUCTURE (repos, external APIs)
- Entities are created with `new`. They are NOT injected.

```typescript
// This is NOT injection. And that's fine.
const task = new Task(title);

// THIS is injection — the repo is passed from outside.
class CreateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}
}
```

---

## Checkpoints & Litmus Test

### Final Self-Evaluation

- Does `/domain` have imports from Express or Mongo? → **NO**
- Do use cases receive the INTERFACE `TaskRepository` or the concrete `InMemoryTaskRepository`? → **The INTERFACE**
- Does the controller have business logic (title validations, state checks)? → **NO, that lives in the entity**
- If I swap InMemory for Mongo, how many files do I touch? → **Only 2: create `mongo-task.repo.ts` + change 1 line in `main.ts`**
- Can I test use cases without Express and without a DB? → **YES, using `InMemoryTaskRepository`**

### Litmus Tests

**Test 1: Tests without infrastructure**
Write tests for the use cases using `InMemoryTaskRepository`. If they pass without Express, without DB, without HTTP → your architecture is CORRECT.

**Test 2: Swap persistence**
Create a `MongoTaskRepository` that implements the SAME interface. Change ONLY in `main.ts`. If you touched ZERO lines in `/domain` or `/application` → you understood the architecture.

**Test 3: Swap the framework**
Replace Express with Fastify. Only `/infrastructure/http` and `main.ts` should change. Nothing else.

### Implementation Order

```
 1.  task.entity.ts           ← FIRST always
 2.  task.repository.ts       ← interface
 3.  create-task.use-case.ts  ← start with the simplest
 4.  list-task.use-case.ts
 5.  find-task.use-case.ts
 6.  complete-task.use-case.ts
 7.  delete-task.use-case.ts
 8.  in-memory-task.repo.ts   ← implementation
 9.  task.controller.ts
10.  task.routes.ts
11.  main.ts                  ← LAST always

From INSIDE out.
Domain first, infrastructure last.
```
