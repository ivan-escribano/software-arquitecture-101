# Practice Plan — From Essential to Extra

```
  PLAN STRUCTURE
  ══════════════

  PHASE 1 ──▶ Clean/Hexagonal (2 weeks)              TIER 1
  PHASE 2 ──▶ Monolith vs Modular vs Micro (1 week)  TIER 1
  PHASE 3 ──▶ DDD Strategic (1 week)                  TIER 1
  PHASE 4 ──▶ Event-Driven + CQRS (1-2 weeks)        TIER 2
  PHASE 5 ──▶ Extras (ongoing)                        TIER 3

  METHOD PER PHASE:
  Theory ──▶ Build ──▶ Explain out loud
  (you already  (real       (if you can't explain
   have it)     project)     it in 2 min, you don't know it)
```

---

## PHASE 1: Clean / Hexagonal (weeks 1-2)

```
  GOAL: Build a project from scratch
  with Clean/Hexagonal using your real stack.
  By the end you must be able to SWAP the DB
  without touching the domain.
```

### Exercise 1.1 — "Task Manager API" Project

```
  Stack: Node.js + TypeScript (or Next.js API Routes)
  DB: start WITHOUT a database (in memory)

  REQUIRED structure:

  /src
    /domain
      task.entity.ts             ← business rules
      task.repository.ts         ← interface (PORT)

    /application
      create-task.use-case.ts    ← business logic
      complete-task.use-case.ts
      get-tasks.use-case.ts

    /infrastructure
      /persistence
        in-memory-task.repo.ts   ← adapter (implements interface)
        mongo-task.repo.ts       ← another adapter (same port)
      /http
        task.controller.ts       ← input adapter

    main.ts                      ← wiring (connects everything)
```

**The 3 rules you CANNOT break:**

```
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  1. /domain does NOT import ANYTHING from outside.   │
  │     Zero imports from /infrastructure or /application.│
  │                                                      │
  │  2. /application only imports from /domain.          │
  │                                                      │
  │  3. /infrastructure imports from both                │
  │     (implements the domain interfaces).              │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

**The step-by-step flow of what you build:**

```
  Week 1, days 1-2:
  ─────────────────
  1. Create task.entity.ts with rules:
     - title cannot be empty
     - title max 100 characters
     - task is always created in "pending" state

  2. Create task.repository.ts (only the INTERFACE):
     - save(task): Promise<void>
     - findById(id): Promise<Task | null>
     - findAll(): Promise<Task[]>

  3. Create InMemoryTaskRepository
     (implements interface with an in-memory array)

  Week 1, days 3-4:
  ─────────────────
  4. Create CreateTaskUseCase:
     - receives title
     - creates Task (entity validates itself)
     - saves via repository (interface)

  5. Create GetTasksUseCase and CompleteTaskUseCase

  6. Create TaskController (Express or similar)
     that calls the use cases

  Week 1, day 5:
  ──────────────
  7. Wire everything in main.ts:
     const repo = new InMemoryTaskRepository()
     const createTask = new CreateTaskUseCase(repo)
     const controller = new TaskController(createTask)

  Test with Postman/curl. It works without a DB.
```

### Exercise 1.2 — The test that PROVES it works

```
  Week 2, days 1-2:
  ─────────────────
  Write tests for Use Cases using InMemoryRepo:

  create-task.use-case.test.ts:
  - Create with valid title → OK
  - Create with empty title → Error
  - Create with title > 100 chars → Error

  complete-task.use-case.test.ts:
  - Complete existing task → status = "done"
  - Complete non-existent task → Error
  - Complete already completed task → Error

  ┌──────────────────────────────────────────────┐
  │  If you can run ALL the tests               │
  │  without MongoDB, without Express,           │
  │  without HTTP, without Docker,               │
  │  without ANY external dependency...          │
  │                                              │
  │  ══▶ Your architecture is CORRECT.           │
  └──────────────────────────────────────────────┘
```

### Exercise 1.3 — The acid test

```
  Week 2, days 3-4:
  ─────────────────
  Create MongoTaskRepository that implements
  the SAME interface task.repository.ts.

  Change in main.ts:
  - const repo = new InMemoryTaskRepository()
  + const repo = new MongoTaskRepository(mongoUri)

  ┌──────────────────────────────────────────────┐
  │  If when switching from InMemory to Mongo    │
  │  you did NOT touch a SINGLE line in /domain  │
  │  or in /application...                       │
  │                                              │
  │  ══▶ You have understood Hexagonal/Clean.    │
  │                                              │
  │  If you had to touch something there,        │
  │  your architecture has a leak.               │
  │  Review where the rule was broken.           │
  └──────────────────────────────────────────────┘
```

### Exercise 1.4 — Explain (crucial for interviews)

```
  Week 2, day 5:
  ──────────────
  Record yourself answering these questions (2 min each):

  1. "Why did you organize the code this way?"
  2. "What happens if you swap MongoDB for PostgreSQL?"
  3. "Where does the rule that the title cannot
      be empty live? Why there?"
  4. "What advantage does this have over putting
      everything in a fat controller?"

  If you can't answer fluently, repeat.
```

```
REMEMBER:
→ The TEST for this phase: swap DB without touching domain or application
→ If tests pass without a real DB, the architecture is correct
→ Bonus: swap Express for Fastify without touching domain
```

---

## PHASE 2: Monolith vs Modular vs Micro (week 3)

```
  GOAL: Evolve the project from Phase 1
  from monolith to modular. Design (without implementing)
  the extraction to a microservice.
```

### Exercise 2.1 — From monolith to modular

```
  STEP 1: Draw in Excalidraw how it looks now
  (1 module, Task Manager = monolith)

  STEP 2: Add a second domain "Users"
  (basic authentication: register + login)
  Put it in the SAME project.
  ──▶ It's still a monolith with 2 mixed domains.

  STEP 3: Refactor to MODULAR MONOLITH:

  /src
    /modules
      /tasks
        /domain
        /application
        /infrastructure
        index.ts          ← PUBLIC API of the module
      /users
        /domain
        /application
        /infrastructure
        index.ts          ← PUBLIC API of the module
    /shared               ← only shared interfaces
    main.ts

  STRICT RULE:
  ┌──────────────────────────────────────────────┐
  │  /tasks CANNOT import from /users/domain     │
  │  or from /users/infrastructure.              │
  │                                              │
  │  It can only use /users/index.ts             │
  │  (the module's public API).                  │
  │                                              │
  │  If you need user data in tasks,             │
  │  request it via the public API, DO NOT       │
  │  access the users DB directly.               │
  └──────────────────────────────────────────────┘
```

### Exercise 2.2 — Design the extraction (without implementing)

```
  In Excalidraw, draw:

  1. Which module would you extract first as a microservice?
     Tasks or Users? Why?

  2. How would they communicate?
     - Synchronous HTTP? (REST)
     - Asynchronous events? (messaging)
     - Both?

  3. What problems appear?
     - Shared data (user data in tasks?)
     - Distributed transactions
     - Network latency
     - Independent deployment

  DO NOT implement. Only DESIGN and ARGUE.
  This is exactly what they ask you
  in system design interviews.
```

### Exercise 2.3 — Interview response

```
  Write (and practice out loud) your answer to:

  "You have an app that is growing. Currently
   it's a monolith. The team is going from 5 to 25
   people. What do you do?"

  Your answer should cover:
  1. Why NOT to jump straight to microservices
  2. Step 1: refactor to modular monolith
  3. Step 2: identify which module to extract first
  4. Criterion: extract when a team needs
     full autonomy or to scale independently
  5. Trade-offs of each option
```

```
REMEMBER:
→ The TEST for this phase: being able to draw the evolution on a whiteboard
→ Knowing how to argue WHY each step and not another
→ "Start simple, add complexity only when the pain justifies it"
```

---

## PHASE 3: DDD Strategic (week 4)

```
  GOAL: Learn to identify Bounded Contexts
  in a real domain. This is what allows you
  to draw module/service boundaries
  with BUSINESS criteria, not technical ones.
```

### Exercise 3.1 — Map your product

```
  Take your product (a real-world application) and do
  a simplified Event Storming:

  STEP 1: List all system EVENTS
  (things that happen, in past tense):

  - UserRegistered
  - ProfileConnected
  - IdeaGenerated
  - TrendDetected
  - ContentCreated
  - CarouselGenerated
  - PostPublished
  - MetricsUpdated
  ...

  STEP 2: Group events by CONTEXT
  (those that talk about the same "topic"):

  ┌─────────────────┐  ┌─────────────────┐
  │ BC: Identity    │  │ BC: Content     │
  │                 │  │                 │
  │UserRegistered   │  │IdeaGenerated    │
  │ProfileConnected │  │ContentCreated   │
  │                 │  │CarouselGenerated│
  └─────────────────┘  │PostPublished    │
                       └─────────────────┘
  ┌─────────────────┐  ┌─────────────────┐
  │ BC: Trends      │  │ BC: Analytics   │
  │                 │  │                 │
  │TrendDetected    │  │MetricsUpdated   │
  │                 │  │                 │
  └─────────────────┘  └─────────────────┘

  STEP 3: Each BC = 1 module (modular monolith)
          or 1 service (microservices)

  STEP 4: Draw the Context Map
  (how the BCs communicate with each other)
```

### Exercise 3.2 — Ubiquitous Language

```
  For each Bounded Context, define:

  What does "content" mean in each context?

  In BC: Content  → "a social media post with text and formatting"
  In BC: Analytics → "an item with engagement metrics"
  In BC: Trends   → "a reference for detecting patterns"

  SAME word, DIFFERENT meaning depending on the context.
  This is Ubiquitous Language.
  And it is the reason why Bounded Contexts exist.
```

### Exercise 3.3 — Map to architecture

```
  Draw in Excalidraw:

  "If your product grew to 30 people,
   how would you organize the teams
   around the Bounded Contexts?"

  ┌────────────────────────────────────────┐
  │  Identity Team (2-3 people)           │
  │  → Auth + profiles module/service     │
  │                                        │
  │  Content Team (4-5 people)            │
  │  → Ideas, posts, carousels            │
  │    module/service                      │
  │                                        │
  │  Analytics Team (2-3 people)          │
  │  → Metrics module/service             │
  └────────────────────────────────────────┘

  DDD Strategic gives you the CRITERIA to
  decide where to cut, based on the BUSINESS,
  not on the technology.
```

```
REMEMBER:
→ The TEST for this phase: being able to draw the BCs of any domain
→ Event Storming (simplified) = your practical tool
→ Bounded Context = the answer to "where do I cut the system?"
```

---

## PHASE 4: Event-Driven + CQRS (weeks 5-6)

```
  GOAL: Understand asynchronous communication
  and read/write separation.
  Conceptual level + design, not complex implementation.
```

### Exercise 4.1 — Add events to the project

```
  Go back to the Task Manager from Phase 1/2.
  Add Domain Events:

  When a task is created:
  → Emit event "TaskCreated"

  When a task is completed:
  → Emit event "TaskCompleted"

  Create a simple Consumer that listens to:
  - TaskCompleted → log "Send notification"
  - TaskCompleted → log "Update statistics"

  Simple implementation (in-memory event emitter).
  You don't need Kafka or RabbitMQ to understand the pattern.

  ┌──────────┐  TaskCompleted  ┌──────────────────┐
  │ Task     │────────────────▶│ NotificationSvc  │
  │ Module   │                 └──────────────────┘
  │          │  TaskCompleted  ┌──────────────────┐
  │          │────────────────▶│ StatsSvc         │
  └──────────┘                 └──────────────────┘

  The Task module does NOT know who consumes.
  It only emits the event.
```

### Exercise 4.2 — Design CQRS (on paper)

```
  Draw in Excalidraw an e-commerce system:

  WRITE SIDE:
  - CreateOrder (command)
  - Validate stock
  - Save to normalized DB

  READ SIDE:
  - GetOrderHistory (query)
  - Read from denormalized DB
  - Optimized for fast reads

  ┌─────────────┐              ┌─────────────┐
  │  COMMANDS   │              │  QUERIES    │
  │  (write)    │              │  (read)     │
  │             │              │             │
  │ CreateOrder │              │ GetHistory  │
  │ CancelOrder │              │ SearchItems │
  └──────┬──────┘              └──────┬──────┘
         │                            │
  ┌──────▼──────┐              ┌──────▼──────┐
  │  Write DB   │───  sync  ──▶│  Read DB    │
  │(normalized) │    async     │(denormalizd)│
  └─────────────┘              └─────────────┘

  DO NOT implement. Only DRAW and know how to EXPLAIN:
  - Why separate reads from writes?
  - When does it make sense?
  - What happens with consistency?
```

### Exercise 4.3 — Interview response

```
  Prepare your answer to:

  "When would you use Event-Driven Architecture
   and when would you NOT?"

  YES:
  - Communication between microservices
  - Asynchronous processing (you don't need an immediate response)
  - Decoupling services to the maximum

  NO:
  - Operations that need a synchronous response
  - Simple systems where it adds complexity without value
  - Teams without experience in distributed systems
```

```
REMEMBER:
→ You can understand Event-Driven without Kafka (event emitter is enough)
→ CQRS: just design it and know how to explain when to use it
→ Both are COMMUNICATION patterns, not deployment patterns
```

---

## PHASE 5: Extras (ongoing)

```
  This has no deadline. It's for going deeper
  when you have time or when it comes up in context.
```

### 5.1 — Serverless (relevant for AI Engineer profiles)

```
  Exercise: Migrate one of the API routes
  from the Task Manager to an Azure Function
  or Vercel Serverless Function.

  Observe:
  - What changes in the architecture?
  - Cold starts
  - Execution limits
```

### 5.2 — Layered vs Clean (know how to argue)

```
  Exercise: Rewrite the Task Manager
  with classic Layered architecture
  (controller → service → repository, all coupled).

  Then compare:
  - What happens if I try to swap the DB? (you have to touch the service)
  - Can I test without a DB? (probably not)
  - When is Layered fine? (simple CRUDs)
```

### 5.3 — Study a real case

```
  Read how Shopify organized their modular monolith.
  Or how Netflix migrated to microservices.
  Take notes on:
  - Why did they make that decision?
  - What problems did they have BEFORE?
  - What problems appeared AFTER?
```

---

## Complete Plan Map

```
  WEEK 1  │ PHASE 1: Clean/Hexagonal
  WEEK 2  │ Project + tests + swap DB
  ────────┤
  WEEK 3  │ PHASE 2: Monolith → Modular → Micro
          │ Evolve project + Excalidraw
  ────────┤
  WEEK 4  │ PHASE 3: DDD Strategic
          │ Event Storming your product + Bounded Contexts
  ────────┤
  WEEK 5  │ PHASE 4: Event-Driven + CQRS
  WEEK 6  │ Events in project + design CQRS
  ────────┤
  ONGOING │ PHASE 5: Serverless, Layered, real cases
```

```
  THE PRINCIPLE THAT GUIDES THE ENTIRE PLAN:

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │  You DON'T learn architecture by reading.        │
  │  You learn by BUILDING + EXPLAINING.             │
  │                                                  │
  │  1. Build a real project (no matter how small)   │
  │     applying the pattern                         │
  │                                                  │
  │  2. Break it on purpose (swap DB, add a module,  │
  │     extract a service) to SEE what breaks        │
  │     and what doesn't                             │
  │                                                  │
  │  3. Explain out loud in 2 minutes                │
  │     (if you can't, you haven't understood it)    │
  │                                                  │
  └──────────────────────────────────────────────────┘
```

```
REMEMBER:
→ PHASE 1 (Clean/Hexagonal) is the most important. Dedicate twice the time there.
→ The UNIVERSAL test: can I swap infrastructure without touching domain?
→ Everything is built on the SAME project, evolving from phase to phase.
→ Explaining > Reading. If you can't explain it in 2 min, you don't know it.
```
