# DDD (Domain-Driven Design) — Complete Explanation

---

## What is DDD?

```
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  DDD is NOT an architecture.                        │
  │  It's a METHODOLOGY for designing software          │
  │  based on the BUSINESS, not the technology.         │
  │                                                     │
  │  It has 2 parts:                                    │
  │                                                     │
  │  STRATEGIC ──▶ WHERE do I cut the system?           │
  │  TACTICAL ───▶ HOW do I model inside each cut?      │
  │                                                     │
  └─────────────────────────────────────────────────────┘
```

```
REMEMBER:
→ DDD is not an architecture, it's a methodology
→ Strategic = the map (where to cut)
→ Tactical = the code (how to model inside)
```

---

## Strategic Design

### Bounded Context

```
  A way to identify and separate the different
  parts of a business when they operate
  differently and need different data.

  Example: "Product" in Amazon

  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
  │  CATALOG        │     │  WAREHOUSE      │     │  BILLING        │
  │                 │     │                 │     │                 │
  │  Product =      │     │  Product =      │     │  Product =      │
  │  name, photos,  │     │  weight, size,  │     │  price, tax,    │
  │  description,   │     │  shelf location,│     │  discount,      │
  │  reviews        │     │  stock          │     │  invoice line   │
  └─────────────────┘     └─────────────────┘     └─────────────────┘

  SAME word "Product".
  DIFFERENT meaning in each place.
  = 3 different Bounded Contexts.

  If you mix them in one giant Product class
  with 20 properties → ball of mud.
  If each context has ITS OWN version → independent modules.
```

What we did in practice: in the monolith-to-modular exercise, Tasks and Users are two Bounded Contexts. Tasks doesn't know what a User is — it only knows a `userId` (string). Each module works with ITS OWN data without touching the other's internals.

```
REMEMBER:
→ Bounded Context = a boundary around a part of the business
→ Same word, different meaning in different places = different contexts
→ Each context = 1 module (modular monolith) or 1 service (microservices)
```

---

### Ubiquitous Language

```
  The code MUST speak the same language
  as the business people.
  ═══════════════════════════════════════

  BAD (everyone speaks their own language):

  Business meeting: "When the customer places an ORDER..."
  Your code:        class Transaction { userId, itemList }
  → Nobody understands each other

  GOOD (everyone speaks the same):

  Business meeting: "When the customer places an ORDER..."
  Your code:        class Order { customer, orderLines }
  → Business says "order" = code says Order
  → Business says "customer" = code says Customer
  → Everyone understands instantly
```

Why it matters: if the CEO says "order" and your code says "transaction", every conversation between devs and business becomes a translation exercise. Bugs come from misunderstandings. Same language = fewer bugs.

Each Bounded Context has ITS OWN Ubiquitous Language. "Product" in Catalog means photos and reviews. "Product" in Warehouse means weight and shelf location. Different contexts, different definitions.

```
REMEMBER:
→ Code uses the SAME words as the business
→ If business says "Order", code says Order, not Transaction
→ Reduces misunderstandings between devs and business
→ Each Bounded Context has its own language
```

---

## Tactical Design

### Entity

```
  The main THING with its own identity.
  ═════════════════════════════════════

  Entity = "SOMEONE" or "SOMETHING" with an ID

  User { id: "abc", name: "Ivan", email: "ivan@test.com" }
       ↓ changes email
  User { id: "abc", name: "Ivan", email: "ivan@new.com" }
       ↑ still the SAME user (same id)

  Two users named "Ivan" are DIFFERENT people (different id).
  The identity NEVER changes.
```

What we did in practice: `Task` in ddd-exercise is an Entity. It has an `id`, it has business rules (`title` can't be empty, `complete()` can't run twice), and it protects itself from invalid states.

```
REMEMBER:
→ Entity = has identity (id), mutable, represents "someone" or "something"
→ Contains its own business rules and self-validates
→ Two entities with the same data but different id are DIFFERENT
```

---

### Value Object

```
  A DATA that belongs to an entity.
  No identity of its own. Defined by its VALUE.
  ═════════════════════════════════════════════

  Entity: User (id: "abc")         ← is "someone"
  │
  ├── name: string                 ← simple data
  ├── email: Email                 ← value object
  └── balance: Money               ← value object


  Value Object: Email { value: "ivan@test.com" }
  → No id. Doesn't care WHO has it.
  → Two emails "ivan@test.com" are the SAME email.
  → They are interchangeable.
```

What they're for: encapsulate validation in ONE place.

```
  WITHOUT Value Object:
  controller:   if (!email.includes("@")) throw error
  use case:     if (!email.includes("@")) throw error
  service:      if (!email.includes("@")) throw error
  → Same validation in 5 places. Change the rule → change 5 files.

  WITH Value Object:
  class Email {
    constructor(value: string) {
      if (!value.includes("@")) throw error
    }
  }
  → Validation in ONE place. Change the rule → change 1 file.
```

Not every property needs to be a Value Object. Only those that need their own validation or are more complex than a simple string/number.

```
REMEMBER:
→ Value Object = no identity, defined by its value, immutable
→ Encapsulates validation inside the value itself
→ Entity is the "who", Value Objects are the data that describe it
```

---

### Aggregate

```
  Things that DON'T make sense separately
  ALWAYS go together.
  ═══════════════════

  Can you have an OrderLine without an Order?  NO → they go together
  Can you have an Order without its lines?     NO → they go together
  → Order + OrderLines = one Aggregate

  Can you have a User without a Task?          YES → separate
  Can you have a Task without a User?          YES → separate
  → NOT an Aggregate. Independent entities.
```

```
  Analogy: a shopping cart

  ┌─────────────────────────────┐
  │  Cart                       │
  │                             │
  │  - T-shirt (x2)            │
  │  - Pants (x1)              │
  │  - Shoes (x1)              │
  │                             │
  │  Total: 150 EUR             │
  └─────────────────────────────┘

  Does it make sense to grab the "Pants" line
  and save it ALONE without the cart?

  NO. The pants line doesn't make sense
  outside the cart.

  Cart = the Aggregate
  Lines = live inside, always together
  You save/load the cart as ONE unit.
```

```
REMEMBER:
→ If 2 things don't make sense separately → they go together (Aggregate)
→ If they can exist independently → separate entities/modules
→ Access only through the root (Order, not OrderLine directly)
→ Save/load as one unit, not by parts
```

---

### Domain Events

```
  "Announce WHAT happened.
   Don't tell anyone WHAT TO DO."
  ═════════════════════════════════

  ┌──────────┐
  │  Order   │     "OrderPlaced"
  │          │────▶
  │ place()  │         │
  └──────────┘         │
                       ├──▶ Warehouse reserves stock
                       ├──▶ Email sends confirmation
                       └──▶ Payments charges customer

  Order EMITS the event: "an order was placed"
  Order DOESN'T KNOW who listens.
  Each listener REACTS on its own.
```

```
  Analogy: a WhatsApp group

  You write: "I'm getting married on Saturday"

  → Your mom reacts: prepares food
  → Your friend reacts: buys a gift
  → Your cousin reacts: books a hotel

  You didn't TELL them what to do.
  You just announced WHAT HAPPENED.
  Each one decided on their own.
```

```
  WHY it matters:

  WITHOUT events (coupled):
  Order.place() {
    this.status = "placed"
    warehouse.reserveStock()      ← Order knows Warehouse
    email.sendConfirmation()      ← Order knows Email
    payments.charge()             ← Order knows Payments
  }

  WITH events (decoupled):
  Order.place() {
    this.status = "placed"
    this.emit("OrderPlaced")      ← just announces what happened
  }
```

Domain Events is the CONCEPT (what to do). Observer/EventEmitter is the IMPLEMENTATION (how to do it). You can implement Domain Events with Node.js EventEmitter, Kafka, RabbitMQ, or a simple array of callbacks. The concept is the same.

```
REMEMBER:
→ Domain Event = something that ALREADY happened (past tense: OrderPlaced)
→ The emitter doesn't know who listens
→ Listeners react on their own
→ Decouples modules: Order doesn't need to know Warehouse exists
```

---

## How it all fits together

```
  STRATEGIC                              TACTICAL
  ═════════                              ════════

  1. Talk to the business                4. Inside each BC:
     → discover Bounded Contexts            → define Entities
     → define Ubiquitous Language            → define Value Objects
                                             → group in Aggregates
  2. Draw the Context Map                    → emit Domain Events
     → who talks to whom
                                          5. Each BC becomes:
  3. Each BC = 1 module or service           → 1 module (modular monolith)
                                             → or 1 microservice


  STRATEGIC decides the SHAPE of the system.
  TACTICAL decides the CODE inside each piece.
```

```
  What we built (mapped to DDD):

  monolith-to-modular/
    /modules
      /tasks              ← Bounded Context: Tasks
        /domain
          task.entity.ts  ← Entity (with business rules)
          task.repository  ← Repository interface
        /application
          create-task     ← Use Case
          assign-task     ← Use Case (receives userId as param, not User)
        /infrastructure
        index.ts          ← Public API (how other BCs communicate)

      /users              ← Bounded Context: Users
        /domain
          user.entity.ts  ← Entity
        index.ts          ← Public API

  Tasks and Users are 2 Bounded Contexts.
  They communicate ONLY through index.ts.
  Tasks doesn't know what a User is — just a userId string.
```

```
REMEMBER:
→ Strategic = WHERE to cut (Bounded Contexts)
→ Tactical = HOW to model (Entities, VOs, Aggregates, Events)
→ Strategic goes FIRST, then Tactical
→ DDD is the BRIDGE between what the business says and what the code does
```
