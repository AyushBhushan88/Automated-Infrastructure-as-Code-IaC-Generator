export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface ValidationIssue {
  id: string;
  title: string;
  severity: Severity;
  message: string;
  file: string;
  line?: number;
  code?: string;
  tool: 'checkov' | 'trivy';
}

export interface ValidationResult {
  issues: ValidationIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  success: boolean;
}
