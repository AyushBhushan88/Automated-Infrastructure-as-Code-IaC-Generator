# Technology Stack

**Project:** IaC Generator
**Researched:** 2026

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js / TypeScript | 22+ | Backend API & Orchestration | Excellent ecosystem for AST parsing (e.g., `ts-morph`, `hcl-parser`) and high-performance async orchestration. |
| Next.js / React | 15+ | Frontend UI | Component-based UI ideal for interactive wizard flows and real-time visualization of architecture. |

### Infrastructure & Sandboxing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Firecracker (via E2B / Custom) | 1.x | Runtime Validation Sandbox (VAL-02) | Strong hardware-level isolation for running untrusted AI-generated IaC. Prevents severe container escape risks. |
| LocalStack | Pro/Enterprise | Cloud API Emulation | For simulating AWS responses during validation without incurring real cloud costs, with communicated fidelity limits. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Checkov / Trivy | Latest | Static Validation (VAL-01) | Run on all generated code to catch insecure defaults and deprecated provider versions before user review. |
| Octokit (GitHub API) | Latest | Git Integration (GIT-01) | Managing GitHub App installations, fine-grained tokens, and automated commits. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Sandboxing | Firecracker | Standard Docker | Docker shares the host kernel; running untrusted or AI-generated IaC in Docker is a critical security vulnerability. |
| Git Auth | GitHub Apps | OAuth Apps | OAuth Apps grant overly broad permissions that enterprise users will block. GitHub Apps provide granular access control. |

## Sources
- [HIGH] Firecracker documentation and E2B multi-tenant architecture guides.
- [HIGH] GitHub API Documentation (Apps vs OAuth).
- [MEDIUM] Benchmarks for Next.js/React performance in 2026.
