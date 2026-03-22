# Roadmap: IaC Generator (Reliability & Flow)

## Phases

- [ ] **Phase 1: Core Wizard & Generation** - Users can define stack requirements and see generated code.
- [ ] **Phase 2: Visual Architecture Feedback** - Real-time visualization of the generated infrastructure.
- [ ] **Phase 3: Static Security & Syntax Validation** - Immediate feedback on code correctness and security linting.
- [ ] **Phase 4: Natural Language Generation** - Prompt-based infrastructure generation and refinement.
- [ ] **Phase 5: Git Provider Integration** - Secure GitHub/GitLab connectivity and repository selection.
- [ ] **Phase 6: Automated Git Delivery** - Commits and Pull Requests directly from the tool.
- [ ] **Phase 7: Sandboxed Runtime Verification** - Executing and verifying code in isolated environments.
- [ ] **Phase 8: AI-Driven Security & Logic Analysis** - Deep architectural review and logical flaw detection.

## Phase Details

### Phase 1: Core Wizard & Generation
**Goal**: Users can define their infrastructure stack via a guided wizard and see generated code.
**Depends on**: Nothing
**Requirements**: GEN-01, GEN-03
**Success Criteria** (what must be TRUE):
  1. User can select stack components (languages, DBs, proxies) in a wizard.
  2. User can view generated Docker Compose and NGINX files.
  3. User can view generated Terraform and Kubernetes manifests.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Visual Architecture Feedback
**Goal**: Users can see a visual representation of their infrastructure.
**Depends on**: Phase 1
**Requirements**: UI-01
**Success Criteria** (what must be TRUE):
  1. User sees an interactive diagram of the generated infrastructure components.
  2. Changes in the wizard are reflected in the diagram in real-time.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Static Security & Syntax Validation
**Goal**: Users receive immediate feedback on code correctness and security.
**Depends on**: Phase 1
**Requirements**: VAL-01
**Success Criteria** (what must be TRUE):
  1. User sees syntax errors highlighted in the generated code.
  2. User receives a security report based on static analysis (Checkov/Trivy).
**Plans**: TBD
**UI hint**: yes

### Phase 4: Natural Language Generation
**Goal**: Users can describe their requirements in natural language.
**Depends on**: Phase 1
**Requirements**: GEN-02
**Success Criteria** (what must be TRUE):
  1. User can generate full infrastructure sets by describing them in plain text.
  2. User can refine the generation through iterative chat-like prompts.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Git Provider Integration
**Goal**: Users can securely connect their Git repositories.
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02
**Success Criteria** (what must be TRUE):
  1. User can log in via GitHub/GitLab OAuth.
  2. User can see and select specific repositories they have authorized.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Automated Git Delivery
**Goal**: Users can push code to their repos and open PRs directly.
**Depends on**: Phase 5
**Requirements**: AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. User can commit generated files to a new branch with one click.
  2. User can open a Pull Request with an automatically generated description.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Sandboxed Runtime Verification
**Goal**: Users can prove the code works in a real environment without risk.
**Depends on**: Phase 1, Phase 3
**Requirements**: VAL-02
**Success Criteria** (what must be TRUE):
  1. User can trigger a sandboxed execution of the code (Firecracker/LocalStack).
  2. User sees a "Verified" status and can inspect logs from the test run.
**Plans**: TBD
**UI hint**: yes

### Phase 8: AI-Driven Security & Logic Analysis
**Goal**: Users receive deep architectural and security insights.
**Depends on**: Phase 4, Phase 3
**Requirements**: VAL-03
**Success Criteria** (what must be TRUE):
  1. User receives alerts for high-level logical flaws (e.g., "Subnet misconfiguration").
  2. User gets actionable AI suggestions for infrastructure hardening.
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Wizard & Generation | 0/1 | Not started | - |
| 2. Visual Architecture Feedback | 0/1 | Not started | - |
| 3. Static Security & Syntax Validation | 0/1 | Not started | - |
| 4. Natural Language Generation | 0/1 | Not started | - |
| 5. Git Provider Integration | 0/1 | Not started | - |
| 6. Automated Git Delivery | 0/1 | Not started | - |
| 7. Sandboxed Runtime Verification | 0/1 | Not started | - |
| 8. AI-Driven Security & Logic Analysis | 0/1 | Not started | - |
