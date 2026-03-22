<!-- GSD:project-start source:PROJECT.md -->
## Project

**IaC Generator (Reliability & Flow)**

An automated Infrastructure-as-Code (IaC) generator with a web-based interface. It helps developers translate high-level application requirements into validated, production-ready configurations (Docker Compose, NGINX, Terraform, Kube) and automatically commits them to their Git repositories via OAuth.

**Core Value:** Reliability and Flow: Providing developers with the confidence that their generated infrastructure is correct (through deep validation) and making the deployment of that infra frictionless (through automated Git integration).

### Constraints

- **Tech Stack**: Must use a robust backend for generation (e.g., Node or Python) and a modern frontend (React/TypeScript).
- **Security**: OAuth tokens must be handled with extreme care (no permanent storage of PATs if possible).
- **Environment**: Runtime validation requires a secure, isolated sandbox (e.g., Firecracker or temporary Docker containers).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
