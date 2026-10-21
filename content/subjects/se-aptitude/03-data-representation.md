---
title: Data representation and number systems
subject: se-aptitude
source: study-notes
---

# Data representation and number systems

## Bits and bytes

- **Bit:** a single binary digit, 0 or 1. **Nibble:** 4 bits. **Byte:** 8 bits.
- n bits can represent 2ⁿ different values: 8 bits → 256 values (0–255 unsigned).
- Binary prefixes: 1 KiB = 1024 bytes, 1 MiB = 1024 KiB, 1 GiB = 1024 MiB. In everyday and exam usage, 1 KB is often treated as 1024 bytes; storage makers use decimal (1 KB = 1000 bytes). Order: bit < byte < KB < MB < GB < TB < PB.
- Network speed is measured in **bits** per second (Mbps); file size in **bytes**. A 100 Mbps connection transfers at most 12.5 MB per second.

## Number systems

| Decimal | Binary | Hex |
|---|---|---|
| 0 | 0000 | 0 |
| 5 | 0101 | 5 |
| 9 | 1001 | 9 |
| 10 | 1010 | A |
| 15 | 1111 | F |
| 16 | 0001 0000 | 10 |
| 255 | 1111 1111 | FF |

- **Binary → decimal:** sum the place values. 1011₂ = 8 + 0 + 2 + 1 = 11.
- **Decimal → binary:** divide by 2 repeatedly and read the remainders bottom-up. 13 → 1101₂.
- **Binary ↔ hex:** group bits in fours from the right. 1010 1111₂ = AF₁₆ = 175.
- **Octal** (base 8): group bits in threes. 101 011₂ = 53₈.
- Hexadecimal is used for colours (#FF0000 = red), memory addresses and MAC addresses.

## Binary arithmetic

- 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 (write 0, carry 1), 1 + 1 + 1 = 11.
- Example: 0110 + 0111 = 1101 (6 + 7 = 13).
- Shifting left by one place multiplies by 2; shifting right divides by 2 (integer division).
- **Overflow:** the result needs more bits than are available (e.g. 255 + 1 in 8 unsigned bits).

## Negative numbers

- **Two's complement** (most common): invert all bits and add 1. In 8 bits, −5 = invert(00000101) + 1 = 11111010 + 1 = 11111011.
- 8-bit two's complement range: −128 to 127.

## Text, images and sound

- **ASCII:** 7-bit codes for 128 characters ('A' = 65, 'a' = 97, '0' = 48). Extended ASCII uses 8 bits.
- **Unicode (UTF-8, UTF-16):** covers all world scripts, including Thai and Myanmar. UTF-8 uses 1–4 bytes per character and is backward-compatible with ASCII.
- **Images:** a bitmap is a grid of pixels; size in bits = width × height × colour depth. A 1920 × 1080 image at 24-bit colour ≈ 6.2 MB uncompressed. Vector images store shapes and scale without losing quality.
- **Sound:** sampled; size = sample rate × bit depth × channels × seconds.
- **Compression:** lossless keeps all data (ZIP, PNG); lossy removes some detail for smaller files (JPEG, MP3, MP4).

## Logic gates

| Gate | Output is 1 when… |
|---|---|
| AND | both inputs are 1 |
| OR | at least one input is 1 |
| NOT | the input is 0 |
| NAND | not both inputs are 1 |
| NOR | both inputs are 0 |
| XOR | exactly one input is 1 (inputs differ) |

These match the logical connectives from the Mathematics logic topic: AND ↔ ∧, OR ↔ ∨, NOT ↔ ¬.
