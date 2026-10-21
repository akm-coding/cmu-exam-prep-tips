---
title: Trigonometric and inverse trigonometric functions
subject: mathematics
source: study-notes
---

# Trigonometric and inverse trigonometric functions

## Radians and the unit circle

π radians = 180°. 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2. On the unit circle the point at angle θ is (cos θ, sin θ), and tan θ = sin θ / cos θ.

## Exact values

| θ | 0 | π/6 | π/4 | π/3 | π/2 |
|---|---|---|---|---|---|
| sin θ | 0 | 1/2 | √2/2 | √3/2 | 1 |
| cos θ | 1 | √3/2 | √2/2 | 1/2 | 0 |
| tan θ | 0 | √3/3 | 1 | √3 | undefined |

Signs by quadrant ("All Students Take Calculus"): Q1 all positive, Q2 sin positive, Q3 tan positive, Q4 cos positive.

## Basic properties

- sin x and cos x: domain ℝ, range [−1, 1], period 2π.
- tan x: domain x ≠ π/2 + kπ, range ℝ, period π.
- sin is odd (sin(−x) = −sin x), cos is even (cos(−x) = cos x), tan is odd.
- For y = A sin(Bx + C) + D: amplitude |A|, period 2π/|B|, midline y = D.
- Reciprocals: csc x = 1/sin x, sec x = 1/cos x, cot x = 1/tan x.

## Key identities

- sin²x + cos²x = 1; 1 + tan²x = sec²x; 1 + cot²x = csc²x.
- sin(A ± B) = sin A cos B ± cos A sin B
- cos(A ± B) = cos A cos B ∓ sin A sin B
- tan(A ± B) = (tan A ± tan B)/(1 ∓ tan A tan B)
- sin 2x = 2 sin x cos x; cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x
- Co-functions: sin(π/2 − x) = cos x, cos(π/2 − x) = sin x.

Example: sin 75° = sin(45° + 30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.

## Inverse trigonometric functions

Trig functions are not one-to-one, so their inverses use restricted ranges (principal values):

| Function | Domain | Range (principal values) |
|---|---|---|
| arcsin x (sin⁻¹x) | [−1, 1] | [−π/2, π/2] |
| arccos x (cos⁻¹x) | [−1, 1] | [0, π] |
| arctan x (tan⁻¹x) | ℝ | (−π/2, π/2) |

- sin(arcsin x) = x for x in [−1, 1], but arcsin(sin x) = x only when x is in [−π/2, π/2].
- arcsin(−x) = −arcsin x; arctan(−x) = −arctan x; arccos(−x) = π − arccos x.
- arcsin x + arccos x = π/2.
- arctan x + arctan(1/x) = π/2 for x > 0.

Examples:
- arcsin(1/2) = π/6. arccos(−1/2) = 2π/3 (not −π/3, which is outside [0, π]).
- arctan(1) + arctan(√3) = π/4 + π/3 = 7π/12.
- cos(arcsin(3/5)): let θ = arcsin(3/5), so sin θ = 3/5 with θ in [−π/2, π/2]; cos θ = √(1 − 9/25) = 4/5.
- arcsin(sin(5π/6)) = arcsin(1/2) = π/6, not 5π/6.

## Exam tips

- Draw a right triangle for expressions like sin(arctan x): tan θ = x/1, hypotenuse √(1 + x²), so sin(arctan x) = x/√(1 + x²).
- Always check that the answer to an inverse trig question is inside the principal range.
- Know the exact-value table cold; many questions are only about these angles.
