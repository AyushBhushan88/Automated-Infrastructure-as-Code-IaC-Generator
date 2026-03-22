# Domain Pitfalls

**Domain:** IaC Generator (Reliability & Flow)
**Researched:** 2026

## Critical Pitfalls

Mistakes that cause rewrites or major security breaches.

### Pitfall 1: "Master Key" OAuth Scopes
**What goes wrong:** Using legacy OAuth Apps and requesting broad `repo` permissions, essentially granting the app full read/write access to every repository the user can access.
**Why it happens:** It is the historical default for building GitHub integrations and is initially easier to configure than modern, fine-grained permissions.
**Consequences:** A single leaked token can compromise a user's entire organization or enterprise. Enterprise users and admins will actively block the app's installation due to strict internal security policies (e.g., EMU restrictions).
**Warning signs:** Users abandoning the onboarding flow at the GitHub authorization screen; security audits or enterprise customers flagging excessive permissions.
**Prevention:** Default to **GitHub Apps** instead of OAuth Apps. Use fine-grained, repository-specific permissions (e.g., `contents:write` only) and short-lived user-to-server tokens.
**Phase to address:** Phase 2 (Git Integration)

### Pitfall 2: The "Fidelity Gap" in Sandboxed Validation
**What goes wrong:** Validation environments (like LocalStack) report success, but the generated IaC fails immediately when deployed to real cloud providers.
**Why it happens:** Emulators do not perfectly enforce cloud IAM permissions, service quotas, or complex event-driven race conditions. For instance, LocalStack might allow an S3 write that AWS would block due to missing IAM roles.
**Consequences:** Destroys user trust in the core "Reliability" value proposition. Users merge "validated" code that instantly breaks production.
**Warning signs:** High rate of support tickets for "It passed validation but failed on AWS"; logs showing `AccessDenied` or `Rate Exceeded` on real deployments.
**Prevention:** Implement layered validation: Local/Docker for syntax and basic logic, supplemented by robust static linters (Checkov) to catch IAM flaws. Clearly communicate sandbox limitations to the user.
**Phase to address:** Phase 3 (Advanced Validation)

### Pitfall 3: Shared Kernel Exploits (Docker Container Escapes)
**What goes wrong:** Using standard Docker containers to run runtime verification (VAL-02) on untrusted, AI-generated, or user-provided IaC code, leading to a host compromise.
**Why it happens:** Docker shares the host's Linux kernel. If the generated code contains malicious logic (intentional or hallucinated), it can exploit a kernel vulnerability to break out of the container and access the CI/CD runner.
**Consequences:** Full compromise of the backend infrastructure; exposure of other users' generated code, secrets, and integration tokens.
**Warning signs:** Unexplained high resource usage on validation runners; suspicious outbound network traffic originating from validation nodes.
**Prevention:** Use hardware-level virtualization like **Firecracker MicroVMs** (e.g., via E2B or custom runners) for executing any untrusted code instead of standard Docker containers.
**Phase to address:** Phase 3 (Advanced Validation)

## Moderate Pitfalls

### Pitfall 4: "Malicious Remediation" & Autonomous Agents
**What goes wrong:** If the generator eventually tries to self-heal or automatically revert drift in Git, it can inadvertently "unpatch" a manual, break-glass security fix made by a human during an incident.
**Prevention:** Although "applying" infra is currently Out of Scope (OP-01), the generator's code logic must flag manual drift and present it for human review rather than force-pushing "pure" state to the repository.
**Warning signs:** Frequent Git conflicts in generated code PRs; users reporting that their emergency manual fixes were overwritten by the bot.
**Phase to address:** Phase 2 (Git Integration)

### Pitfall 5: Stale Provider Versions & Deprecations
**What goes wrong:** Generating code (HCL or Kubernetes manifests) using deprecated API versions because the underlying generation engine or AI model's training data lags behind the cloud provider's frequent updates.
**Prevention:** Incorporate a validation step that cross-references generated code against current provider SDK versions and best practices linters (like Checkov or `tfsec`) before presenting the code to the user.
**Warning signs:** Failed validations in static checks (VAL-01); user complaints of deprecated API warnings on deployment.
**Phase to address:** Phase 1 (Foundation & Static Generation)

## Minor Pitfalls

### Pitfall 6: Abstract Connectivity & "Depends_On" Errors
**What goes wrong:** Generating seemingly correct `docker-compose.yml` or `nginx.conf` files that fail at runtime because `depends_on` only checks container start (not service readiness), or Nginx starts before the upstream service is resolvable.
**Prevention:** Automatically generate health checks for database containers and inject wait-for-it scripts, or configure Nginx with variable-based upstream resolution to prevent startup crashes.
**Warning signs:** `502 Bad Gateway` from generated Nginx configs on startup; app containers crashing continuously because the DB isn't ready.
**Phase to address:** Phase 1 (Foundation & Static Generation)

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Foundation (GEN-01, VAL-01) | Generating deprecated or insecure IaC syntax | Integrate strict Policy-as-Code linters (Checkov/Trivy) immediately to catch flaws before user delivery. |
| Phase 2: Git Integration (GIT-01) | Over-permissive OAuth Apps blocking enterprise adoption | Build exclusively on GitHub Apps with fine-grained repo access and short-lived tokens from day one. |
| Phase 3: Runtime Validation (VAL-02) | Host compromise via Container Escapes | Utilize Firecracker MicroVMs for strong hardware-level isolation when executing untrusted code. |

## Sources

- [HIGH] GitHub Documentation: GitHub Apps vs OAuth Apps & Security Best Practices.
- [HIGH] Firecracker Documentation: Multi-tenant code execution security boundaries.
- [MEDIUM] Ecosystem Trends: State of automated IaC generation 2024-2026.
- [MEDIUM] LocalStack Documentation & AWS Re:Post: Emulation limitations and fidelity gaps.