---
title: Polynomial, exponential and logarithmic functions
subject: mathematics
source: study-notes
---

# Polynomial, exponential and logarithmic functions

## Polynomial functions

P(x) = aₙxⁿ + … + a₁x + a₀ with aₙ ≠ 0; n is the degree.

- Linear y = mx + c: slope m, y-intercept c.
- Quadratic y = ax² + bx + c: vertex at x = −b/(2a); opens up if a > 0, down if a < 0. Roots x = (−b ± √(b² − 4ac))/(2a). Discriminant D = b² − 4ac: D > 0 two real roots, D = 0 one repeated root, D < 0 no real roots.
- Sum of roots = −b/a, product = c/a.
- Remainder theorem: the remainder of P(x) ÷ (x − c) is P(c). Factor theorem: (x − c) is a factor ⇔ P(c) = 0.
- A degree-n polynomial has at most n real roots and at most n − 1 turning points.
- End behaviour depends on the leading term: for odd degree the ends go in opposite directions; for even degree they go in the same direction.
- Rational root theorem: rational roots p/q have p dividing a₀ and q dividing aₙ.

Example: P(x) = x³ − 6x² + 11x − 6. P(1) = 0, so (x − 1) is a factor; P(x) = (x − 1)(x − 2)(x − 3).

## Exponential functions

f(x) = aˣ with a > 0, a ≠ 1.

- Domain ℝ, range (0, ∞), y-intercept (0, 1), horizontal asymptote y = 0.
- a > 1: increasing (growth). 0 < a < 1: decreasing (decay).
- One-to-one, so aᵘ = aᵛ ⇒ u = v.
- Laws: aᵐ·aⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ; a^(m/n) = ⁿ√(aᵐ).

Example: 2^(x+1) = 32 → 2^(x+1) = 2⁵ → x = 4. Example: 9ˣ = 27 → 3^(2x) = 3³ → x = 3/2.

## Logarithmic functions

y = logₐx ⇔ aʸ = x (a > 0, a ≠ 1, x > 0). It is the inverse of aˣ.

- Domain (0, ∞), range ℝ, x-intercept (1, 0), vertical asymptote x = 0.
- logₐ1 = 0, logₐa = 1, a^(logₐx) = x, logₐ(aˣ) = x.
- Laws: logₐ(MN) = logₐM + logₐN; logₐ(M/N) = logₐM − logₐN; logₐ(Mᵏ) = k·logₐM.
- Change of base: logₐx = log x / log a = ln x / ln a. Also logₐb · log_b a = 1.
- log x usually means base 10; ln x means base e ≈ 2.718.
- Warning: log(M + N) is **not** log M + log N.

Example: log₂8 + log₃(1/9) = 3 + (−2) = 1.
Example: log x + log(x − 3) = 1 → log(x(x − 3)) = 1 → x² − 3x − 10 = 0 → x = 5 or x = −2; reject −2 (log undefined), so x = 5.

## Exam tips

- Always check solutions of log equations against the domain (arguments must be positive).
- Rewrite both sides of an exponential equation with the same base when possible; otherwise take logs.
- Graph questions: y = aˣ and y = logₐx are reflections of each other in y = x.
