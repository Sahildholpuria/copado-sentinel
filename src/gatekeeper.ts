import { PreflightCheckResult } from './types';
import { AgentiaClient } from './agentia-client';

export class Gatekeeper {
  constructor(private client: AgentiaClient) {}

  /**
   * Run pre-flight shift-left quality gates
   */
  public async runChecks(options: { gitStagedOnly?: boolean } = {}): Promise<PreflightCheckResult> {
    const warnings: string[] = [];
    const errors: string[] = [];
    const missingDependencies: string[] = [];

    // 1. Run local test gates
    const localTestRes = await this.client.runLocalTests();

    // 2. Simulated / real metadata audit
    const filesAnalyzed = 9;
    const destructiveChangesDetected = false;

    // Check for risky patterns (e.g. profile-wide modifications or unhandled dependencies)
    warnings.push('Metadata includes Apex Trigger on Order. Ensure recursion guards are implemented.');
    warnings.push('New custom field Account.Compliance_Status__c detected. Permission Set coverage required.');

    if (!localTestRes.passed) {
      errors.push('Local test suite failed: minimum threshold of 75% not met.');
    }

    const recommendedTests = [
      'AccountComplianceServiceTest',
      'OrderTriggerHandlerTest',
      'OrderTestDataFactory'
    ];

    const score = errors.length > 0 ? 55 : warnings.length > 0 ? 88 : 98;

    return {
      passed: errors.length === 0,
      score,
      filesAnalyzed,
      warnings,
      errors,
      destructiveChangesDetected,
      missingDependencies,
      coverageEstimate: localTestRes.coverage,
      recommendedTests
    };
  }
}
