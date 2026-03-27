# Software Architecture 101

A hands-on learning path for software architecture — from fundamentals to practical exercises. Built with TypeScript, Express, and real code you can run.

## What You'll Learn

```
  FUNDAMENTALS ──▶ CODE ARCHITECTURE ──▶ SYSTEM ARCHITECTURE ──▶ DDD
       │                  │                      │                 │
  What is it?        Layered, Hexagonal,    Monolith, Modular,   Bounded Contexts,
  Why it matters     Clean, Onion,          Microservices,       Ubiquitous Language,
  Trade-offs         Pipe & Filter,         Serverless,          Entities, Aggregates,
                     MVC/MVP/MVVM           Event-Driven, CQRS  Domain Events
```

## Repository Structure

```
.
├── docs/                              Documentation & theory
│   ├── 00-summary.md                  Complete summary (start here for review)
│   ├── 01-fundamentals.md             What is architecture, trade-offs, quality attributes
│   ├── 02-code-architecture.md        Layered, Hexagonal, Clean, Onion, Pipe & Filter, MVC
│   ├── 03-system-architecture.md      Monolith, Modular, Microservices, Serverless, EDA, CQRS
│   ├── 04-ddd.md                      Domain-Driven Design explained
│   ├── 05-exercises.md                Practice plan with phases and milestones
│   └── tests/
│       ├── test-quiz.md               20 multiple-choice questions
│       └── test-interview.md          10 open-ended interview questions with feedback
│
├── exercises/                         Hands-on code exercises
│   ├── 01-todo-ddd-api/               Exercise 1: Clean Architecture from scratch
│   │   ├── README.md                  Full guide with architecture overview & steps
│   │   └── src/                       domain → application → infrastructure
│   │
│   └── 02-monolith-to-modular/        Exercise 2: Refactor monolith into modules
│       ├── README.md                  Full guide with coupling analysis & steps
│       └── src/                       Tasks + Users as isolated modules
│
├── LICENSE
└── README.md                          You are here
```

## Learning Path

### 1. Read the Theory

Start with the docs in order:

| # | Document | What you'll learn |
|---|----------|-------------------|
| 00 | [Summary](docs/00-summary.md) | Quick review of everything (read this first or last) |
| 01 | [Fundamentals](docs/01-fundamentals.md) | What architecture is, why it matters, trade-offs |
| 02 | [Code Architecture](docs/02-code-architecture.md) | How to organize code inside a service |
| 03 | [System Architecture](docs/03-system-architecture.md) | How to organize and deploy services |
| 04 | [DDD](docs/04-ddd.md) | Domain-Driven Design concepts |

### 2. Build the Exercises

Each exercise has its own README with a step-by-step guide:

| # | Exercise | What you'll practice |
|---|----------|----------------------|
| 01 | [Todo DDD API](exercises/01-todo-ddd-api/) | Build a Clean Architecture API from scratch |
| 02 | [Monolith to Modular](exercises/02-monolith-to-modular/) | Refactor a coupled monolith into isolated modules |

### 3. Test Yourself

| Test | Format |
|------|--------|
| [Quiz](docs/tests/test-quiz.md) | 20 multiple-choice questions |
| [Interview](docs/tests/test-interview.md) | 10 open-ended questions with model answers |

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Architecture:** Clean Architecture / Modular Monolith
- **Database:** In-memory (no external dependencies needed)

## Quick Start

```bash
# Exercise 1: Clean Architecture
cd exercises/01-todo-ddd-api
npm install
npm run dev

# Exercise 2: Modular Monolith
cd exercises/02-monolith-to-modular
npm install
npm run dev
```

## License

[MIT](LICENSE)
