# IaC Generator (Reliability & Flow)

## What This Is

An automated Infrastructure-as-Code (IaC) generator with a web-based interface. It helps developers translate high-level application requirements into validated, production-ready configurations (Docker Compose, NGINX, Terraform, Kube) and automatically commits them to their Git repositories via OAuth.

## Core Value

Reliability and Flow: Providing developers with the confidence that their generated infrastructure is correct (through deep validation) and making the deployment of that infra frictionless (through automated Git integration).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **WEB-01**: User can specify requirements via guided wizard, DSL, or natural language.
- [ ] **GEN-01**: Generate syntax-perfect `docker-compose.yml`, NGINX `.conf`, Terraform, and Kubernetes files.
- [ ] **VAL-01**: Static validation (YAML/HCL syntax + best practices linters).
- [ ] **VAL-02**: Runtime verification (sandboxed testing of generated configs).
- [ ] **VAL-03**: AI-driven analysis of security and architectural patterns.
- [ ] **GIT-01**: OAuth integration with GitHub and GitLab for automated commits.
- [ ] **UI-01**: Real-time feedback and visualization of the generated architecture.

### Out of Scope

- [ ] **OP-01**: Directly managing cloud infrastructure (the tool only generates the code, it doesn't "apply" it to live infra).
- [ ] **MON-02**: Post-deployment monitoring or logging setup.

## Context

The project aims to solve the "blank page" problem and the "syntax error" problem for IaC. By providing multiple input modes (from novice-friendly wizards to power-user DSLs) and a high degree of validation, it serves both beginners and experts who want to move fast without breaking things.

## Constraints

- **Tech Stack**: Must use a robust backend for generation (e.g., Node or Python) and a modern frontend (React/TypeScript).
- **Security**: OAuth tokens must be handled with extreme care (no permanent storage of PATs if possible).
- **Environment**: Runtime validation requires a secure, isolated sandbox (e.g., Firecracker or temporary Docker containers).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| "Reliability & Flow" Priority | Chosen over "broadest possible IaC types" to ensure quality over quantity. | — Pending |
| OAuth for Git Auth | Provides the best UX and most secure token management for the user. | — Pending |
| Sandboxed Runtime Validation | Necessary to ensure "it actually works" beyond simple syntax checks. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: March 22, 2026 after initialization*
