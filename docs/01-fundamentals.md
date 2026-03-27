# Fundamentals of Software Architecture

## 1.1 What is Software Architecture?

```
┌─────────────────────────────────────────────────────────┐
│              SOFTWARE ARCHITECTURE                      │
│                                                         │
│    "The fundamental structural decisions                │
│     that are costly to change once                      │
│     implemented"                                        │
│                                                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │Components │──│ Relationships │──│ Principles that  │ │
│  │(the pieces)│ │(how they     │  │guide the design  │ │
│  │           │  │ connect)     │  │and evolution     │ │
│  └───────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Simple definition: software architecture is **the blueprint of a system**. It defines what pieces it has, how they relate to each other, and under what rules they are designed and evolve.

Think of building a house: before laying a single brick, you need to decide how many floors it will have, where the plumbing goes, how the rooms are distributed. Those fundamental decisions that condition everything else = architecture.

There are two complementary perspectives worth knowing:

- **Structural perspective** (IEEE/SEI): the fundamental organization of a system, its components, their relationships, and the principles that govern its design.
- **Social perspective** (Martin Fowler / Ralph Johnson): the shared knowledge that expert developers have about the system's design. In other words, it is not just a diagram, it is the team's common understanding.

```
REMEMBER:
→ Architecture = fundamental decisions + structure + principles
→ These are decisions that are COSTLY to change later
→ It is both a technical blueprint and shared knowledge within the team
```

---

## 1.2 Why Does It Matter?

```
  WITHOUT clear architecture          WITH clear architecture
  ────────────────────────            ─────────────────────

  ┌──────────────────┐                ┌──────────────────┐
  │   Spaghetti      │                │   Organized      │
  │   code           │                │   code           │
  │   ┌─┐ ┌─┐ ┌─┐   │                │   ┌─┐  ┌─┐  ┌─┐ │
  │   │ ├─┤ ├─┤ │   │                │   │A│  │B│  │C│ │
  │   └┬┘ └┬┘ └┬┘   │                │   └┬┘  └┬┘  └┬┘ │
  │    └───┴───┘     │                │    │    │    │   │
  │  everything      │                │    ▼    ▼    ▼   │
  │  connected       │                │   interfaces     │
  │  to everything   │                └──────────────────┘
  └──────────────────┘                         │
         │                                     ▼
         ▼                             Isolated, predictable
  Every change breaks                  changes
  3 more things
```

Architecture directly impacts three things:

- **Cost of change:** Good architecture makes adding new features cheap over time. Bad architecture makes every change more expensive than the last.
- **Quality attributes:** Performance, security, scalability, maintainability... these are not achieved "at the end." They are designed from the architecture.
- **Team communication:** Architecture is the team's common language. When someone says "that belongs in the domain layer," everyone understands the same thing.

```
REMEMBER:
→ Architecture determines how much it costs to change software in the future
→ Quality attributes are DESIGNED, not added afterwards
→ It serves as a shared language so the team can communicate effectively
```

---

## 1.3 Architecture vs Design — They Are Not the Same

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ARCHITECTURE          vs          DESIGN        │
│  (helicopter view)          (street view)        │
│                                                  │
│  ┌────────────────┐        ┌────────────────┐    │
│  │ Entire system  │        │ A single       │    │
│  │ Global         │        │ module or      │    │
│  │ structure      │        │ component      │    │
│  └────────────────┘        └────────────────┘    │
│                                                  │
│  Example:                  Example:              │
│  "We will use micro-       "This service uses    │
│   services with            the Observer pattern  │
│   event-driven"            for notifications"    │
│                                                  │
│  EXPENSIVE decisions       Easier decisions      │
│  to change                 to change             │
│                                                  │
└──────────────────────────────────────────────────┘
```

- **Architecture:** Deals with the ENTIRE system. Defines the global structure, fundamental properties, and manages uncertainty. Difficult to change once built.
- **Design:** Deals with INDIVIDUAL modules or components. Defines detailed properties and concrete implementation. Easier to change.

In practice, the line between both is blurry. But the general rule is: if changing it is expensive and affects many parts of the system, it is an architectural decision.

```
REMEMBER:
→ Architecture = MACRO decisions (entire system)
→ Design = MICRO decisions (individual modules)
→ If changing it is very expensive = it is probably architecture
```

---

## 1.4 Style vs Pattern vs Design Pattern — The Three Scales

```
  LEVEL OF ABSTRACTION

  HIGH    ┌─────────────────────────────┐
  │       │  ARCHITECTURAL STYLE        │  "The philosophy"
  │       │  E.g.: Client-Server,       │
  │       │        Event-Driven, REST   │
  │       └─────────────┬───────────────┘
  │                     │
  │       ┌─────────────▼───────────────┐
  │       │  ARCHITECTURAL PATTERN      │  "The system-level solution"
  │       │  E.g.: Microservices, MVC,  │
  │       │        Layered, CQRS        │
  │       └─────────────┬───────────────┘
  │                     │
  LOW     ┌─────────────▼───────────────┐
          │  DESIGN PATTERN             │  "The code-level solution"
          │  E.g.: Observer, Factory,   │
          │        Strategy, Adapter    │
          └─────────────────────────────┘
```

These three concepts are constantly confused. The difference is the scale:

- **Architectural Style:** The high-level vision, the "type" of system. Example: "our app follows a client-server style." It is a general philosophy.
- **Architectural Pattern:** A concrete, reusable solution to a recurring problem at the system level. Example: "we use microservices with API Gateway." It impacts the system both horizontally and vertically.
- **Design Pattern:** A solution to a recurring problem at the code/object level. Example: "we use the Observer pattern for notifications." Localized impact.

```
REMEMBER:
→ Style = the general philosophy of the system (high level)
→ Architectural pattern = reusable solution at the system level (mid level)
→ Design pattern = reusable solution at the code level (low level)
```

---

## 1.5 Quality Attributes (the "-ilities")

```
                    QUALITY ATTRIBUTES
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    OPERATIONAL        STRUCTURAL       CROSS-CUTTING
    (runtime)          (development)    (both)
         │                 │                 │
  - Performance      - Maintainability - Security
  - Availability     - Testability     - Observability
  - Scalability      - Modularity      - Reliability
  - Fault            - Extensibility
    tolerance        - Portability
```

Quality attributes are the properties that define how "good" a system is beyond just working correctly. The key insight: **you cannot maximize all of them. Every architecture is a game of trade-offs**.

```
  ┌──────────────┐                  ┌──────────────┐
  │  PERFORMANCE │ ◄── tension ──► │  SECURITY    │
  └──────────────┘                  └──────────────┘

  ┌──────────────┐                  ┌──────────────┐
  │ SCALABILITY  │ ◄── tension ──► │  SIMPLICITY  │
  └──────────────┘                  └──────────────┘

  ┌──────────────┐                  ┌──────────────┐
  │ PORTABILITY  │ ◄── tension ──► │  PERFORMANCE │
  └──────────────┘                  └──────────────┘

  There is no perfect architecture.
  There is the right one for YOUR context.
```

The architect's job is to decide which ones matter MOST in their context and accept the trade-offs. For example: if you need maximum performance, you may sacrifice portability. If you need maximum security, you may sacrifice development speed.

```
REMEMBER:
→ Quality attributes are decided FROM the architecture
→ There are always trade-offs: gaining in one implies conceding in another
→ There is no perfect architecture, there is the right one for your project
```

---

## 1.6 The Two Levels of Architectural Decision

```
  ┌────────────────────────────────────────────────────┐
  │            ARCHITECTURAL DECISIONS                  │
  │                                                    │
  │   LEVEL 1: SYSTEM                                  │
  │   "How do I organize and deploy the pieces?"       │
  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐         │
  │   │Mono- │ │Micro-│ │Server│ │Event-    │         │
  │   │lith  │ │serv. │ │less  │ │Driven    │   ...   │
  │   └──────┘ └──────┘ └──────┘ └──────────┘         │
  │                                                    │
  │   LEVEL 2: CODE                                    │
  │   "How do I organize the code WITHIN each piece?"  │
  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐         │
  │   │Layer-│ │Hexa- │ │Clean │ │Pipe &    │         │
  │   │ed    │ │gonal │ │Arch  │ │Filter    │   ...   │
  │   └──────┘ └──────┘ └──────┘ └──────────┘         │
  │                                                    │
  │   They are INDEPENDENT: you can combine any        │
  │   from Level 1 with any from Level 2               │
  └────────────────────────────────────────────────────┘
```

These are two different decisions made at different levels that can be freely combined. This is a key distinction: system-level decisions and code-level decisions are independent of each other.

```
REMEMBER:
→ System Level = how you DEPLOY and communicate between services
→ Code Level = how you ORGANIZE the code within each service
→ They are independent decisions that can be freely combined
→ Example: Microservices (system) + Clean Architecture (code)
```

---

**Executive Summary — Section 1**

```
┌─────────────────────────────────────────────────────────┐
│  SOFTWARE ARCHITECTURE — The Essentials                  │
│                                                         │
│  1. It is the system's blueprint: components,           │
│     relationships, and principles that govern design    │
│                                                         │
│  2. It matters because it determines the FUTURE COST    │
│     of changing the software                            │
│                                                         │
│  3. Architecture ≠ Design                               │
│     (macro vs micro, expensive vs cheap to change)      │
│                                                         │
│  4. Style > Architectural Pattern > Design Pattern      │
│     (from most abstract to most concrete)               │
│                                                         │
│  5. Everything is trade-offs: there is no perfect       │
│     architecture, there is the right one for your       │
│     context                                             │
│                                                         │
│  6. Decisions are made at two independent levels:       │
│     SYSTEM (deployment) + CODE (organization)           │
└─────────────────────────────────────────────────────────┘
```
