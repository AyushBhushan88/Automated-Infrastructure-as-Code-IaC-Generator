# Research: Static Validation & Security (VAL-01)

## Objective
Implement a Static Validator component that runs Checkov or Trivy on generated IaC (Docker Compose, NGINX, Terraform, Kubernetes) within the Node.js monorepo.

## Findings

### Tool Comparison

| Feature | Checkov | Trivy | Gixy |
|---------|---------|-------|------|
| Primary Focus | IaC Misconfiguration | CVE Scanning & Misconfig | NGINX Configuration |
| Support | TF, K8s, Docker | TF, K8s, Docker, OS Packages | NGINX Only |
| Output Formats | JSON, CLI, SARIF | JSON, CLI, SARIF, Table | JSON |
| Performance | Fast (Graph-based) | Very Fast | Fast |

**Recommendation:**
- Use **Checkov** for deep IaC logic analysis (Terraform, Kubernetes, Docker Compose).
- Use **Trivy** for container vulnerability (CVE) scanning and broad filesystem misconfiguration detection.
- Optionally use **Gixy** for deep NGINX analysis if required (VAL-01 mentions NGINX).

### Integration Strategy
The standard pattern for Node.js integration is wrapping the CLI using `child_process.exec` or `spawn` and parsing the JSON output.

- **Checkov Command:** `checkov -d <path> -o json --quiet --no-guide`
- **Trivy Command:** `trivy fs <path> -f json --quiet`

### Architectural Pattern
Implement a `StaticValidator` class in `packages/core/src/validation` that:
1. Writes generated files to a temporary directory.
2. Executes the validation tools (Checkov/Trivy).
3. Parses and translates JSON outputs into a unified `ValidationResult` format.
4. Cleans up the temporary directory.

### Pitfalls to Avoid
- **Environment Dependencies:** Both Checkov (Python-based) and Trivy (Go-based) require their respective binaries to be present in the runtime environment.
- **Handling False Positives:** AI-generated code may trigger common security alerts. The system should support inline skip comments (e.g., `# checkov:skip=CKV_AWS_1:Allow public read`) to suppress valid exceptions.
- **Performance:** Running multiple scans synchronously can be slow. Consider running them in parallel and caching results if inputs haven't changed.

## Implementation Plan (Draft)
1. **Infrastructure:** Create a `ValidationService` in `packages/core`.
2. **Execution:** Implement CLI wrappers for Checkov and Trivy.
3. **Refinement:** Map tool-specific error codes to user-friendly messages for the UI.
4. **Integration:** Update the `/api/generate` endpoint to include validation results in the response.

## Sources
- [HIGH] Checkov Documentation: https://www.checkov.io/docs/
- [HIGH] Trivy Documentation: https://aquasecurity.github.io/trivy/
- [MEDIUM] Gixy GitHub Repository: https://github.com/yandex/gixy
