# Architecture Patterns

**Domain:** Automated IaC Generation & Validation
**Researched:** 2026

## Recommended Architecture

A multi-stage pipeline architecture separating Generation, Static Validation, Dynamic Validation, and Deployment.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Web UI / Client | Captures user intent (Wizard/DSL) and displays real-time feedback. | Generation API |
| Generation Engine | Translates intent into HCL/YAML/Conf files using ASTs or LLMs. | Static Validator, Client |
| Static Validator | Runs local linters (Checkov, Trivy) to catch basic syntax/security errors. | Generation Engine |
| Sandbox Manager | Orchestrates Firecracker MicroVMs to execute and test the generated code. | Dynamic Validation Workers |
| Git Integration Service | Manages GitHub/GitLab App tokens and commits validated code. | Web UI, GitHub/GitLab API |

## Data Flow

1. **Input:** User submits requirements via Web UI.
2. **Generation:** Engine generates draft IaC files in memory.
3. **Static Check:** Draft files are piped through the Static Validator. If errors exist, the Engine attempts automatic self-correction.
4. **Dynamic Check (Optional):** If requested, files are sent to the Sandbox Manager, which spins up an ephemeral MicroVM, applies the code against an emulator (LocalStack), and runs integration tests.
5. **Commit:** Upon validation success, the Git Integration Service uses a short-lived user-to-server token to push the code to a new branch in the user's repository.

## Patterns to Follow

### Pattern 1: Ephemeral Identity
**What:** Using short-lived, finely scoped tokens for Git interactions.
**When:** Whenever committing code on behalf of a user.
**Example:** Using the GitHub App installation ID to request a 1-hour token scoped *only* to the specific repository and the `contents:write` permission.

### Pattern 2: Hardware-Isolated Sandboxing
**What:** Running untrusted runtime validation tasks in MicroVMs.
**When:** Implementing VAL-02 (Runtime Verification).
**Example:** Using Firecracker to boot a fresh Linux kernel in <200ms for each validation request, destroying it immediately after the test completes.

## Anti-Patterns to Avoid

### Anti-Pattern 1: The "Master Key" OAuth
**What:** Requesting the `repo` scope via a standard OAuth App.
**Why bad:** Grants permanent access to all user repositories. A token leak compromises the entire enterprise.
**Instead:** Use GitHub Apps.

### Anti-Pattern 2: Docker-in-Docker (DinD) for Untrusted Code
**What:** Running user-generated container configurations inside a DinD setup on the primary CI runner.
**Why bad:** Exposes the host runner kernel to container escape vulnerabilities.
**Instead:** Use hardware virtualization (Firecracker).

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Sandbox Execution | Local Docker instances (beta). | Pooled Firecracker MicroVMs. | Dedicated sandbox clusters with cold-start optimizations. |
| Git Rate Limits | Single App installation. | Multiple App installations or intelligent commit batching. | Enterprise-specific App installations per customer. |

## Sources
- [HIGH] Best practices for multi-tenant code execution environments (2025/2026 security benchmarks).
- [HIGH] Firecracker/E2B architecture documentation.
