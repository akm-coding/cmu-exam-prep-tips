---
title: Software and operating systems
subject: se-aptitude
source: study-notes
---

# Software and operating systems

## Types of software

- **System software:** runs the hardware and provides a platform — operating systems, device drivers, firmware, utilities (antivirus, disk cleanup, backup).
- **Application software:** helps users do tasks — browsers, word processors, spreadsheets, games, mobile apps.
- **Programming tools:** compilers, interpreters, IDEs, debuggers, version control (Git).

## Licensing

- **Proprietary / closed source:** source code is private; you buy a licence (Windows, Microsoft Office, Adobe Photoshop).
- **Open source:** source code is public and can be modified and shared under its licence (Linux, Firefox, Python, Android's AOSP).
- **Freeware:** free to use but not necessarily open source. **Shareware:** free trial, pay later.
- **SaaS (Software as a Service):** software used over the internet by subscription (Google Workspace, Microsoft 365 online).

## Operating system (OS)

The OS manages hardware resources and provides services to applications. Examples: Windows, macOS, Linux (desktop/server), Android and iOS (mobile).

Main functions:

1. **Process management:** creates and schedules processes; multitasking by switching the CPU between processes.
2. **Memory management:** allocates RAM to processes; virtual memory and paging.
3. **File management:** organises files in directories/folders; file systems such as NTFS, FAT32, ext4, APFS.
4. **Device management:** controls devices through **drivers**.
5. **User interface:** GUI (windows, icons, menus, pointer) or CLI (command line).
6. **Security:** user accounts, permissions, authentication.

Key terms:

- **Program vs process:** a program is code stored on disk; a process is a program being executed.
- **Thread:** a smaller unit of execution inside a process; threads share the process's memory.
- **Kernel:** the core of the OS that runs with full hardware access.
- **Booting:** firmware → boot loader → kernel loads → user login.
- **Deadlock:** two or more processes each wait for a resource held by another, so none can continue.

## Compiler vs interpreter

| | Compiler | Interpreter |
|---|---|---|
| How it works | Translates the whole program to machine code before running | Translates and runs line by line |
| Output | Executable file | No separate executable |
| Speed of running | Usually faster | Usually slower |
| Error reporting | After compiling the whole program | Stops at the first error encountered |
| Examples | C, C++, Go, Rust | Python, JavaScript (in practice with JIT), Ruby |

- **Assembler:** translates assembly language to machine code.
- Java compiles to **bytecode**, which runs on the Java Virtual Machine (JVM).
- Language levels: machine code (binary) → assembly → high-level languages (Python, Java, C).

## Cloud computing models

- **IaaS:** rent virtual machines and storage (AWS EC2).
- **PaaS:** a managed platform to deploy code (Heroku, Google App Engine).
- **SaaS:** finished applications in the browser (Gmail).

## Common exam facts

- A device driver lets the OS talk to a specific piece of hardware.
- Android is based on the Linux kernel.
- Utilities (antivirus, compression, defragmentation) are system software.
- A compiler produces a standalone executable; an interpreter needs to be present every time the program runs.
