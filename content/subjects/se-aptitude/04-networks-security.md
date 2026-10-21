---
title: Networks, the internet and security
subject: se-aptitude
source: study-notes
---

# Networks, the internet and security

## Network types

- **PAN:** personal area network (Bluetooth between phone and earbuds).
- **LAN:** local area network in a home, school or office.
- **WLAN:** wireless LAN (Wi-Fi).
- **MAN:** city-wide network. **WAN:** wide area, e.g. the internet.

Topologies: **star** (all devices connect to a central switch — most common; one cable failure only affects one device), **bus** (single shared cable), **ring**, **mesh** (many redundant connections).

## Devices

- **Switch:** connects devices inside a LAN and forwards frames using MAC addresses.
- **Router:** connects different networks and forwards packets using IP addresses (e.g. your home network to the internet).
- **Modem:** converts signals between your network and the ISP's line.
- **Access point:** provides Wi-Fi to a wired network.
- **NIC:** network interface card; each has a unique **MAC address** (48 bits, written in hex).
- **Firewall:** filters traffic according to security rules.

## Addresses and names

- **IPv4:** 32 bits, written as four numbers 0–255, e.g. 192.168.1.10. **IPv6:** 128 bits, written in hex.
- Private ranges such as 192.168.x.x are used inside home networks; **NAT** on the router shares one public IP.
- **DNS** translates domain names (cmu.ac.th) into IP addresses.
- **DHCP** automatically assigns IP addresses to devices.

## Protocols and ports

| Protocol | Purpose | Port |
|---|---|---|
| HTTP | web pages (unencrypted) | 80 |
| HTTPS | web pages encrypted with TLS | 443 |
| FTP | file transfer | 21 |
| SSH | secure remote login | 22 |
| SMTP | send email | 25 / 587 |
| POP3 / IMAP | receive email | 110 / 143 |
| DNS | name lookup | 53 |

- **TCP:** connection-oriented, reliable, ordered delivery (web, email). **UDP:** connectionless, faster, no delivery guarantee (video calls, streaming, online games, DNS).
- **TCP/IP model layers:** Application (HTTP, DNS), Transport (TCP, UDP), Internet (IP), Network Access / Link (Ethernet, Wi-Fi).
- **OSI model (7 layers):** Physical, Data Link, Network, Transport, Session, Presentation, Application.
- Data is split into **packets**; packet switching lets packets take different routes and be reassembled.

## The web

- A **URL** such as https://www.camt.cmu.ac.th/index.html has a protocol (https), a domain (www.camt.cmu.ac.th) and a path (/index.html).
- **Client–server:** the browser (client) sends requests; a web server returns responses. HTML structures pages, CSS styles them, JavaScript adds behaviour.
- Bandwidth = maximum data rate; latency = delay.

## Security basics

- **Malware:** virus (attaches to files, needs a host program), worm (spreads by itself across networks), trojan (disguised as legitimate software), ransomware (encrypts files and demands payment), spyware, adware.
- **Phishing:** fake emails or sites that trick users into giving passwords. **Social engineering:** manipulating people rather than systems.
- **DoS / DDoS:** flooding a service so legitimate users cannot reach it.
- **Defences:** strong unique passwords, **two-factor authentication (2FA)**, software updates and patches, firewalls, antivirus, backups, encryption.
- **Encryption:** symmetric (same key to encrypt and decrypt, e.g. AES) vs asymmetric (public key encrypts, private key decrypts, e.g. RSA). HTTPS uses both.
- **Hashing** is one-way; websites should store password hashes, not passwords.
- **CIA triad:** Confidentiality, Integrity, Availability.
