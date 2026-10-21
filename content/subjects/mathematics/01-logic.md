---
title: Logical statements and truth values
subject: mathematics
source: study-notes
---

# Logical statements and truth values

## Statements (propositions)

A statement is a sentence that is either true (T) or false (F), but not both. "7 is prime" is a statement (T). "x + 2 = 5" is not a statement until x is known (it is an open sentence). Questions and commands are not statements.

## Connectives and truth tables

For statements p and q:

| p | q | ¬p | p ∧ q | p ∨ q | p → q | p ↔ q |
|---|---|---|---|---|---|---|
| T | T | F | T | T | T | T |
| T | F | F | F | T | F | F |
| F | T | T | F | T | T | F |
| F | F | T | F | F | T | T |

- Negation ¬p ("not p") flips the truth value.
- Conjunction p ∧ q ("p and q") is true only when both are true.
- Disjunction p ∨ q ("p or q") is false only when both are false (inclusive or).
- Implication p → q ("if p then q") is false **only** when p is true and q is false. A false hypothesis makes the implication true ("vacuously true").
- Biconditional p ↔ q ("p if and only if q") is true when p and q have the same truth value.

## Related implications

For p → q:

- Converse: q → p
- Inverse: ¬p → ¬q
- Contrapositive: ¬q → ¬p — **always logically equivalent** to p → q.

The converse and inverse are equivalent to each other but not to the original.

## Important equivalences

- p → q ≡ ¬p ∨ q
- ¬(p → q) ≡ p ∧ ¬q
- De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q, and ¬(p ∨ q) ≡ ¬p ∧ ¬q
- Double negation: ¬(¬p) ≡ p
- p ↔ q ≡ (p → q) ∧ (q → p)
- Distributive: p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)

## Tautology and contradiction

- A tautology is always true, e.g. p ∨ ¬p, or (p ∧ q) → p.
- A contradiction is always false, e.g. p ∧ ¬p.
- To check a tautology quickly, try to make it false: for an implication A → B, assume A is T and B is F and see whether that is possible.

## Quantifiers

- Universal ∀x P(x): "for all x, P(x)". It is false if one counterexample exists.
- Existential ∃x P(x): "there exists x with P(x)". It is true if one example exists.
- Negation: ¬∀x P(x) ≡ ∃x ¬P(x); ¬∃x P(x) ≡ ∀x ¬P(x).
- Example: the negation of "every student passed" is "some student did not pass".

## Worked example

If p is T, q is F, r is T, find the value of (p → q) ∨ (q ↔ r).
p → q = T → F = F. q ↔ r = F ↔ T = F. F ∨ F = **F**.

## Exam tips

- Memorise the p → q row "T → F is F"; most trick questions rely on it.
- When given "(statement) is false", use it to fix the truth values of the parts. If p → q is false, then p = T and q = F.
- When the number of variables is n, a full truth table has 2ⁿ rows.
