# System Architecture

_"How do I organize, deploy, and communicate the different services or components of my system?"_

## 3.0 The System Architecture Landscape

```
SYSTEM ARCHITECTURES
         |
         +-- DEPLOYMENT (how you deploy)
         |   +-- Classic Monolith
         |   +-- Modular Monolith
         |   +-- Microservices
         |   +-- Serverless
         |   +-- SOA (Service-Oriented)
         |
         +-- COMMUNICATION (how services talk to each other)
             +-- Request/Response (synchronous: REST, gRPC)
             +-- Event-Driven (asynchronous: events)
             +-- CQRS + Event Sourcing (separate read/write)
```

Core idea: at the system level, two decisions must be made -- how code is PACKAGED for deployment, and how the pieces COMMUNICATE with each other.

```
REMEMBER:
> Deployment = how many artifacts you deploy and how
> Communication = how the pieces pass data to each other
> These are SEPARATE decisions that can be combined
```

---

## 3.1 Classic Monolith

```
  +-------------------------------------+
  |          A SINGLE PROCESS            |
  |                                      |
  |  +-----+ +-----+ +-----+ +-----+   |
  |  |Users| |Order| |Paym.| |Notif|   |
  |  |     | |     | |     | |     |   |
  |  +--+--+ +--+--+ +--+--+ +--+--+   |
  |     +-------+-------+-------+       |
  |          SHARED DATABASE             |
  |          +----------+                |
  |          |    DB    |                |
  |          +----------+                |
  +-------------------------------------+
         |
         v
   1 build, 1 deploy, 1 server
```

**What it is:** All application code is compiled and deployed as ONE single unit. All modules share the same process and the same database.

Analogy: a single-family house. Everything under the same roof: kitchen, bedrooms, bathroom. Simple to build, but if the kitchen needs to be expanded, the bathroom may need to be moved.

**The truth nobody tells you:** most successful projects started as a monolith. Netflix, Amazon, Shopify, Twitter -- they all began this way. Migrating prematurely to microservices is one of the most expensive mistakes in engineering.

```
  ADVANTAGES                        DISADVANTAGES
  ----------                        -------------
  * Simple to develop               * One change = redeploy EVERYTHING
  * Simple to test (e2e)            * Scaling = scale EVERYTHING
  * Simple to debug                 * One failure can bring down everything
  * A single deployment             * With large teams, stepping on toes
  * Low operational cost             * Becomes a "big ball of mud"
```

**When to use it:** MVPs, startups, teams < 10 people, product validation, logic that is not overly complex.

```
REMEMBER:
> ALWAYS start here unless there are real reasons not to
> Simple does not mean bad: Basecamp earns millions with a monolith
> The problem is not the monolith -- it is the POORLY designed monolith
```

---

## 3.2 Modular Monolith

```
  +----------------------------------------------+
  |            A SINGLE DEPLOYMENT                |
  |                                               |
  |  +----------+  +----------+  +----------+    |
  |  | MODULE A |  | MODULE B |  | MODULE C |    |
  |  |  Users   |  |  Orders  |  | Payments |    |
  |  |          |  |          |  |          |    |
  |  | domain   |  | domain   |  | domain   |    |
  |  | infra    |  | infra    |  | infra    |    |
  |  | api      |  | api      |  | api      |    |
  |  +----+-----+  +----+-----+  +----+-----+    |
  |       |              |              |         |
  |       +---- PUBLIC API ------------+          |
  |       (interfaces between modules)            |
  |                                               |
  |  +---------+ +---------+ +---------+          |
  |  |  DB A   | |  DB B   | |  DB C   |          |
  |  |(schema) | |(schema) | |(schema) |          |
  |  +---------+ +---------+ +---------+          |
  |  (can be separate schemas or tables           |
  |   with a strict rule: never access another    |
  |   module's data directly)                     |
  +----------------------------------------------+
```

**What it is:** A single deployment (like a monolith), but internally divided into modules with clear boundaries. Each module has its own domain, its own infrastructure, and only communicates with other modules through well-defined public interfaces. It never accesses another module's data directly.

Analogy: an office building. A single building (one deployment), but each floor is a different company with its own door, its own rules, and they communicate only through reception.

**The key difference from a classic monolith:**

```
  CLASSIC MONOLITH                   MODULAR MONOLITH
  ----------------                   ----------------

  OrderService                       OrderModule
    |                                  |
  userRepository.findById(1)         userModule.getPublicProfile(1)
  (accesses DIRECTLY the data        (requests data through a
   of another domain)                 public interface)

  +----------------+                 +-----------+  +-----------+
  | SHARED DB      |                 | Orders DB |  | Users DB  |
  | users + orders |                 | (its own) |  | (its own) |
  | all mixed      |                 +-----------+  +-----------+
  +----------------+
```

**Why is it so popular now?** Because it delivers 80% of the benefits of microservices (separation, independent teams, clear domain) without 80% of the operational complexity (network, latency, independent deployments, distributed consistency).

**When to use it:** Teams of 5-20 people, complex logic that needs clear separation, when preparing the ground for a potential future migration to microservices.

**Real-world example:** Shopify migrated from a classic monolith to a modular monolith and has maintained it at massive scale.

```
REMEMBER:
> One deployment + modules with STRICT boundaries inside
> Each module: its own domain, its own DB/schema, its own public API
> The "sweet spot" for most medium-to-large projects
```

---

## 3.3 Microservices

```
  +---------+   +---------+   +---------+   +---------+
  |Service A|   |Service B|   |Service C|   |Service D|
  |  Users  |   | Orders  |   |Payments |   |  Notif  |
  |         |   |         |   |         |   |         |
  |  +DB    |   |  +DB    |   |  +DB    |   |  +DB    |
  +----+----+   +----+----+   +----+----+   +----+----+
       |              |              |              |
       |    +---------+--------------+              |
       |    |                                       |
       +----+---------------------------------------+
            |
  +---------v----------+
  |     API GATEWAY    |  <-- Single entry point
  |  (routing, auth)   |
  +---------+----------+
            |
         Client

  Each service:
  * Its own process
  * Its own database
  * Its own deployment
  * Potentially its own language
  * Its own responsible team
```

**What it is:** Splitting the system into small, independent, and separately deployable services. Each service is responsible for a business capability and communicates with others over the network (HTTP/REST, gRPC, messaging).

Analogy: a city with specialized shops. The bakery, the butcher, and the fruit shop are independent businesses. Each one has its own premises, its own warehouse, and its own employees. If the bakery grows, it expands ITS premises without affecting the others.

**What NOBODY tells you in the tutorials:**

```
  WHAT YOU GAIN                      WHAT YOU PAY
  -------------                      ------------
  * Scale service by                 * Network complexity
    service                            (latency, timeouts, retries)
  * Independent teams                * Data consistency
    (each one owns its                 (distributed transactions)
     service)                        * VERY complex debugging
  * Independent deploy                 (tracing, distributed logs)
  * Isolated failure                 * Infrastructure cost
    (one service goes down,            (Kubernetes, service mesh,
     the rest continues)               monitoring, CI/CD per service)
  * Technology freedom               * Requires mature DevOps
```

**When to use them:** Large teams (20+ people), real need to scale parts independently, organization with DevOps maturity, well-understood domain with clear bounded contexts.

**When NOT to:** Small teams, early-stage startups, poorly defined domain, no DevOps infrastructure.

**Real-world example:** Netflix, Amazon, Spotify, Uber.

```
REMEMBER:
> Each service = its own DB + its own deploy + its own team
> Great power, GREAT operational complexity
> The golden rule: do not start with microservices unless the pain justifies it
```

---

## 3.4 The Natural Evolution

```
  PHASE 1              PHASE 2                PHASE 3
  Classic    -------->  Modular    ----------> Microservices
  Monolith              Monolith               (only if needed)

  +---------+       +--+--+--+              +--+ +--+ +--+
  | EVERY   |       |A |B |C |              |A | |B | |C |
  | THING   |       |  |  |  |              |  | |  | |  |
  +---------+       +--+--+--+              +--+ +--+ +--+
  1 block           1 block,                N blocks,
                    N modules               N deployments

  Complexity:  LOW         MEDIUM              HIGH
  Teams:       1-5         5-20                20+
  Initial
  speed:       HIGH        HIGH                LOW
```

Best practice in 2025: start with a monolith (or modular monolith), and extract microservices ONLY when a specific module needs to scale independently or a different team wants total autonomy.

```
REMEMBER:
> Monolith -> Modular -> Microservices is the natural path
> Do not skip phases: each one has its moment
> Staying at "Modular Monolith" forever is perfectly valid if it works
```

---

## 3.5 SOA (Service-Oriented Architecture)

```
  +----------+  +----------+  +----------+
  |Service A |  |Service B |  |Service C |
  | (CRM)    |  | (ERP)    |  |(Legacy)  |
  +-----+----+  +-----+----+  +-----+----+
        |              |              |
        +--------------+--------------+
                       |
                +------v------+
                |     ESB     |  Enterprise Service Bus
                |             |
                | - Routing   |  "Traffic controller"
                | - Transform |  that directs, transforms
                | - Orchestr. |  and orchestrates messages
                +-------------+
```

**What it is:** Organizing the system as reusable services that communicate through a centralized bus (ESB). The ESB is the brain that routes, transforms, and orchestrates communication.

Analogy: a telephone switchboard from the 1990s. All departments call the switchboard, and the operator redirects to the correct destination, translating if necessary.

**SOA vs Microservices -- the evolution:**

```
  SOA (2000s)                        MICROSERVICES (2010s)
  ----------                         --------------------
  Centralized bus (ESB)              Decentralized communication
  LARGE services                     SMALL services
  Formal contracts (WSDL/SOAP)       Lightweight APIs (REST/gRPC)
  Top-down governance                Autonomous teams
  Integrating legacy systems         Building new systems

  Microservices = the evolution of SOA
  without the ESB bottleneck
```

**When to use it:** Large enterprises that need to integrate heterogeneous legacy systems (banks, insurance companies, government).

**When NOT to:** New projects. Today microservices or event-driven are preferred.

```
REMEMBER:
> SOA = services + central bus (ESB) as orchestrator
> Microservices inherited the good ideas from SOA without the ESB
> SOA is still alive in enterprise legacy, not in greenfield projects
```

---

## 3.6 Serverless

```
  EVENT                   CLOUD PROVIDER
  -----                   --------------
  HTTP request --+
  Timer ---------+        +---------------------+
  Queue msg -----+------->|   YOUR FUNCTION      |---> Result
  DB change -----+        |   (only your code)   |
  File upload ---+        +---------------------+
                                   |
                          The cloud manages:
                          * Servers
                          * Scaling (0 -> thousands -> 0)
                          * Availability
                          * Pay per execution (ms)

  You write functions.
  You manage NOTHING about infrastructure.
```

**What it is:** Functions are written that execute in response to events. The cloud provider (AWS Lambda, Azure Functions, Google Cloud Functions) manages all infrastructure. Payment is only for execution time, literally per millisecond.

Analogy: a taxi vs buying a car. No insurance, parking, or maintenance costs. Call the taxi when needed, and pay only for the ride.

```
  ADVANTAGES                          DISADVANTAGES
  ----------                          -------------
  * Zero server management            * Cold starts (initial latency)
  * Automatic scaling (to 0 and ∞)    * Vendor lock-in (tied to AWS/GCP)
  * Pay only for what you use         * Execution limits (timeouts)
  * Ideal for variable traffic        * More difficult debugging
  * Development speed                 * Complex logic gets fragmented
```

**When to use it:** APIs with variable traffic, event processing (image uploads, webhooks), scheduled tasks, mobile app backends.

**When NOT to:** Apps with critical latency, very complex and intertwined business logic, need for fine-grained infrastructure control.

```
REMEMBER:
> No servers, just write functions
> Ideal for unpredictable traffic and event-driven tasks
> Cold starts + vendor lock-in are the main trade-offs
```

---

## 3.7 Event-Driven Architecture (EDA)

```
  +----------+                                  +----------+
  | PRODUCER |   Event                          |CONSUMER A|
  | (Order   |--"OrderCreated"--+               |(Inventory|
  |  Service)|                  |               |  Service)|
  +----------+                  v               +----------+
                         +--------------+              ^
                         |  EVENT BUS   |--------------+
                         |              |
                         | Kafka        |--------------+
                         | RabbitMQ     |              v
                         | SQS/SNS      |        +----------+
                         +--------------+        |CONSUMER B|
                                                 |(Email    |
                                                 | Service) |
                                                 +----------+

  RULES:
  1. The Producer does NOT know who consumes
  2. The Consumer does NOT know who produces
  3. They only know about the EVENT (the contract)
  4. Communication is ASYNCHRONOUS
```

**What it is:** Components communicate by emitting and reacting to events, not by calling each other directly. An event = "something happened" (an immutable fact). Whoever emits it does not know or care who consumes it.

Analogy: a bulletin board. Someone posts an announcement ("an order has been created"), and anyone interested reads it and acts on their own. The poster does not need to know who reads it.

**The two main models:**

```
  CHOREOGRAPHY                       ORCHESTRATION
  ------------                       -------------

  Each service reacts                A "director" coordinates
  on its own to events.              the service flow.

  A --event--> B                     Director --> A
  B --event--> C                     Director --> B
  C --event--> D                     Director --> C

  * More decoupled                   * More visible flow
  * Flow difficult to trace          * Director = single point of failure
```

**When to use it:** Real-time systems, communication between microservices, asynchronous processing, when maximum service decoupling is needed.

**When NOT to:** Operations requiring immediate response, simple systems, teams without experience in distributed systems.

**Real-world example:** Trading systems, order processing (Amazon), real-time notifications.

```
REMEMBER:
> Producer emits, Consumer reacts, they do not know each other
> Maximum decoupling + asynchronous processing
> Trade-off: debugging and traceability become much more complex
```

---

## 3.8 CQRS + Event Sourcing

```
  CQRS (Command Query Responsibility Segregation)
  ------------------------------------------------

                +----------+
                |  Client  |
                +-----+----+
                      |
           +----------+----------+
           |                     |
     +-----v------+        +----v------+
     |  COMMAND    |        |   QUERY   |
     |  (Write)    |        |   (Read)  |
     |             |        |           |
     | - Validate  |        | - Search  |
     | - Process   |        | - Filter  |
     | - Save      |        | - Paginate|
     +-----+------+        +----+------+
           |                     |
     +-----v------+        +----v------+
     |  WRITE DB  |--sync-->|  READ DB  |
     |(normalized) |  async |(denormal.) |
     +------------+        +-----------+
```

**What CQRS is:** Separating write operations (commands) from read operations (queries) into completely different models, even different databases. Each side is optimized for its purpose.

Analogy: in a restaurant, the kitchen (writing) has a very different organization from the delivery counter (reading). If they are placed in the same space, they get in each other's way.

**What Event Sourcing is:**

```
  WITHOUT Event Sourcing (the norm):

  Current state:  { balance: 150 }  <-- only the "now" is known

  WITH Event Sourcing:

  Event 1:  AccountCreated       { initial_balance: 0 }
  Event 2:  MoneyDeposited       { amount: 200 }
  Event 3:  MoneyWithdrawn       { amount: 50 }
  -------------------------------------------------
  Current state = replay all events = 150

  Nothing is ever deleted or modified. Events are only APPENDED.
  The state can be reconstructed from ANY point in time.
```

**CQRS + Event Sourcing together:**

```
  Command --> Validate --> Store EVENT --> Event Bus
                               |
                    +----------+----------+
                    |                     |
              +-----v------+        +----v------+
              | Event Store|        | Read Model|
              |(immutable) |------> |(projection)|
              | Event 1    |  async |           |
              | Event 2    |        | Optimized |
              | Event 3    |        | view      |
              +------------+        +-----------+
```

**When to use it:** Systems where reads are much more frequent than writes, complete audit trail needed, state reconstruction, read and write models that are very different.

**When NOT to:** Simple CRUDs, teams without experience in eventual consistency.

```
REMEMBER:
> CQRS: separates write from read to optimize each side
> Event Sourcing: stores EVERY change as an immutable event
> Together they are powerful but VERY complex -- use them only when the benefit is clear
```

---

## 3.9 Decision Map -- Which One to Choose?

```
  What is your situation?
           |
  Small team, new product,
  validating an idea ----------------------------> CLASSIC MONOLITH
           |
  Medium team, complex logic,
  want separation without operational
  complexity ----------------------------------->  MODULAR MONOLITH
           |
  Large teams, real need to
  scale parts independently,
  mature DevOps ---------------------------------> MICROSERVICES
           |
  Integrating enterprise legacy systems ---------> SOA
           |
  Unpredictable traffic, event-driven
  tasks, zero infrastructure management ----------> SERVERLESS
           |
  How do the services communicate?
           |
  +-- Immediate response needed ------------------> REQUEST/RESPONSE (REST, gRPC)
  +-- Maximum decoupling,
  |   asynchronous processing --------------------> EVENT-DRIVEN
  +-- Reads >>> writes,
      complete audit trail needed ----------------> CQRS + EVENT SOURCING
```

**Real-world combinations:**

```
  +------------------------------------------------------+
  |  Microservices + Event-Driven + CQRS                  |
  |  (Netflix, Uber -- maximum scale)                     |
  |                                                       |
  |  Modular Monolith + Clean Architecture                |
  |  (Shopify -- massive scale, controlled complexity)    |
  |                                                       |
  |  Serverless + Event-Driven                            |
  |  (Cloud-native startups, data processing)             |
  |                                                       |
  |  Monolith + Layered                                   |
  |  (MVPs, most apps that are just starting)             |
  +------------------------------------------------------+
```

---

**Executive Summary -- Section 3**

```
+----------------------------------------------------------+
|  SYSTEM ARCHITECTURE -- The essentials                    |
|                                                          |
|  1. Monolith: 1 block, simple, cheap.                    |
|     The correct starting point.                          |
|                                                          |
|  2. Modular Monolith: 1 deployment + isolated modules.   |
|     The "sweet spot" for most projects.                  |
|                                                          |
|  3. Microservices: N independent services.                |
|     Maximum flexibility, maximum complexity.             |
|                                                          |
|  4. SOA: services + central ESB. The grandfather         |
|     of microservices.                                    |
|                                                          |
|  5. Serverless: functions without servers. Ideal for     |
|     variable traffic and event-driven workloads.         |
|                                                          |
|  6. Event-Driven: communication via asynchronous         |
|     events. Total decoupling, complex debugging.         |
|                                                          |
|  7. CQRS + Event Sourcing: separate read and write       |
|     + immutable history of everything.                   |
|                                                          |
|  UNIVERSAL PRINCIPLE: start simple, add complexity       |
|  only when REAL pain justifies it.                       |
+----------------------------------------------------------+
```

---

## Additional Clarifications

---

### Clarification 1: Code Architecture vs System Architecture

```
  SOFTWARE ARCHITECTURE
           |
           +-- CODE ARCHITECTURE
           |   "How do I organize code INSIDE an app?"
           |
           |   - Layered (N-Layer)
           |   - Hexagonal (Ports & Adapters)
           |   - Clean Architecture
           |   - Pipe & Filter
           |   - MVC / MVP / MVVM
           |
           +-- SYSTEM ARCHITECTURE
               "How do I organize and deploy SERVICES?"

               - Monolith
               - Modular Monolith
               - Microservices
               - Serverless
               - SOA
               - 3-Tier
```

These are two DIFFERENT decisions made at different levels:

- System architecture = the "city plan" (buildings and streets)
- Code architecture = the "building plan" (rooms and hallways)

They combine freely. A Microservices system (system) where each service uses Clean Architecture (code) is possible. Or a Monolith (system) with Hexagonal (code) inside.

```
  Combination example:

  +--------------------------------------+
  |  SYSTEM: Microservices               |
  |                                      |
  |  +------------+   +------------+     |
  |  | Service A  |   | Service B  |     |
  |  | (Clean     |   | (Hexagonal |     |
  |  |  Arch)     |   |  Arch)     |     |
  |  +------------+   +------------+     |
  |                                      |
  |  CODE: each service has its          |
  |  own internal architecture           |
  +--------------------------------------+
```

```
REMEMBER:
> These are two INDEPENDENT levels of decision
> System = how you DEPLOY (1 block or many)
> Code = how you ORGANIZE the code inside each piece
```

---

### Clarification 2: Where Does DDD Fit?

```
  DDD (Domain-Driven Design)
           |
           |  It is NOT an architecture.
           |  It is a DESIGN METHODOLOGY.
           |
           |  It has two parts:
           |
           +-- STRATEGIC DESIGN
           |   "How do I divide the system into parts?"
           |   - Bounded Contexts (domain boundaries)
           |   - Ubiquitous Language (shared language)
           |   - Context Maps
           |         |
           |         +-->  Impacts SYSTEM ARCHITECTURE
           |              (each Bounded Context = 1 module or 1 service)
           |
           +-- TACTICAL DESIGN
               "How do I model the code inside each part?"
               - Entities, Value Objects
               - Aggregates, Domain Events
               - Repositories, Domain Services
                     |
                     +-->  Impacts CODE ARCHITECTURE
                          (lives inside the domain layer)
```

DDD is the BRIDGE between the two levels. Strategic Design determines where to cut the system. Tactical Design determines how to organize the code inside each cut.

```
  +----------------------------------------------+
  |                                              |
  |  DDD Strategic --> Bounded Context "Orders"  |
  |                         |                    |
  |                    becomes:                  |
  |                    - 1 microservice, OR      |
  |                    - 1 module in the monolith|
  |                         |                    |
  |  DDD Tactical -->  Inside: Entities, VOs,   |
  |                    Aggregates organized      |
  |                    with Clean/Hexagonal      |
  |                                              |
  +----------------------------------------------+
```

```
REMEMBER:
> DDD = methodology, NOT architecture
> Strategic DDD defines the BOUNDARIES (Bounded Contexts)
> Tactical DDD defines how to MODEL within each boundary
```

---

### Clarification 3: 3-Tier, Client-Server, and Architectural Styles

```
  LEVEL OF ABSTRACTION
  ====================

  HIGH    +----------------------------------+
          |  ARCHITECTURAL STYLE             |
          |  "The general philosophy"         |
          |                                  |
          |  Client-Server, Peer-to-Peer,    |
          |  Event-Driven, REST              |
          +----------------------------------+
                         |
                         |  is implemented with
                         v
  LOW     +----------------------------------+
          |  ARCHITECTURAL PATTERN           |
          |  "The concrete solution"          |
          |                                  |
          |  3-Tier, Microservices,           |
          |  Modular Monolith, Serverless    |
          +----------------------------------+
```

**Client-Server** is a style (a philosophy: one requests, the other responds). It is not something that is "chosen" -- it is the water in which all fish of the modern web swim. 3-Tier, Microservices, Serverless -- they are all Client-Server.

**3-Tier** is a concrete pattern that implements Client-Server with 3 PHYSICAL levels:

```
  Client-Server (style) implemented as:

  2-Tier:  [Client] <--> [Server+DB]
           (legacy app like Access)

  3-Tier:  [Client] <--> [Server] <--> [DB]
           (the standard modern web)

  N-Tier:  [Client] <-> [API GW] <-> [Services] <-> [DB]
           (microservices)
```

**The KEY difference: Layer vs Tier:**

```
  LAYER = LOGICAL separation (within the code)
          Folders/projects on the same server.

  TIER  = PHYSICAL separation (different machines)
          Each level runs on its own machine.

  /presentation  +
  /business      +-- N-Layer (1 machine, 3 folders)
  /data-access   +

  [Browser] --> [API Server] --> [DB Server]
     Tier 1        Tier 2          Tier 3
     (3 different machines)
```

These do not warrant their own section. The styles are already covered in theory (Section 1.4) and their concrete implementations in Sections 2 and 3.

```
REMEMBER:
> Client-Server = style (philosophy), 3-Tier = pattern (solution)
> Layer = logical (code), Tier = physical (machines)
> Almost every modern web app is already 3-Tier by default
```

---

### Clarification 4: What Is a Monolith, Really?

```
  WHAT IT SEEMS TO MEAN:             WHAT IT ACTUALLY MEANS:
  ======================             =======================

  +--------------------------+       Monolith = the APPLICATION
  |  1 SERVER                |       (usually the backend)
  |  Front + Back + DB       |       is 1 SINGLE deployable
  |  all in the same box     |       artifact.
  +--------------------------+
                                     It does NOT matter WHERE it runs.
  This is NOT correct                It does NOT matter how many servers.
```

A typical setup (Vercel + Azure + Atlas) is defined as follows:

```
  +----------+         +--------------+        +--------+
  | Next.js  |--JSON-->|   API        |------> |MongoDB |
  | Frontend |<--------|   Backend    |<------ |        |
  | (Vercel) |         |(Azure W.App) |        |(Atlas) |
  +----------+         +--------------+        +--------+
   Machine 1            Machine 2               Machine 3

  INFRASTRUCTURE: 3-Tier (3 separate machines)
  APPLICATION:    Backend monolith (1 API with all the logic)

  Both things COEXIST.
```

**What determines whether it is a monolith or micro:**

```
  Is the BACKEND 1 app or several?

  1 app with everything:
  /api/users    +
  /api/orders   +-- 1 process, 1 deploy = MONOLITH
  /api/content  +

  Several separate apps:
  Azure Web App 1: /api/users    (its own deploy)
  Azure Web App 2: /api/orders   (its own deploy)
  = MICROSERVICES
```

**The historical evolution of the term:**

```
  BEFORE (2000s):                    NOW (2025):
  --------------                     ----------

  +-------------------+              +--------+ +--------+ +------+
  | 1 SERVER          |              |Frontend| |Backend | |  DB  |
  | PHP + HTML + MySQL|              |Vercel  | |Azure   | |Atlas |
  | All together      |              +--------+ +--------+ +------+
  +-------------------+              Physically separated.
  "Monolith" = everything            "Monolith" = the backend
  in one literal box                  is 1 single app.
```

In 2025, when someone says "monolith" without further context, they are ALWAYS referring to the backend. Although frontend monolith and micro-frontends also exist, those are much rarer conversations.

```
REMEMBER:
> Monolith = the APP is 1 deployable artifact, not that everything is on 1 server
> In 2025 "monolith" = talking about the backend, always
> Vercel + Azure + Atlas = 3-Tier (infra) + backend monolith (app)
> What determines monolith vs micro = whether the BACKEND is 1 deploy or several
```

---

### Clarification 5: Clean vs Hexagonal + Rules vs Logic vs Orchestration

#### Part A: Clean vs Hexagonal

```
  HEXAGONAL (2005, Cockburn)           CLEAN (2012, Uncle Bob)
  ========================             ========================

  Defines 3 concepts:                  Defines 4 layers:
  - Core                              - Entities
  - Ports (interfaces)                - Use Cases
  - Adapters (implementations)       - Interface Adapters
                                      - Frameworks & Drivers

  Rule:                               Rule:
  "Core depends on nothing"            "Dependencies point inward"
  (= THE SAME)                        (= THE SAME)

  MINIMALIST                          PRESCRIPTIVE
  (you decide how to                   (it tells you what goes
   organize the core)                   in each layer)
```

The practical difference that matters:

```
  HEXAGONAL:
  ----------
  The core is a black box:
  +----------------------+
  |       CORE           |
  |  How to organize it? |
  |  It does not say.    |
  +----------------------+

  CLEAN:
  ------
  The core is EXPLICITLY divided into two:
  +----------------------+
  |  ENTITIES            |  <-- Pure business rules
  |  "order cannot       |
  |   be negative"       |
  +----------------------+
  |  USE CASES           |  <-- Application logic
  |  "create order:      |
  |   validate, compute, |
  |   save"              |
  +----------------------+

  Clean FORCES the separation of business rules
  from application flows. Hexagonal does not.
```

In practice, everyone mixes: they take ports/adapters from Hexagonal + entities/use cases layers from Clean.

#### Part B: Rules vs Logic vs Orchestration

```
  Controller (receives request)
       |
       v
  ORCHESTRATION ---- "Call Use Case, then Payment,
       |              then Notifications"
       |              Coordinates the flow. No logic of its own.
       v
  BUSINESS LOGIC ---- "Validate stock, compute total,
       |                apply discount, save order"
       |                The application process.
       v
  BUSINESS RULES ---- "Total cannot be negative.
                       Maximum discount 50%.
                       Minors cannot buy alcohol."
                       Domain truths. They exist without software.
```

Example with code:

```
  BUSINESS RULE (Entity):
  -----------------------
  class Order {
    constructor(items) {
      this.total = items.reduce((s, i) => s + i.price, 0)
      if (this.total < 0)
        throw new Error("Total cannot be negative") // RULE
    }
  }

  BUSINESS LOGIC (Use Case):
  --------------------------
  class CreateOrderUseCase {
    execute(userId, items) {
      const user = this.userRepo.findById(userId)
      const order = new Order(items)       // entity validates itself
      this.orderRepo.save(order)
      return order
    }
  }

  ORCHESTRATION (Orchestrator/App Service):
  -----------------------------------------
  class PurchaseFlow {
    execute(userId, items, paymentInfo) {
      const order = this.createOrder.execute(userId, items)
      this.payment.charge(paymentInfo, order.total)
      this.email.sendConfirmation(userId, order)
    }
  }
```

The classic problem: the "giant Service" that mixes all three is the symptom of not separating them. Clean Architecture teaches how to put each one in its proper place.

```
  +--------------+------------------+--------------+--------------+
  |              | RULES            | LOGIC        | ORCHESTRATION|
  +--------------+------------------+--------------+--------------+
  | Depends      | NO. Exists       | YES. It is   | YES. It is   |
  | on the app?  | without          | how the app  | how services |
  |              | software.        | uses rules.  | connect.     |
  +--------------+------------------+--------------+--------------+
  | Where it     | Entity (center)  | Use Case     | App Service  |
  | lives in     |                  |              | (edge)       |
  | Clean        |                  |              |              |
  +--------------+------------------+--------------+--------------+
  | Changes      | Almost NEVER     | When         | When         |
  | when...      |                  | requirements | services are |
  |              |                  | change       | added/removed|
  +--------------+------------------+--------------+--------------+
```

```
REMEMBER:
> Clean = Hexagonal + explicit layers inside the core (Entities vs Use Cases)
> Business rules = domain truths (Entity). They exist without software.
> Business logic = application process (Use Case). It uses the rules.
> Orchestration = coordinating services (Orchestrator). It has no logic of its own.
> The "giant Service" is the symptom of mixing all three.
```

---

### Clarification 6: What Is Most Important to Master?

```
  PRIORITIES FOR A SENIOR AI/FULL STACK ENGINEER ROLE
  ====================================================

  TIER 1 -- MASTER (apply with eyes closed)
  +----------------------------------------------+
  |                                              |
  |  * Clean / Hexagonal Architecture            |
  |    -> Create a project from scratch with     |
  |       this structure                         |
  |    -> Explain in 2 minutes in an interview   |
  |                                              |
  |  * Monolith vs Modular vs Microservices      |
  |    -> Argue when to use each one             |
  |    -> Draw the natural evolution             |
  |                                              |
  |  * DDD Strategic (Bounded Contexts)          |
  |    -> Identify BCs in a domain               |
  |    -> Map BC to module or service            |
  |                                              |
  +----------------------------------------------+

  TIER 2 -- KNOW WELL (explain in an interview)
  +----------------------------------------------+
  |  * Event-Driven Architecture                 |
  |  * CQRS                                      |
  |  * Layered / N-Tier                          |
  |  * Serverless                                |
  +----------------------------------------------+

  TIER 3 -- KNOW IT EXISTS (mention with good judgment)
  +----------------------------------------------+
  |  * SOA                                       |
  |  * Pipe & Filter                             |
  |  * Event Sourcing                            |
  |  * MVC / MVP / MVVM                          |
  |  * Onion Architecture                        |
  +----------------------------------------------+
```

```
  IMPACT MAP:

  INTERVIEWS  ^
              |
              |  * Clean/Hexagonal    * Monolith vs Micro
              |                  \       /
              |                   * DDD
              |
              |        * Event-Driven
              |                 * CQRS
              |
              |    * Layered       * Serverless
              |
              |  * SOA   * Pipe&Filter   * MVC
              |
              +------------------------------------> DAY TO DAY
```

```
REMEMBER:
> Clean/Hexagonal + Monolith vs Micro + DDD = 80% of the value
> In senior interviews they look for JUDGMENT to choose, not definitions
> The golden question is always: "why would you choose X and not Y?"
```

---

### Executive Summary -- All Clarifications in 30 Seconds

```
+----------------------------------------------------------+
|                                                          |
|  1. Code vs System = two INDEPENDENT decisions           |
|     that combine freely                                  |
|                                                          |
|  2. DDD = METHODOLOGY (not architecture), it is the     |
|     bridge between code and system via Bounded Contexts  |
|                                                          |
|  3. Layer = logical (code), Tier = physical (machines)   |
|     Client-Server = style, 3-Tier = pattern              |
|                                                          |
|  4. Monolith = the BACKEND is 1 deploy, not that        |
|     everything is on 1 server                            |
|                                                          |
|  5. Clean = Hexagonal + explicit layers.                 |
|     Rules (Entity) > Logic (Use Case) > Orchestration   |
|     The "giant Service" = symptom of mixing them         |
|                                                          |
|  6. Master: Clean/Hexa + Monolith vs Micro + DDD        |
|     The rest is context that enriches those 3 pillars   |
|                                                          |
+----------------------------------------------------------+
```

---

### Onion Architecture (Jeffrey Palermo, 2008)

```
  +-------------------------------------------+
  |          INFRASTRUCTURE                    |
  |  (DB, external APIs, frameworks, UI)       |
  |    +-----------------------------------+   |
  |    |      APPLICATION SERVICES         |   |
  |    |  (use case orchestration)         |   |
  |    |    +---------------------------+  |   |
  |    |    |    DOMAIN SERVICES        |  |   |
  |    |    |  (logic across entities)  |  |   |
  |    |    |    +-------------------+  |  |   |
  |    |    |    |   DOMAIN MODEL    |  |  |   |
  |    |    |    |                   |  |  |   |
  |    |    |    |  Entities         |  |  |   |
  |    |    |    |  Value Objects    |  |  |   |
  |    |    |    |  Interfaces       |  |  |   |
  |    |    |    +-------------------+  |  |   |
  |    |    +---------------------------+  |   |
  |    +-----------------------------------+   |
  +-------------------------------------------+

  Rule: dependencies ONLY point inward.
  (the same rule as Hexagonal and Clean)
```

**The 4 layers of Onion:**

```
  DOMAIN MODEL (center)
  |  Entities, Value Objects, repository interfaces.
  |  The PUREST business rules.
  |  Depends on NOTHING.
  |
  DOMAIN SERVICES
  |  Business logic that involves
  |  MULTIPLE entities and does not belong to just one.
  |  E.g.: "CalculatePriceWithDiscount" that needs
  |      Order + User + DiscountPolicy
  |
  APPLICATION SERVICES
  |  Use case orchestration.
  |  Coordinates Domain Services and entities
  |  to resolve a complete flow.
  |  E.g.: "CreateOrder" -> validate -> compute -> save
  |
  INFRASTRUCTURE (exterior)
     Everything concrete: DB, frameworks, UI, APIs.
     Implements the interfaces from the center.
```

### Direct Comparison of the 3 Cousins

```
  +--------------+---------------+---------------+---------------+
  |              |  HEXAGONAL    |    ONION       |    CLEAN      |
  |              |  (2005)       |    (2008)      |    (2012)     |
  +--------------+---------------+---------------+---------------+
  | Core         | "Core"        | Domain Model  | Entities      |
  | layers       | (does not     | Domain Servs  | Use Cases     |
  |              |  detail them) | App Services  |               |
  +--------------+---------------+---------------+---------------+
  | Outer        | Adapters      |Infrastructure | Interf.Adapt  |
  | layers       |               |               | Framew&Driv   |
  +--------------+---------------+---------------+---------------+
  | Vocabulary   | Ports         | Interfaces    | Interfaces    |
  | for          | Adapters      | (in Domain    | (in Use Case  |
  | contracts    |               |  Model)       |  layer)       |
  +--------------+---------------+---------------+---------------+
  | What it      | Decouple      | Layers like   | Formalize     |
  | ADDS         | core from     | an onion      | with Depend.  |
  | compared     | the exterior  | + Domain      | Rule + 4      |
  | to previous  | (the original)| Services      | clear layers  |
  |              |               | as a layer    |               |
  +--------------+---------------+---------------+---------------+
```

### What Onion Adds That the Others Do Not

```
  The DOMAIN SERVICES layer.
  ==========================

  Hexagonal: does not distinguish. Everything is "core".
  Clean: has Use Cases but no explicit Domain Services.
  Onion: EXPLICITLY separates:

  +------------------------------------------+
  |                                          |
  |  Domain Model = rules of ONE entity      |
  |  "An order cannot be negative"           |
  |                                          |
  |  Domain Services = rules that CROSS      |
  |  multiple entities                       |
  |  "Calculate final price needs Order      |
  |   + User + DiscountPolicy + TaxRules"    |
  |                                          |
  |  Application Services = orchestration    |
  |  "Create order: call this,               |
  |   then this, then save"                  |
  |                                          |
  +------------------------------------------+

  In practice, Clean Architecture absorbs
  Domain Services into Use Cases
  or into Entities.
  Onion makes them an EXPLICIT layer.
```
