---
phase: 02-static-validation
plan: 01
type: execute
wave: 1
status: completed
files_modified: [packages/core/src/validation/types.ts, packages/core/src/validation/index.ts, packages/core/src/index.ts, apps/web/src/app/api/generate/route.ts, apps/web/components/CodePreview.tsx, apps/web/src/app/page.tsx]
---

## Objective
Implement a Static Validator component that runs Checkov and Trivy on generated IaC and integrate the results into the UI and API.

## Work Completed
- **Validation Infrastructure**: Created `ValidationService` in `packages/core` with temporary directory management and unified issue reporting.
- **Tool Wrappers**: Implemented CLI wrappers for **Checkov** and **Trivy** that parse JSON output and map them to a shared `ValidationIssue` format.
- **API Integration**: Updated `/api/generate` to run the validation service on generated files and return the results in the response.
- **UI Integration**:
  - Enhanced `CodePreview` with a new "Security Report" tab showing a breakdown of issues by severity.
  - Added line-specific highlighting for security warnings in the code editor.
  - Updated the main landing page (`apps/web/src/app/page.tsx`) to manage validation state and pass it to the preview component.
- **Graceful Degradation**: The system handles missing Checkov/Trivy binaries by returning an empty list of issues and warning in the logs, ensuring the core generation logic remains functional.

## Verification Results
- **API Test**: Verified that `/api/generate` now returns a `validation` object with `issues`, `summary`, and `success` status.
- **UI Test**: Verified that the `CodePreview` component correctly displays the "Security Report" tab and handles both "No issues found" and "Issues found" states.
- **Code Coverage**: New types and service are fully integrated and exported from the `core` package.

## Next Steps
- Transition to Phase 3: Visual Architecture Feedback (UI-01) to provide real-time diagrams of the generated infrastructure.
