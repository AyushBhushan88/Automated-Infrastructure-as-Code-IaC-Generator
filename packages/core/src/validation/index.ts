import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ValidationResult, ValidationIssue, Severity } from './types';

const execAsync = promisify(exec);

export class ValidationService {
  /**
   * Run static analysis on a set of generated files.
   * @param files Record of filename to file content.
   */
  async validate(files: Record<string, string>): Promise<ValidationResult> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'iac-gen-validation-'));
    
    try {
      // Write files to temp directory
      for (const [filename, content] of Object.entries(files)) {
        const filePath = path.join(tempDir, filename);
        // Ensure subdirectories exist if filename contains slashes
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
      }

      // Run tools (Task 2)
      const [checkovIssues, trivyIssues] = await Promise.all([
        this.runCheckov(tempDir),
        this.runTrivy(tempDir)
      ]);

      const allIssues = [...checkovIssues, ...trivyIssues];
      
      const summary = {
        critical: allIssues.filter(i => i.severity === 'CRITICAL').length,
        high: allIssues.filter(i => i.severity === 'HIGH').length,
        medium: allIssues.filter(i => i.severity === 'MEDIUM').length,
        low: allIssues.filter(i => i.severity === 'LOW').length,
        total: allIssues.length,
      };

      return {
        issues: allIssues,
        summary,
        success: summary.critical === 0 && summary.high === 0,
      };
    } catch (error) {
      console.error('Validation failed:', error);
      return {
        issues: [{
          id: 'VALIDATION_ERROR',
          title: 'Validation failed',
          severity: 'HIGH',
          message: error instanceof Error ? error.message : String(error),
          file: 'global',
          tool: 'checkov'
        }],
        summary: { critical: 0, high: 1, medium: 0, low: 0, total: 1 },
        success: false
      };
    } finally {
      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async runCheckov(dir: string): Promise<ValidationIssue[]> {
    try {
      const { stdout } = await execAsync(`checkov -d ${dir} -o json --quiet --no-guide`);
      const results = JSON.parse(stdout);
      
      const issues: ValidationIssue[] = [];
      const reports = Array.isArray(results) ? results : [results];

      for (const report of reports) {
        if (report.results && report.results.failed_checks) {
          for (const check of report.results.failed_checks) {
            issues.push({
              id: check.check_id,
              title: check.check_name,
              severity: this.mapCheckovSeverity(check.severity),
              message: check.check_result.result_description || check.check_name,
              file: check.file_abs_path.replace(dir, '').substring(1), // relative path
              line: check.file_line_range ? check.file_line_range[0] : undefined,
              code: check.code_block ? check.code_block.map((c: [number, string]) => c[1]).join('\n') : undefined,
              tool: 'checkov'
            });
          }
        }
      }
      return issues;
    } catch (error: any) {
      // Checkov returns non-zero exit code if it finds issues
      if (error.stdout) {
        try {
          const results = JSON.parse(error.stdout);
          // Recursively call same logic for the case of issues found (non-zero exit)
          return this.parseCheckovOutput(results, dir);
        } catch (e) {
          console.warn('Failed to parse Checkov output:', e);
        }
      }
      console.warn('Checkov not installed or failed to execute:', error.message);
      return [];
    }
  }

  private parseCheckovOutput(results: any, dir: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const reports = Array.isArray(results) ? results : [results];

    for (const report of reports) {
      if (report.results && report.results.failed_checks) {
        for (const check of report.results.failed_checks) {
          issues.push({
            id: check.check_id,
            title: check.check_name,
            severity: this.mapCheckovSeverity(check.severity),
            message: check.check_result.result_description || check.check_name,
            file: check.file_abs_path.replace(dir, '').substring(1),
            line: check.file_line_range ? check.file_line_range[0] : undefined,
            code: check.code_block ? check.code_block.map((c: [number, string]) => c[1]).join('\n') : undefined,
            tool: 'checkov'
          });
        }
      }
    }
    return issues;
  }

  private mapCheckovSeverity(severity: string): Severity {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'CRITICAL';
      case 'HIGH': return 'HIGH';
      case 'MEDIUM': return 'MEDIUM';
      case 'LOW': return 'LOW';
      default: return 'MEDIUM';
    }
  }

  private async runTrivy(dir: string): Promise<ValidationIssue[]> {
    try {
      const { stdout } = await execAsync(`trivy fs ${dir} -f json --quiet`);
      const results = JSON.parse(stdout);
      
      const issues: ValidationIssue[] = [];
      if (results.Results) {
        for (const result of results.Results) {
          if (result.Misconfigurations) {
            for (const misconf of result.Misconfigurations) {
              issues.push({
                id: misconf.ID,
                title: misconf.Title,
                severity: this.mapTrivySeverity(misconf.Severity),
                message: misconf.Message,
                file: result.Target.replace(dir, '').substring(1) || result.Target,
                line: misconf.CauseMetadata?.StartLine,
                tool: 'trivy'
              });
            }
          }
        }
      }
      return issues;
    } catch (error: any) {
      console.warn('Trivy not installed or failed to execute:', error.message);
      return [];
    }
  }

  private mapTrivySeverity(severity: string): Severity {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'CRITICAL';
      case 'HIGH': return 'HIGH';
      case 'MEDIUM': return 'MEDIUM';
      case 'LOW': return 'LOW';
      default: return 'MEDIUM';
    }
  }
}
