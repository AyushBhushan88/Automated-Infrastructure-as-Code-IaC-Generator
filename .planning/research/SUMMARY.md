# Project Research Summary

**Project:** IaC Generator
**Domain:** Automated Infrastructure as Code Generation and Validation
**Researched:** February 2026
**Confidence:** HIGH

## Executive Summary

The IaC Generator is designed to automate the creation and validation of infrastructure as code (Terraform, Kubernetes, Docker Compose) while prioritizing security and developer flow. Modern experts build such products using a multi-stage pipeline that separates high-level intent capture from low-level generation, static analysis, and hardware-isolated runtime validation. The core value proposition is "Reliability & Flow," ensuring that generated code not only follows best practices but is actually functional before it reaches a user's repository.

The recommended approach utilizes a Node.js/TypeScript backend to orchestrate an LLM or AST-based generation engine. Key architectural decisions include using GitHub Apps for fine-grained repository access and Firecracker MicroVMs for secure, isolated runtime testing. This setup prevents the common "Master Key" security pitfall of legacy OAuth apps and protects the host infrastructure from potential exploits within untrusted generated code.

Key risks include the "Fidelity Gap" where emulated environments (like LocalStack) may not perfectly reflect real cloud behavior, and the security implications of executing unvalidated code. These are mitigated through layered validation (static + dynamic), clear user communication of sandbox limits, and robust hardware-level isolation.

## Key Findings

### Recommended Stack

A modern, type-safe stack using Node.js 22+ and Next.js 15+ is recommended for its excellent ecosystem support for AST parsing and high-performance async orchestration.

**Core technologies:**
- **Node.js / TypeScript (22+):** Backend API & Orchestration — Excellent ecosystem for AST parsing and high-performance async orchestration.
- **Next.js / React (15+):** Frontend UI — Component-based UI ideal for interactive wizard flows and real-time visualization.
- **Firecracker (via E2B / Custom):** Runtime Validation Sandbox — Strong hardware-level isolation for running untrusted AI-generated IaC.
- **LocalStack (Pro/Enterprise):** Cloud API Emulation — For simulating AWS responses during validation without incurring real cloud costs.
- **Checkov / Trivy:** Static Validation — Run on all generated code to catch insecure defaults and deprecated provider versions.

### Expected Features

The MVP focuses on the end-to-end flow from input to a validated Git commit, ensuring users can trust the code they merge.

**Must have (table stakes):**
- **Syntax & Linting Validation** — Users expect generated code to be syntactically correct and follow basic best practices.
- **Multi-Provider Support** — AWS (Terraform), Kubernetes, and local environments (Docker Compose).
- **Automated Commits (Git)** — Direct integration via modern GitHub Apps to avoid manual friction.

**Should have (competitive):**
- **Sandboxed Runtime Verification** — Proving the code actually runs in a secure, isolated environment (Firecracker).
- **Real-Time Visual Architecture** — Seeing the architecture diagram update as requirements are adjusted.

**Defer (v2+):**
- **Direct Cloud Deployment ("Apply")** — Managing live state carries too much risk for an initial release; focus on being a generator.
- **Post-Deployment Monitoring** — Out of scope for the core "Reliability & Flow" value proposition.

### Architecture Approach

A multi-stage pipeline architecture separating Generation, Static Validation, Dynamic Validation, and Git Integration ensures scalability and security.

**Major components:**
1. **Generation Engine** — Translates user intent into HCL/YAML/Conf files using ASTs or LLMs.
2. **Static Validator** — Runs local linters (Checkov, Trivy) to catch basic syntax/security errors.
3. **Sandbox Manager** — Orchestrates Firecracker MicroVMs to execute and test the generated code.
4. **Git Integration Service** — Manages GitHub App tokens and commits validated code to user repositories.

### Critical Pitfalls

1. **"Master Key" OAuth Scopes** — Avoid legacy OAuth; use GitHub Apps with fine-grained, repository-specific permissions to ensure enterprise security compliance.
2. **Fidelity Gap in Sandboxes** — LocalStack success doesn't always guarantee AWS success; use layered validation (static + dynamic) and clearly communicate sandbox limits.
3. **Shared Kernel Exploits** — Never run untrusted or AI-generated code in standard Docker; use Firecracker MicroVMs for hardware-level isolation during validation.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Static Generation
**Rationale:** Establishes the core generation capability and provides immediate utility with perfectly linted code. Low complexity with high impact.
**Delivers:** Web Wizard UI, Generation Engine (Terraform/Docker), and Static Validation pipeline.
**Addresses:** WEB-01, GEN-01, VAL-01.
**Avoids:** Pitfall 5 (Stale Provider Versions) and Pitfall 6 (Connectivity Errors).

### Phase 2: Secure Git Integration
**Rationale:** Automates the developer flow, moving from a snippet generator to a workflow platform. Critical for enterprise adoption.
**Delivers:** GitHub App integration, fine-grained token management, and automated PR creation.
**Uses:** Octokit (GitHub API), GitHub Apps.
**Implements:** Git Integration Service.
**Avoids:** Pitfall 1 ("Master Key" OAuth).

### Phase 3: Advanced Sandboxed Validation
**Rationale:** Implements the product's primary differentiator (Reliability) but carries high infrastructure and security complexity.
**Delivers:** Firecracker Sandbox Manager, LocalStack integration, and runtime integration test suites.
**Uses:** Firecracker (E2B), LocalStack.
**Avoids:** Pitfall 3 (Shared Kernel Exploits) and Pitfall 2 (Fidelity Gap).

### Phase 4: AI Security & Self-Healing
**Rationale:** Refines the output beyond basic syntax, adding high-level intelligence to catch logical flaws and auto-correct errors.
**Delivers:** AI-driven security analysis and self-correction generation loops.
**Addresses:** VAL-03 (AI Security Analysis).
**Avoids:** Pitfall 4 (Malicious Remediation).

### Phase Ordering Rationale

- **Core before Flow**: Code generation and validation must work reliably before automating the delivery (Git integration).
- **Security-First**: Implementing GitHub Apps in Phase 2 avoids the massive technical debt and security risk of migrating from legacy OAuth later.
- **Complexity Management**: Postponing the Firecracker-based Sandbox (Phase 3) allows the core UI and generation logic to stabilize first.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Sandboxed Validation):** Needs deep research on Firecracker orchestration (E2B vs Custom) and optimizing MicroVM cold-starts.
- **Phase 4 (AI Security):** Needs research on prompt engineering for IaC-specific security analysis and model fine-tuning.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Standard Next.js/Node patterns and well-documented linters.
- **Phase 2 (Git Integration):** GitHub App implementation is well-documented by GitHub.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Modern, industry-standard tools (Node 22, Firecracker) identified. |
| Features | HIGH | Clear alignment between user needs and technical capabilities. |
| Architecture | HIGH | Security-first design (GitHub Apps, MicroVMs) is well-defined. |
| Pitfalls | HIGH | Specific, high-impact risks identified with clear mitigations. |

**Overall confidence:** HIGH

### Gaps to Address

- **LocalStack Cost vs Fidelity**: Need to validate if the budget supports LocalStack Pro/Enterprise for higher-fidelity emulation during Phase 3.
- **Infrastructure Provider Choice**: Analysis needed on whether to use managed Firecracker (E2B) or self-hosted instances for the Sandbox Manager.

## Sources

### Primary (HIGH confidence)
- Firecracker/E2B architecture documentation — Sandboxing and multi-tenant security.
- GitHub API Documentation (Apps vs OAuth) — Secure integration patterns.
- Checkov/Trivy official documentation — Static analysis capabilities.

### Secondary (MEDIUM confidence)
- LocalStack Documentation — Emulation limits and service fidelity.
- Market analysis of existing IaC generators (2024-2026 trends).

---
*Research completed: February 2026*
*Ready for roadmap: yes*
