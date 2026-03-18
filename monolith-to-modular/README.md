# Monolith to Modular

You have a working monolith with two domains (Tasks + Users) coupled together. Your job is to refactor it into a **modular monolith** — same deployment, but with isolated modules that communicate through public interfaces.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
  - [Classic Monolith](#classic-monolith)
  - [Modular Monolith](#modular-monolith)
  - [The Key Difference](#the-key-difference)
- [Current State (What You Have)](#current-state-what-you-have)
  - [Folder Structure](#folder-structure)
  - [Coupling Points](#coupling-points)
- [The Exercise](#the-exercise)
  - [Goal](#goal)
  - [Target Structure](#target-structure)
  - [Rules](#rules)
  - [Endpoints](#endpoints)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Phase A: Identify the Boundaries](#phase-a-identify-the-boundaries)
  - [Phase B: Create the Module Structure](#phase-b-create-the-module-structure)
  - [Phase C: Move and Isolate Domain](#phase-c-move-and-isolate-domain)
  - [Phase D: Define Public APIs](#phase-d-define-public-apis)
  - [Phase E: Fix the Cross-Domain Use Cases](#phase-e-fix-the-cross-domain-use-cases)
  - [Phase F: Split Routes and Wiring](#phase-f-split-routes-and-wiring)
- [Checkpoints](#checkpoints)
- [Key Concepts](#key-concepts)
  - [Cohesion vs Coupling](#cohesion-vs-coupling)
  - [How Coupling is Created and Broken](#how-coupling-is-created-and-broken)
  - [Deciding Which Module Owns a Use Case](#deciding-which-module-owns-a-use-case)
  - [Dependency Injection vs Parameters](#dependency-injection-vs-parameters)
  - [Cross-Module Orchestration Lives in Infra](#cross-module-orchestration-lives-in-infra)
  - [Entity vs Use Case: Memory vs Persistence](#entity-vs-use-case-memory-vs-persistence)

---

## Architecture Overview

### Classic Monolith

```
  ┌──────────────────────────────────────┐
  │           ONE DEPLOYMENT             │
  │                                      │
  │  /domain                             │
  │    task.entity.ts                    │
  │    user.entity.ts     ← all mixed   │
  │    task.repository.ts               │
  │    user.repository.ts               │
  │                                      │
  │  /application                        │
  │    create-task.use-case.ts           │
  │    create-user.use-case.ts           │
  │    assign-task.use-case.ts ← crosses │
  │    delete-user.use-case.ts ← crosses │
  │                                      │
  │  /infrastructure                     │
  │    routes.ts  ← one file, all routes │
  │                                      │
  │  Everything knows everything.        │
  │  No boundaries. Free-for-all.        │
  └──────────────────────────────────────┘
```

This is what you have now. It works, but:

- Task entity imports User entity directly
- Use cases cross domains freely (CreateTask looks up users, DeleteUser modifies tasks)
- A single routes file handles both domains
- Changing Users could break Tasks without warning

### Modular Monolith

```
  ┌──────────────────────────────────────────────┐
  │              ONE DEPLOYMENT                   │
  │                                               │
  │  ┌──────────────┐      ┌──────────────┐      │
  │  │  TASKS       │      │  USERS       │      │
  │  │  MODULE      │      │  MODULE      │      │
  │  │              │      │              │      │
  │  │  /domain     │      │  /domain     │      │
  │  │  /application│      │  /application│      │
  │  │  /infra      │      │  /infra      │      │
  │  │              │      │              │      │
  │  │  index.ts ◄──┼──────┼── index.ts   │      │
  │  │  (public API)│      │  (public API)│      │
  │  └──────────────┘      └──────────────┘      │
  │         │                      │              │
  │         └───── communicate ────┘              │
  │           ONLY through index.ts               │
  │           (public interfaces)                 │
  └──────────────────────────────────────────────┘
```

This is what you need to build. Same deployment, but:

- Each module is a **black box** to the other
- Modules expose ONLY what's needed through `index.ts`
- No direct imports between module internals
- Changing Users' internals CANNOT break Tasks

### The Key Difference

```
  CLASSIC MONOLITH                    MODULAR MONOLITH
  ────────────────                    ─────────────────

  CreateTaskUseCase                   CreateTaskUseCase
    ↓                                   ↓
  userRepository.findById(id)         userModule.findUserById(id)
  (reaches DIRECTLY into              (asks through the
   another domain's guts)              public interface)

  ┌────────────────┐                  ┌───────────┐  ┌───────────┐
  │  SHARED DOMAIN │                  │   TASKS   │  │   USERS   │
  │  tasks + users │                  │  (owns    │  │  (owns    │
  │  all mixed     │                  │   its     │  │   its     │
  └────────────────┘                  │   data)   │  │   data)   │
                                      └───────────┘  └───────────┘
```

---

## Current State (What You Have)

### Folder Structure

```
src/
  /domain
    task.entity.ts          ← imports User entity directly
    task.repository.ts
    user.entity.ts
    user.repository.ts
  /application
    create-task.use-case.ts ← receives UserRepository
    find-task.use-case.ts
    list-tasks.use-case.ts
    complete-task.use-case.ts
    delete-task.use-case.ts
    assign-task.use-case.ts ← receives both repositories
    get-user-tasks.use-case.ts ← receives both repositories
    create-user.use-case.ts
    find-user.use-case.ts
    list-users.use-case.ts
    delete-user.use-case.ts ← receives TaskRepository
  /infrastructure
    /http
      task.controller.ts
      user.controller.ts
      routes.ts             ← one file for ALL routes
    /persistence
      in-memory-task.repo.ts
      in-memory-user.repo.ts
main.ts
```

### Coupling Points

These are the specific places where Tasks and Users are tangled:

```
  COUPLING MAP
  ════════════

  task.entity.ts ──imports──▶ user.entity.ts
       │
       │  Task has "assignedTo: User | null"
       │  Task.assign() receives a User object
       └─────────────────────────────────────

  create-task.use-case.ts ──uses──▶ UserRepository
       │
       │  Looks up user by ID to assign on creation
       └─────────────────────────────────────

  assign-task.use-case.ts ──uses──▶ UserRepository + TaskRepository
       │
       │  Finds user, finds task, assigns user to task
       └─────────────────────────────────────

  get-user-tasks.use-case.ts ──uses──▶ UserRepository + TaskRepository
       │
       │  Validates user exists, then queries tasks by userId
       └─────────────────────────────────────

  delete-user.use-case.ts ──uses──▶ TaskRepository
       │
       │  Unassigns all tasks from user before deleting
       └─────────────────────────────────────

  routes.ts
       │
       │  Single file mixing /tasks and /users routes
       │  Cross-domain route: GET /users/:userId/tasks
       └─────────────────────────────────────
```

---

## The Exercise

### Goal

Refactor this monolith into a **modular monolith** where Tasks and Users are isolated modules that communicate only through their public API (`index.ts`).

### Target Structure

```
src/
  /modules
    /tasks
      /domain
        task.entity.ts
        task.repository.ts
      /application
        create-task.use-case.ts
        find-task.use-case.ts
        list-tasks.use-case.ts
        complete-task.use-case.ts
        delete-task.use-case.ts
        assign-task.use-case.ts
        get-user-tasks.use-case.ts
      /infrastructure
        /http
          task.controller.ts
          task.routes.ts
        /persistence
          in-memory-task.repo.ts
      index.ts              ← PUBLIC API of Tasks module
    /users
      /domain
        user.entity.ts
        user.repository.ts
      /application
        create-user.use-case.ts
        find-user.use-case.ts
        list-users.use-case.ts
        delete-user.use-case.ts
      /infrastructure
        /http
          user.controller.ts
          user.routes.ts
        /persistence
          in-memory-user.repo.ts
      index.ts              ← PUBLIC API of Users module
  /shared                   ← only shared interfaces if needed
main.ts
```

### Rules

```
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  1. /tasks CANNOT import from /users/domain          │
  │     or /users/application or /users/infrastructure   │
  │                                                      │
  │  2. /users CANNOT import from /tasks/domain          │
  │     or /tasks/application or /tasks/infrastructure   │
  │                                                      │
  │  3. Cross-module communication goes through          │
  │     index.ts ONLY (the public API)                   │
  │                                                      │
  │  4. Each module has its own routes file               │
  │                                                      │
  │  5. main.ts wires everything together                │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

### Endpoints

All existing endpoints must keep working after refactoring:

| Method  | Path                       | Description          |
| ------- | -------------------------- | -------------------- |
| `POST`  | `/api/tasks`               | Create task          |
| `GET`   | `/api/tasks`               | List all tasks       |
| `GET`   | `/api/tasks/:id`           | Get task by ID       |
| `PATCH` | `/api/tasks/:id/complete`  | Complete task        |
| `PATCH` | `/api/tasks/:id/assign`    | Assign task to user  |
| `DELETE`| `/api/tasks/:id`           | Delete task          |
| `POST`  | `/api/users`               | Create user          |
| `GET`   | `/api/users`               | List all users       |
| `GET`   | `/api/users/:id`           | Get user by ID       |
| `DELETE`| `/api/users/:id`           | Delete user          |
| `GET`   | `/api/users/:userId/tasks` | Get tasks for a user |

---

## Step-by-Step Guide

### Phase A: Identify the Boundaries

Before writing any code, answer these questions:

```
  1. Which entities belong to Tasks?
     → Task

  2. Which entities belong to Users?
     → User

  3. Where do they CROSS?
     → Task has "assignedTo: User"
     → CreateTask looks up User
     → AssignTask needs both
     → GetUserTasks needs both
     → DeleteUser unassigns tasks

  4. How should they communicate INSTEAD?
     → Tasks should NOT know User internals
     → Tasks only needs: "does this userId exist?"
       and "give me a user's public info"
     → Users only needs: "unassign this userId from tasks"
```

Think about what each module's `index.ts` should expose. What's the minimum public API that the other module needs?

### Phase B: Create the Module Structure

Create the folder structure under `src/modules/tasks` and `src/modules/users`. Don't move code yet — just create the empty folders.

### Phase C: Move and Isolate Domain

Move each entity and repository interface into its own module's domain folder. This is where you'll face the first problem:

```
  PROBLEM: Task entity imports User entity
  ════════════════════════════════════════

  Currently:
  task.entity.ts → import { User } from './user.entity'

  After moving, this import BREAKS the module boundary.
  Task module cannot import from User module internals.

  SOLUTION: Think about what Task actually needs from User.
  Does it need the full User object? Or just a userId (string)?
```

### Phase D: Define Public APIs

Create `index.ts` for each module. Think about:

```
  USERS MODULE — What does it need to expose?
  ════════════════════════════════════════════
  → A way to check if a user exists
  → A way to get user public info
  → The use cases that the controller needs
  → The types that other modules need

  TASKS MODULE — What does it need to expose?
  ════════════════════════════════════════════
  → A way to unassign a user from all tasks
  → The use cases that the controller needs
  → The types that other modules need
```

### Phase E: Fix the Cross-Domain Use Cases

This is the hardest part. For each coupling point, decide how to resolve it:

```
  CreateTaskUseCase receives UserRepository
  ──────────────────────────────────────────
  BEFORE: constructor(taskRepo, userRepo)
  AFTER:  How does Tasks verify a user exists
          without importing User's repository?

  AssignTaskUseCase receives both repositories
  ──────────────────────────────────────────
  BEFORE: constructor(taskRepo, userRepo)
  AFTER:  Same question — how does it get
          user info through the public API?

  DeleteUserUseCase modifies tasks
  ──────────────────────────────────────────
  BEFORE: constructor(userRepo, taskRepo)
  AFTER:  How does Users tell Tasks to unassign
          without reaching into Task's internals?
```

Hint: think about what each module's `index.ts` could export as functions or interfaces that the other module can call.

### Phase F: Split Routes and Wiring

- Split `routes.ts` into `task.routes.ts` and `user.routes.ts` inside each module
- Update `main.ts` to wire everything together, importing only from each module's `index.ts`
- The cross-domain route (`GET /users/:userId/tasks`) needs to live somewhere — decide where and why

---

## Checkpoints

### After Phase C

- Are Task and User entities in separate module folders?
- Does Task entity NO LONGER import User entity directly?

### After Phase D

- Does each module have an `index.ts`?
- Can you describe in one sentence what each module exposes?

### After Phase E

- Do cross-domain use cases work through public APIs?
- Does no use case import from another module's internals?

### Final Checkpoint

```
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  1. Do all endpoints still work?                     │
  │     → Test with curl or Postman                      │
  │                                                      │
  │  2. Does /tasks import ANYTHING from                 │
  │     /users/domain or /users/infrastructure?          │
  │     → grep for cross-module imports. Should be ZERO  │
  │                                                      │
  │  3. If you delete Users module entirely,             │
  │     does Tasks module still compile                  │
  │     (ignoring the public API calls)?                 │
  │     → If yes, your boundaries are clean              │
  │                                                      │
  │  4. Could you extract Tasks into its own service     │
  │     later with minimal changes?                      │
  │     → If yes, you understood modular monolith        │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Cohesion vs Coupling

```
  COHESION (inside a module)            COUPLING (between modules)
  ══════════════════════════            ════════════════════════════

  ┌──────────────────┐                 ┌──────────┐     ┌──────────┐
  │  Task Module     │                 │  Tasks   │────▶│  Users   │
  │                  │                 │          │────▶│          │
  │  task.entity     │                 │          │────▶│          │
  │  task.repository │  Everything     └──────────┘     └──────────┘
  │  create-task     │  talks about
  │  complete-task   │  the same       Many arrows = high coupling
  │                  │  topic: TASKS   = BAD
  └──────────────────┘
                                       ┌──────────┐     ┌──────────┐
  Everything together makes sense.     │  Tasks   │──── │  Users   │
  = HIGH cohesion = GOOD               │          │     │          │
                                       └──────────┘     └──────────┘

                                        One thin arrow = low coupling
                                        = GOOD
```

- **Cohesion** = related things live together. If you open a module and everything talks about the same topic, it has high cohesion. If you find Tasks, Users and Payments mixed together, it has low cohesion.
- **Coupling** = how much one module depends on another. If changing Users forces you to touch Tasks, they are highly coupled.

```
  ┌─────────────────────────────────────────┐
  │                                         │
  │  HIGH cohesion + LOW coupling           │
  │  = modules that do ONE thing well       │
  │    and depend little on others          │
  │                                         │
  │  LOW cohesion + HIGH coupling           │
  │  = big ball of mud where everything     │
  │    depends on everything                │
  │                                         │
  └─────────────────────────────────────────┘
```

---

### How Coupling is Created and Broken

Each import from another module is a thread connecting them. More threads = more ways to break.

```
  EACH IMPORT FROM ANOTHER MODULE = ONE MORE THREAD
  ═════════════════════════════════════════════════

  import { User } from 'users/domain'          ← thread 1: knows the class
  import { UserRepository } from 'users/domain' ← thread 2: knows the repo
  import { FindUserUseCase } from 'users/app'   ← thread 3: knows the use case

  3 imports = 3 threads = 3 ways to break
  If User changes a property → Tasks breaks
  If UserRepository changes a method → Tasks breaks
```

**Tool 1: Parameters instead of Dependencies**

```
  BEFORE (coupled)                      AFTER (decoupled)
  ────────────────                      ──────────────────

  class CreateTask {                    class CreateTask {
    constructor(                          constructor(
      taskRepo,                             taskRepo     ← only mine
      userRepo  ← THREAD to Users        ) {}
    ) {}
                                          execute(title, userId?) {
    execute(title, userId?) {                            ↑
      user = userRepo.find(userId)          string = dead data
      task = new Task(title, user)          has no methods
    }                                       doesn't know Users
  }                                       }
                                        }
```

**Tool 2: Public API instead of direct imports**

```
  BEFORE                                AFTER

  Tasks imports directly:               Tasks imports nothing from Users.
  - User (entity)                       If it needs something, it asks
  - UserRepository (interface)          through index.ts:

  create-task.ts:                       controller (infra):
    import { UserRepo }                   user = usersModule.findById(id)
    from 'users/domain'                   if (!user) throw error
         ↑                                task = createTask.execute(title, id)
    knows Users' guts                              ↑
                                          Tasks receives a string
                                          doesn't know Users exists
```

**Before and after in this project:**

```
  BEFORE (6 thick threads)
  ════════════════════════

  task.entity ──import User──────────────▶ Users
  create-task ──import UserRepo──────────▶ Users
  assign-task ──import UserRepo──────────▶ Users
  get-user-tasks ──import UserRepo───────▶ Users
  delete-user ──import TaskRepo──────────▶ Tasks
  routes.ts ──mixes routes from both─────▶ Both


  AFTER (1 thin thread per module)
  ════════════════════════════════

  task.entity ──uses userId: string      (0 threads to Users)
  create-task ──receives userId: string  (0 threads to Users)
  assign-task ──receives userId: string  (0 threads to Users)
  controller  ──calls users.findById()   (1 thread via public API)

  From 6 thick threads to 1 thin one.
```

---

### Deciding Which Module Owns a Use Case

Three questions, in order:

```
  QUESTION 1: Which ENTITY changes?
  ═════════════════════════════════

  assign-task ──▶ Task.assignedTo changes  ──▶ belongs to TASKS
  delete-user ──▶ User gets deleted        ──▶ belongs to USERS
  complete-task ──▶ Task.state changes     ──▶ belongs to TASKS

  If the entity that CHANGES is Task → Tasks module
  If the entity that CHANGES is User → Users module
```

```
  QUESTION 2: What happens as a SIDE EFFECT?
  ═══════════════════════════════════════════

  "Assign a user to a task"

  ┌── Does the task change?      YES → Tasks
  └── Does the user change?      NO

  "Delete a user"

  ┌── Does the user get deleted? YES → Users
  └── Do tasks change?           YES, but as a SIDE EFFECT
                                  → Users asks Tasks via public API
```

```
  QUESTION 3: Without which module does the operation NOT exist?
  ═════════════════════════════════════════════════════════════

  assign-task without Users module → makes sense?
  → YES, the task receives a userId (string) and stores it
  → Doesn't need to know WHAT a User is

  assign-task without Tasks module → makes sense?
  → NO, there's no task to modify
  → Without Tasks the operation doesn't exist

  Where it DOESN'T make sense without → THAT'S where it belongs
```

---

### Dependency Injection vs Parameters

```
  ┌───────────────────────────────────────┐
  │                                       │
  │  Will you call METHODS on it?         │
  │                                       │
  │  YES → inject in constructor          │
  │        (you need it alive to operate) │
  │        taskRepo.save(), .findById()   │
  │                                       │
  │  NO  → pass as parameter              │
  │        (you just read the data)       │
  │        userId = "abc123"              │
  │                                       │
  └───────────────────────────────────────┘
```

```
  INJECT (constructor)                   PARAMETER (execute)
  ════════════════════                   ══════════════════

  taskRepo.save(task)                    userId = "abc123"
       ↑                                     ↑
  you call .save()                       you just READ the value
  you call .findById()                   you don't call anything on it
  you call .delete()                     it has no methods you care about
  = you need the object                  = it's dead data
    to OPERATE on it
```

The rule:

```
  Constructor → things from YOUR module
  (your repo, your domain services)

  Parameters → data from OTHER modules
  (ids, strings, primitive data)

  If you inject a repo from another module, you're coupled.
  Pass the data, not the dependency.
```

---

### Cross-Module Orchestration Lives in Infra

```
  DEPENDENCY RULE (who can know whom)
  ═══════════════════════════════════

  ┌──────────────────────────────────────────┐
  │  INFRASTRUCTURE (outer layer)            │
  │  Can see EVERYTHING: domain, app, and    │
  │  other modules via public API            │
  │                                          │
  │   ┌──────────────────────────────────┐   │
  │   │  APPLICATION (middle layer)      │   │
  │   │  Only sees its OWN domain        │   │
  │   │  Does NOT see other modules      │   │
  │   │                                  │   │
  │   │   ┌──────────────────────────┐   │   │
  │   │   │  DOMAIN (center)         │   │   │
  │   │   │  Sees NOTHING outside    │   │   │
  │   │   └──────────────────────────┘   │   │
  │   └──────────────────────────────────┘   │
  └──────────────────────────────────────────┘

  Inward = OK
  Outward = FORBIDDEN
```

Where can I call another module?

```
  DOMAIN:       usersModule.findById()  → FORBIDDEN
  APPLICATION:  usersModule.findById()  → FORBIDDEN
  INFRA:        usersModule.findById()  → OK
                       ↑
                only place where you can
                know both modules
```

Concrete example: creating a task with a userId

```
  OPTION A: validate in the use case (BREAKS RULES)
  ══════════════════════════════════════════════════

  CreateTaskUseCase (application):
    constructor(taskRepo, usersModule)
                         ↑
                    application knows
                    another module = FORBIDDEN


  OPTION B: validate in the controller (CORRECT)
  ═══════════════════════════════════════════════

  TaskController (infrastructure):
    async create(req, res):
      user = usersModule.findById(userId)  ← infra can
      if (!user) → 404
      task = createTask.execute(title, userId)
                                     ↑
                          pure string, the use case
                          doesn't know Users exists
```

Analogy:

```
  Domain      = the chef       → only cooks, never leaves the kitchen
  Application = the waiter     → carries orders to HIS kitchen, doesn't go to another restaurant
  Infra       = the manager    → can call other restaurants, coordinate orders between kitchens
```

---

### Entity vs Use Case: Memory vs Persistence

```
  ENTITY (state in memory)            USE CASE (persisted state)
  ════════════════════════            ══════════════════════════

  ┌──────────┐                       ┌──────────┐
  │   Task   │                       │ UseCase  │
  │          │                       │          │
  │  .unassign()                     │  1. repo.findByUserId(id)
  │  .complete()                     │  2. task.unassign()
  │  .assign()                       │  3. repo.save(task)
  │          │                       │          │
  │  Changes │                       │  Finds,  │
  │  ITS OWN │                       │  calls   │
  │  data    │                       │  the     │
  │          │                       │  entity, │
  │  in RAM  │                       │  SAVES   │
  └──────────┘                       └──────────┘
       ↑                                  ↑
  If nobody saves,                   Makes the change
  the change DISAPPEARS              PERMANENT
```

Analogy:

```
  ENTITY = writing with pencil on paper
  ══════════════════════════════════════
  You can erase, cross out, rewrite.
  But if you throw away the paper, everything is lost.

  USE CASE = photocopying the paper and filing it
  ═══════════════════════════════════════════════
  1. Finds the right paper (repo.find)
  2. Writes the change (entity.method())
  3. Photocopies and files it (repo.save)

  Without the photocopy, the change is temporary.
```

Who does what:

```
  ┌────────────────────────────────────────────────┐
  │                                                │
  │  ENTITY                                        │
  │  → Knows HOW to change its data                │
  │  → Doesn't know where it lives (DB, file, RAM) │
  │  → Doesn't search for itself                   │
  │  → Doesn't save itself                         │
  │                                                │
  │  USE CASE                                      │
  │  → Knows WHERE to search (repo)                │
  │  → Knows WHEN to save (repo)                   │
  │  → Doesn't know HOW data changes               │
  │    (that's the entity's job)                   │
  │                                                │
  └────────────────────────────────────────────────┘
```
