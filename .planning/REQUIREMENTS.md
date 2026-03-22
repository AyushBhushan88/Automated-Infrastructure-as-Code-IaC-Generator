# Requirements: IaC Generator (Reliability & Flow)

**Defined:** March 22, 2026
**Core Value:** Users can confidently generate, validate, and commit production-ready IaC with minimal friction and maximum security.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication & Git Flow

- [ ] **AUTH-01**: User can connect GitHub/GitLab via OAuth (GitHub/GitLab Apps).
- [ ] **AUTH-02**: User can authorize specific repositories for the tool (granular access).
- [ ] **AUTH-03**: User can automatically commit generated configurations to a new branch.
- [ ] **AUTH-04**: User can create a Pull Request (PR) with a best-practice description.

### Infrastructure Generation

- [ ] **GEN-01**: User can define app requirements via a guided wizard (languages, DBs, proxies).
- [ ] **GEN-02**: User can describe their app in natural language (AI-driven generation).
- [ ] **GEN-03**: Generate syntax-perfect `docker-compose.yml`, NGINX `.conf`, Terraform, and K8s files.

### Validation & Security

- [ ] **VAL-01**: Static syntax checking and security linting (e.g., Checkov/Trivy).
- [ ] **VAL-02**: Runtime verification (sandboxed execution in Firecracker/LocalStack).
- [ ] **VAL-03**: AI-driven logical flaw detection and security analysis.

### User Interface

- [ ] **UI-01**: Real-time feedback and visualization of the generated architecture (XyFlow/React Flow).

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Git & Generation

- **GIT-01**: Bidirectional sync (detect manual changes in Git).
- **GEN-04**: Blueprint/DSL for power users to define requirements.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Direct Cloud Deployment ("Apply") | Managing live infrastructure state is risky and moves the product from a "generator" to an "operator," carrying massive liability. |
| Post-Deployment Monitoring | Out of scope and dilutes the core value proposition of "Reliability & Flow." |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 5 | Pending |
| AUTH-02 | Phase 5 | Pending |
| AUTH-03 | Phase 6 | Pending |
| AUTH-04 | Phase 6 | Pending |
| GEN-01 | Phase 1 | Pending |
| GEN-02 | Phase 4 | Pending |
| GEN-03 | Phase 1 | Pending |
| VAL-01 | Phase 3 | Pending |
| VAL-02 | Phase 7 | Pending |
| VAL-03 | Phase 8 | Pending |
| UI-01 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: March 22, 2026*
*Last updated: March 22, 2026 after roadmap creation*
