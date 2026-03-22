# Discovery: IaC Generation Strategy

## Objective
Choose the most reliable and maintainable strategy for generating Docker Compose, NGINX, Terraform, and Kubernetes files from a user-defined stack configuration in Node.js.

## Options

### Option A: String Templates (Handlebars / EJS)
- **Pros:** Simple to implement, easy to read, low dependency overhead.
- **Cons:** No syntax/validation at generation time, easy to create invalid files with minor errors.

### Option B: Programmatic Generators (js-yaml, cdktf-like)
- **Pros:** Type-safe, guaranteed valid syntax (YAML/JSON-based), reusable components.
- **Cons:** More complex for NGINX/HCL (needs custom mappers if not using official SDKs), higher initial overhead.

### Option C: AST Manipulation (ts-morph, hcl-parser)
- **Pros:** Maximum control, can modify existing files easily.
- **Cons:** Overkill for simple wizard-based generation, high complexity.

## Decision
**Option B (Programmatic Generators)** for YAML-based formats (Docker, K8s) using `yaml` library, and **Option A (String Templates)** for NGINX and Terraform (HCL) where official programmatic generators for Node.js are less mature or overly complex for this phase.

## Task Breakdown for Phase 1
1. **Core Schema:** Use `zod` to define the configuration object.
2. **Generators:**
   - Docker Compose: `yaml` package
   - NGINX: Handlebars template
   - Terraform: Simple JSON-to-HCL mapper or template
   - Kubernetes: `yaml` package
3. **UI:** `react-hook-form` + `zod` for the wizard. `shiki` for code preview.

## Verification Plan
- Unit tests that generate files and check against snapshots.
- Manual verification of the wizard flow.
