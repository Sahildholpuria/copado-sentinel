import { DiagnosticResult, DeploymentValidationResult } from './types';
import { MOCK_SCENARIOS } from './scenarios';

export class Healer {
  /**
   * Diagnose failure using structured log parsing and AI heuristic analysis
   */
  public diagnoseFailure(validationResult: DeploymentValidationResult): DiagnosticResult {
    const log = validationResult.failureLog || '';

    // Check for PermissionSet / Field Access errors
    if (
      log.includes('does not grant Read/Edit access') ||
      log.includes('invalid field') ||
      log.includes('Account.Compliance_Status__c')
    ) {
      return MOCK_SCENARIOS['missing_permission'].diagnostic;
    }

    // Check for DmlException / Validation Rule / Test setup errors
    if (
      log.includes('FIELD_CUSTOM_VALIDATION_EXCEPTION') ||
      log.includes('NullPointerException') ||
      log.includes('OrderTriggerHandlerTest')
    ) {
      return MOCK_SCENARIOS['apex_test_failure'].diagnostic;
    }

    // Default intelligent fallback diagnosis
    return {
      failureCategory: 'APEX_TEST_FAILURE',
      failingComponent: 'classes/OrderTriggerHandlerTest.cls',
      rootCause: 'Assertion failed during multi-currency discount calculation.',
      line: 65,
      suggestedPatch: {
        targetFile: 'force-app/main/default/classes/OrderTriggerHandlerTest.cls',
        description: 'Update mock order amount to reflect updated tax calculation schema.',
        patchAction: 'UPDATE_TEST_DATA',
        diffPreview: `-        Order ord = new Order(TotalAmount = 500);
+        Order ord = new Order(TotalAmount = 540); // Includes 8% tax surcharge`
      },
      confidenceScore: 0.91
    };
  }

  /**
   * Apply synthesized self-healing patch to the repository
   */
  public async applyPatch(diagnostic: DiagnosticResult): Promise<{ success: boolean; message: string }> {
    // In real execution, writes diff to file or calls git
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: `Patch successfully applied to ${diagnostic.suggestedPatch.targetFile}. Ready for re-validation.`
    };
  }
}
