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
      const checkovIssues = await this.runCheckov(tempDir);
      const trivyIssues = await this.runTrivy(tempDir);

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
          tool: 'checkov' // Defaulting for now
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
    // Placeholder for Task 2
    return [];
  }

  private async runTrivy(dir: string): Promise<ValidationIssue[]> {
    // Placeholder for Task 2
    return [];
  }
}
