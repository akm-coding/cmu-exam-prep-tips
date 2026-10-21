---
title: Computer hardware basics
subject: se-aptitude
source: study-notes
---

# Computer hardware basics

## The basic model: input → process → output, plus storage

A computer accepts input, processes it, stores data and produces output. Most modern computers follow the **von Neumann architecture**: one memory holds both program instructions and data, and the CPU fetches instructions from memory one after another.

## CPU (Central Processing Unit)

- **ALU (Arithmetic Logic Unit):** performs arithmetic (+, −) and logic (AND, OR, comparisons).
- **Control Unit (CU):** decodes instructions and directs the other components.
- **Registers:** tiny, fastest storage inside the CPU (e.g. program counter holds the address of the next instruction; accumulator holds intermediate results).
- **Fetch–decode–execute cycle:** fetch the instruction from memory, decode it, execute it, repeat.
- **Clock speed:** cycles per second, measured in GHz (1 GHz = 10⁹ cycles/second).
- **Cores:** independent processing units on one chip; multi-core CPUs run tasks in parallel.
- **Cache (L1, L2, L3):** small fast memory between CPU and RAM; L1 is smallest and fastest.
- **GPU:** a processor with many simple cores for parallel work — graphics, and also machine learning.

## Memory and storage

| Type | Volatile? | Notes |
|---|---|---|
| Registers | Yes | Inside CPU, fastest |
| Cache | Yes | SRAM, very fast |
| RAM (main memory) | Yes | DRAM; holds running programs and data; lost when power is off |
| ROM | No | Read-only; holds firmware such as BIOS/UEFI boot code |
| SSD | No | Flash memory, no moving parts, fast |
| HDD | No | Magnetic spinning platters, slower, cheaper per GB |
| Optical / USB flash / cloud | No | Removable or remote storage |

Memory hierarchy: registers → cache → RAM → SSD/HDD. Going down: larger, cheaper per byte, slower.

- **Primary storage** = memory the CPU accesses directly (RAM, ROM, cache). **Secondary storage** = long-term, non-volatile (SSD, HDD).
- **Virtual memory:** the OS uses disk space as an extension of RAM when RAM is full (slower).

## Motherboard, buses and ports

- **Motherboard:** main circuit board connecting CPU, RAM, storage and expansion cards.
- **Bus:** set of wires that carries data (data bus), addresses (address bus) and control signals (control bus).
- **Ports:** USB (general devices), HDMI/DisplayPort (video), Ethernet RJ-45 (wired network), audio jack.
- **PSU:** power supply unit converts AC mains power to DC for components.

## Input and output devices

- Input: keyboard, mouse, touchscreen, microphone, scanner, webcam, sensors.
- Output: monitor, printer, speakers, projector.
- Both: touchscreen, network card, external storage.

## Common exam facts

- RAM is volatile; ROM and SSD are not.
- The CPU is often called the "brain" of the computer; the ALU does calculations.
- An SSD is faster than an HDD because it has no moving mechanical parts.
- Increasing RAM helps when many programs run at once; a faster CPU helps computation-heavy tasks.
- Firmware (BIOS/UEFI) runs first at power-on and starts the boot loader, which loads the operating system.
