---
title: Logical thinking — patterns, deduction and puzzles
subject: se-aptitude
source: study-notes
---

# Logical thinking — patterns, deduction and puzzles

The SE Aptitude Test has 10 logical-thinking questions. They test reasoning rather than knowledge. Common types and strategies:

## 1. Number sequences

Look at differences first, then ratios, then alternating or combined patterns.

- Arithmetic: 3, 7, 11, 15, … (+4) → 19.
- Geometric: 2, 6, 18, 54, … (×3) → 162.
- Second differences: 1, 4, 9, 16, 25 (squares; differences 3, 5, 7, 9) → 36.
- Fibonacci-like: 1, 1, 2, 3, 5, 8 (each term = sum of previous two) → 13.
- Alternating: 2, 10, 4, 20, 6, 30 → two interleaved sequences (2, 4, 6) and (10, 20, 30) → 8.
- Powers of 2 minus 1: 1, 3, 7, 15, 31 → 63.

## 2. Letter and symbol patterns

Convert letters to positions (A = 1 … Z = 26).

- A, C, F, J, O → gaps +2, +3, +4, +5 → next gap +6 → U.
- Coding: if CAT is coded DBU (each letter +1), then DOG → EPH.

## 3. Deductive reasoning (syllogisms)

- "All programmers are logical. Some students are programmers." → Some students are logical. ✓
- "All A are B" does **not** mean "all B are A".
- "No A are B" means no B are A either.
- Use Venn diagrams to check whether a conclusion must be true, might be true, or must be false.

## 4. If–then reasoning

Uses the same logic as the Mathematics topic:

- From "If it rains, the match is cancelled" and "It rained" → the match is cancelled (modus ponens).
- From the same rule and "The match was not cancelled" → it did not rain (modus tollens / contrapositive).
- From "The match was cancelled" you **cannot** conclude it rained (affirming the consequent is a fallacy).

## 5. Ordering and arrangement puzzles

Example: "Ann is taller than Ben. Cat is shorter than Ben. Dan is taller than Ann." Order from tallest: Dan, Ann, Ben, Cat.

Strategy: write each clue as an inequality, place the most constrained person first, and draw a line or grid.

## 6. Truth-teller / liar puzzles

Knights always tell the truth; knaves always lie. If A says "We are both knaves", A cannot be a knight (a knight would be lying), so A is a knave; the statement is therefore false, so not both are knaves → B is a knight.

Strategy: assume one case, follow consequences, and reject the case that leads to a contradiction.

## 7. Counting and combinatorics

- Multiplication principle: 3 shirts × 4 trousers = 12 outfits.
- Permutations (order matters): arrangements of n distinct items = n!. Choosing r in order from n: n!/(n − r)!.
- Combinations (order doesn't matter): C(n, r) = n!/(r!(n − r)!). Choosing 2 from 5 = 10.
- Handshakes among n people = C(n, 2) = n(n − 1)/2.
- Pigeonhole principle: with 13 people, at least two share a birth month.

## 8. Algorithmic thinking

- Trace loops step by step in a table of variable values.
- Example: start with n = 10; while n > 1: if n is even, n = n / 2, else n = 3n + 1. Sequence: 10, 5, 16, 8, 4, 2, 1 → 6 steps.
- Binary search on 100 sorted items needs at most 7 comparisons (2⁷ = 128 ≥ 100).

## 9. Spatial and figure patterns

Look for rotation (90° steps), reflection, an item being added/removed each step, shading that moves, or counts that increase. Check one property at a time.

## General exam strategy

- Spend about 1–1.5 minutes per question; skip and return if stuck.
- Eliminate impossible answer options first.
- Write intermediate steps down — puzzles are easy to get wrong in your head.
- Re-read the question for words like "not", "must", "could", "at least".
