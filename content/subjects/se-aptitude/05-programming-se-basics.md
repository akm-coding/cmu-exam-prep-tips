---
title: Programming and software engineering basics
subject: se-aptitude
source: study-notes
---

# Programming and software engineering basics

## Algorithms and flowcharts

An **algorithm** is a finite, ordered set of unambiguous steps that solves a problem. It can be written as pseudocode or drawn as a flowchart.

Flowchart symbols: oval = start/end, rectangle = process, diamond = decision (yes/no), parallelogram = input/output, arrows = flow.

The three basic control structures:

1. **Sequence:** steps run in order.
2. **Selection:** if / else, switch.
3. **Iteration (loops):** for (known number of repetitions), while (repeat while a condition holds), do-while (runs at least once).

## Core programming concepts

- **Variable:** named storage for a value. **Constant:** a value that does not change.
- **Data types:** integer, float/real, boolean (true/false), character, string.
- **Operators:** arithmetic (+ − * / %), comparison (== != < > <= >=), logical (and, or, not). `%` is the remainder: 17 % 5 = 2.
- **Array / list:** ordered collection accessed by index; most languages start indexing at 0.
- **Function / procedure:** reusable named block of code with parameters and (for functions) a return value.
- **Recursion:** a function that calls itself, with a base case to stop. factorial(n) = n × factorial(n − 1), factorial(0) = 1.
- **Syntax error:** breaks the language rules (won't compile/run). **Runtime error:** crashes while running (divide by zero). **Logic error:** runs but gives the wrong result.

## Tracing example

```
x = 1
for i in 1..4:
    x = x * 2
print(x)
```
Trace: after each iteration x = 2, 4, 8, 16 → prints **16**.

## Data structures

- **Stack:** last-in, first-out (LIFO); push and pop. Used for undo and function calls.
- **Queue:** first-in, first-out (FIFO); enqueue and dequeue. Used for printer jobs and task scheduling.
- **Linked list, tree, graph, hash table (dictionary):** more advanced structures you will meet in Year 1–2.

## Searching and sorting

- **Linear search:** check items one by one; works on unsorted data; worst case n comparisons.
- **Binary search:** requires **sorted** data; compare with the middle and halve the range each step; at most about log₂n comparisons (1,000 items → about 10 steps).
- **Bubble sort:** repeatedly swap adjacent out-of-order items; simple but slow (O(n²)). **Merge sort** and **quick sort** are faster on average (O(n log n)).
- Big-O describes how running time grows with input size: O(1) < O(log n) < O(n) < O(n log n) < O(n²).

## Object-oriented programming (OOP)

- **Class:** a blueprint. **Object:** an instance of a class.
- **Encapsulation:** bundle data and methods, hide internal details.
- **Inheritance:** a subclass reuses and extends a parent class (Car inherits from Vehicle).
- **Polymorphism:** the same method name behaves differently for different classes.
- **Abstraction:** expose only what is necessary.

## Software development life cycle (SDLC)

Typical phases: requirements analysis → design → implementation (coding) → testing → deployment → maintenance.

- **Waterfall:** phases run in strict order; changes late are expensive.
- **Agile / Scrum:** short iterations (sprints), working software delivered often, customer feedback each sprint; daily stand-ups, product backlog.
- **Testing levels:** unit → integration → system → acceptance. **Black-box** testing checks behaviour without seeing code; **white-box** testing uses knowledge of the code.
- **Version control (Git):** tracks changes, supports branches and collaboration (GitHub, GitLab).
- **Requirements:** functional (what the system does: "users can reset passwords") vs non-functional (qualities: performance, security, usability).
- **Debugging** finds and fixes defects; **maintenance** covers bug fixes, updates and new features after release.

## Databases

- A **relational database** stores data in tables (rows = records, columns = fields).
- **Primary key:** uniquely identifies each row. **Foreign key:** references a primary key in another table.
- **SQL:** `SELECT name FROM students WHERE gpa > 3.0;`
- **DBMS** examples: MySQL, PostgreSQL, SQLite, Oracle.

## Emerging topics worth knowing

Artificial intelligence and machine learning, cloud computing, Internet of Things (IoT), big data, blockchain, and mobile app development. CMU's SE curriculum includes a course on AI for Software Engineering.
