# Feature Landscape

**Domain:** Automated IaC Generation
**Researched:** 2026

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Syntax & Linting Validation | Users expect generated code to be syntactically correct and follow basic best practices. | Low | Use Checkov/Trivy. |
| Multi-Provider Support | At minimum, AWS (Terraform) and Kubernetes, plus local environments (Docker Compose). | Medium | Requires maintaining up-to-date knowledge of provider SDKs. |
| Automated Commits (Git) | Manually downloading Zips and pushing is high friction. | Medium | Must use modern Git App integrations, not legacy OAuth. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sandboxed Runtime Verification | Proving the code *actually runs* (e.g., Nginx routes traffic to the container). | High | Requires Firecracker MicroVMs and complex state management. |
| Real-Time Visual Architecture | Seeing the diagram update as the natural language or DSL is adjusted. | Medium | Provides immediate confidence before generating raw HCL/YAML. |
| AI Security Analysis | Identifying logical flaws (e.g., overly permissive IAM) that static linters miss. | High | Requires training models on specific IaC security contexts. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Direct Cloud Deployment ("Apply") | Managing live infrastructure state is risky and moves the product from a "generator" to an "operator," carrying massive liability. | Generate the code, commit it to Git, and let the user's existing CI/CD pipeline handle the `terraform apply`. |
| Post-Deployment Monitoring | Out of scope and dilutes the core value proposition of "Reliability & Flow." | Focus exclusively on pre-deployment validation. |

## Feature Dependencies

```
Syntax Validation (VAL-01) → Automated Commits (GIT-01) (Don't commit broken code)
Automated Commits (GIT-01) → Sandboxed Verification (VAL-02) (Need a robust pipeline before complex runtime checks)
```

## MVP Recommendation

Prioritize:
1. Guided Wizard / DSL Input (WEB-01)
2. Generate perfectly linted Docker Compose & Terraform (GEN-01, VAL-01)
3. GitHub App integration for automated commits (GIT-01)

Defer: Sandboxed Runtime Verification (VAL-02) and AI Security Analysis (VAL-03) until the core flow is proven.

## Sources
- [HIGH] PROJECT.md constraints and core value definitions.
- [MEDIUM] Market analysis of existing IaC generators (2024-2026 trends).
