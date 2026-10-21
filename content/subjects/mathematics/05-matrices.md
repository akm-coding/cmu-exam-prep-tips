---
title: 2×2 matrices — operations, determinant, linear systems
subject: mathematics
source: study-notes
---

# 2×2 matrices — operations, determinant, linear systems

## Notation

A = [[a, b], [c, d]] means the first row is (a, b) and the second row is (c, d). The identity is I = [[1, 0], [0, 1]].

## Basic operations

- Addition / subtraction: entry by entry. [[1, 2], [3, 4]] + [[5, 6], [7, 8]] = [[6, 8], [10, 12]].
- Scalar multiplication: multiply every entry. 3·[[1, −2], [0, 4]] = [[3, −6], [0, 12]].
- Matrix multiplication (row × column): [[a, b], [c, d]]·[[e, f], [g, h]] = [[ae + bg, af + bh], [ce + dg, cf + dh]].
- Example: [[1, 2], [3, 4]]·[[2, 0], [1, 3]] = [[1·2 + 2·1, 1·0 + 2·3], [3·2 + 4·1, 3·0 + 4·3]] = [[4, 6], [10, 12]].
- Matrix multiplication is **not** commutative in general: AB ≠ BA. It is associative: (AB)C = A(BC).
- Transpose Aᵀ swaps rows and columns: [[a, b], [c, d]]ᵀ = [[a, c], [b, d]]. (AB)ᵀ = BᵀAᵀ.

## Determinant

det A = |A| = ad − bc.

- det(AB) = det A · det B
- det(Aᵀ) = det A
- det(kA) = k²·det A for a 2×2 matrix
- det(A⁻¹) = 1/det A
- If det A = 0 the matrix is singular (no inverse).

Example: det [[3, 5], [1, 2]] = 3·2 − 5·1 = 1.

## Inverse

If det A ≠ 0: A⁻¹ = (1/(ad − bc))·[[d, −b], [−c, a]] — swap a and d, negate b and c, divide by the determinant.

Example: A = [[4, 7], [2, 6]], det = 24 − 14 = 10, A⁻¹ = (1/10)[[6, −7], [−2, 4]] = [[0.6, −0.7], [−0.2, 0.4]]. Check: AA⁻¹ = I.

Also (AB)⁻¹ = B⁻¹A⁻¹.

## Solving a 2×2 linear system

The system ax + by = e, cx + dy = f can be written AX = B with A = [[a, b], [c, d]], X = [[x], [y]], B = [[e], [f]].

### Method 1: inverse matrix
X = A⁻¹B.

### Method 2: Cramer's rule
With D = ad − bc ≠ 0:
- x = Dₓ/D where Dₓ = det [[e, b], [f, d]] = ed − bf
- y = Dᵧ/D where Dᵧ = det [[a, e], [c, f]] = af − ec

Example: 2x + 3y = 8 and x − y = −1.
D = 2·(−1) − 3·1 = −5. Dₓ = 8·(−1) − 3·(−1) = −5. Dᵧ = 2·(−1) − 8·1 = −10.
x = −5/−5 = 1, y = −10/−5 = 2. Check: 2 + 6 = 8 ✓, 1 − 2 = −1 ✓.

### Number of solutions
- D ≠ 0: exactly one solution.
- D = 0: either no solution (parallel lines, inconsistent) or infinitely many (same line).
- Example: for which k does kx + 2y = 1, 3x + 6y = 2 have no unique solution? D = 6k − 6 = 0 → k = 1.

## Exam tips

- Write out the row-by-column products slowly; sign errors are the most common mistake.
- For "find k so the matrix has no inverse", set ad − bc = 0.
- Cramer's rule is usually the fastest method for a single 2×2 system in a multiple-choice exam.
