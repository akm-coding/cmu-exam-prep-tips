---
title: Functions — domain, range, one-to-one, onto and graphs
subject: mathematics
source: study-notes
---

# Functions — domain, range, one-to-one, onto and graphs

## Definition

A function f: A → B assigns to each element x of the domain A exactly one element f(x) in the codomain B. The range (image) is the set of outputs actually produced, a subset of B. Vertical line test: a graph represents a function if every vertical line meets it at most once.

## Finding the domain (real-valued functions)

Exclude the x values that break the formula:

- Fractions: denominator ≠ 0. f(x) = 1/(x − 3) → domain ℝ − {3}.
- Even roots: radicand ≥ 0. f(x) = √(x − 2) → x ≥ 2, domain [2, ∞).
- Root in a denominator: radicand > 0. f(x) = 1/√(4 − x²) → −2 < x < 2.
- Logarithms: argument > 0. f(x) = log(x + 1) → x > −1.
- Combine all conditions with intersection.

## Finding the range

- Solve y = f(x) for x and see which y values give a valid x. For y = (2x + 1)/(x − 1): x = (y + 1)/(y − 2), so y ≠ 2; range ℝ − {2}.
- Quadratics f(x) = a(x − h)² + k: if a > 0 the range is [k, ∞); if a < 0 it is (−∞, k].
- √(stuff) ≥ 0, |stuff| ≥ 0, aˣ > 0, sin x and cos x lie in [−1, 1].
- Example: f(x) = x² − 4x + 7 = (x − 2)² + 3 → range [3, ∞).

## One-to-one (injective)

f is one-to-one if f(a) = f(b) implies a = b — different inputs give different outputs.

- Horizontal line test: every horizontal line meets the graph at most once.
- f(x) = 2x + 5 is one-to-one. f(x) = x² on ℝ is not (f(2) = f(−2)), but on [0, ∞) it is.
- Strictly increasing or strictly decreasing functions are one-to-one.

## Onto (surjective)

f: A → B is onto if every element of B is an output: range = codomain.

- f: ℝ → ℝ, f(x) = 2x + 5 is onto.
- f: ℝ → ℝ, f(x) = x² is not onto (negative numbers are never outputs), but f: ℝ → [0, ∞) is onto.
- A function that is both one-to-one and onto is a bijection (one-to-one correspondence) and has an inverse f⁻¹.

## Counting functions between finite sets

If |A| = m and |B| = n:

- Number of functions A → B: nᵐ.
- Number of one-to-one functions (m ≤ n): n!/(n − m)!.
- If m = n, one-to-one ⇔ onto, and there are n! bijections.

## Composition and inverse

- (f ∘ g)(x) = f(g(x)). Domain: x in the domain of g with g(x) in the domain of f. Usually f ∘ g ≠ g ∘ f.
- To find f⁻¹: write y = f(x), swap x and y, solve for y. Example: f(x) = (x − 3)/2 → f⁻¹(x) = 2x + 3.
- The domain of f⁻¹ is the range of f, and its graph is the reflection of f in the line y = x.

## Graph transformations of y = f(x)

- y = f(x) + k: shift up k. y = f(x − h): shift right h.
- y = −f(x): reflect in the x-axis. y = f(−x): reflect in the y-axis.
- y = a·f(x): vertical stretch by a. y = f(bx): horizontal compression by factor 1/b.

## Even and odd functions

- Even: f(−x) = f(x), symmetric about the y-axis (x², cos x, |x|).
- Odd: f(−x) = −f(x), symmetric about the origin (x³, sin x, tan x).

## Exam tips

- Always check denominators, even roots and logs first when asked for a domain.
- For "which is one-to-one" questions, look for two inputs with the same output to rule options out.
- Onto depends on the stated codomain — read it carefully.
