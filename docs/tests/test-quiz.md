# Software Architecture 101 — Test (20 Questions)

Mark your answer with an `x` inside the brackets: `[x]`

---

### 1. What is the main difference between software architecture and software design?

- [ ] A) Architecture is about code style, design is about deployment
- [x] B) Architecture is macro (expensive to change), design is micro (cheaper to change)
- [ ] C) Architecture is only for large systems, design is for small ones

---

### 2. In Layered Architecture, what is the fundamental problem?

- [ ] A) Too many files and folders
- [x] B) Business logic depends on the data layer
- [ ] C) The presentation layer is too complex

---

### 3. What does the Dependency Rule in Clean Architecture state?

- [ ] A) All layers depend on the infrastructure layer
- [ ] B) Dependencies only point outward
- [x] C) Dependencies only point inward

---

### 4. In Hexagonal Architecture, what are "ports"?

- [ ] A) The concrete implementations (Express, MongoDB)
- [x] B) The interfaces/contracts defined by the domain
- [ ] C) The entry points of the application (HTTP endpoints)

---

### 5. Where should business rules (e.g., "title cannot be empty") live?

- [ ] A) In the controller
- [ ] B) In the use case
- [x] C) In the entity

---

### 6. What is the relationship between Hexagonal, Onion, and Clean Architecture?

- [ ] A) They are completely different approaches
- [x] B) Same philosophy (domain at center + dependency inversion), different vocabulary
- [ ] C) Clean replaces Hexagonal, and Onion is obsolete

---

### 7. When should you use Layered Architecture?

- [ ] A) When you have complex business logic
- [ ] B) When you need to swap databases easily
- [x] C) When your app is a simple CRUD with little business logic

---

### 8. In a modular monolith, how should modules communicate?

- [ ] A) By importing directly from each other's domain layer
- [x] B) Through public APIs (index.ts) only
- [ ] C) Through a shared database

---

### 9. What is "coupling" in software architecture?

- [x] A) How related the code inside a module is
- [ ] B) How much one module depends on another
- [ ] C) How many files a module has

---

### 10. You have a use case that assigns a user to a task. Which module should own it?

- [ ] A) Users module, because it involves a user
- [x] B) Tasks module, because the Task entity changes
- [ ] C) A shared module, because it involves both

---

### 11. When should you inject a dependency via constructor vs pass it as a parameter?

- [ ] A) Constructor for everything, parameters for nothing
- [x] B) Constructor if you call methods on it, parameter if you just read the value
- [ ] C) Constructor for strings, parameter for objects

---

### 12. Why does cross-module orchestration live in the infrastructure layer?

- [x] A) Because infrastructure is the only layer that can see other modules
- [ ] B) Because the domain layer is too complex
- [ ] C) Because Express requires it

---

### 13. What is the natural evolution path for system architecture?

- [ ] A) Microservices → Modular Monolith → Monolith
- [x] B) Monolith → Modular Monolith → Microservices (only if needed)
- [ ] C) Monolith → Microservices directly

---

### 14. In Event-Driven Architecture, what is true about the producer?

- [ ] A) The producer knows all consumers and calls them directly
- [x] B) The producer doesn't know who consumes its events
- [ ] C) The producer must wait for consumers to finish

---

### 15. What is CQRS?

- [ ] A) A way to organize the UI layer
- [x] B) Separating write operations (commands) from read operations (queries)
- [ ] C) A database technology for high performance

---

### 16. What is the difference between an Entity and a Use Case?

- [ ] A) Entity persists data, Use Case validates business rules
- [x] B) Entity mutates data in memory, Use Case orchestrates and persists
- [ ] C) Entity is for the database, Use Case is for the controller

---

### 17. DDD (Domain-Driven Design) is:

- [ ] A) A specific architecture pattern like Hexagonal
- [x] B) A methodology with Strategic (where to cut) and Tactical (how to model) parts
- [ ] C) A database design approach

---

### 18. In a modular monolith, what happens when you delete a user that has assigned tasks?

- [ ] A) The delete use case in Users directly modifies tasks via TaskRepository
- [x] B) The controller (infra) calls Tasks module to unassign, then calls Users to delete
- [ ] C) The Tasks module detects the deletion automatically

---

### 19. What does "high cohesion + low coupling" mean?

- [ ] A) Everything in one file, no dependencies
- [x] B) Related things together inside a module, minimal dependencies between modules
- [ ] C) Many small modules with lots of imports between them

---

### 20. You need to change from InMemoryRepository to MongoRepository. In Clean Architecture, what do you touch?

- [] A) Domain, Application, and Infrastructure layers
- [x] B) Only main.ts (wiring) and create the new repo implementation
- [ ] C) Only the entity and the use cases
