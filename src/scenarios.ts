import { DiagnosticResult, DeploymentValidationResult } from './types';

export interface MockScenario {
  id: string;
  name: string;
  description: string;
  validationResult: DeploymentValidationResult;
  diagnostic: DiagnosticResult;
  repairedValidationResult: DeploymentValidationResult;
}

export const MOCK_SCENARIOS: Record<string, MockScenario> = {
  missing_permission: {
    id: 'missing_permission',
    name: 'Missing Custom Field Permission in Permission Set',
    description: 'Apex class references Account.Compliance_Status__c, but field is omitted from Sales_Ops_PermSet.',
    validationResult: {
      deploymentId: 'DEP-849102-QA',
      status: 'FAILED',
      canQuickDeploy: false,
      totalTests: 14,
      testsPassed: 13,
      testsFailed: 1,
      codeCoveragePercentage: 81,
      durationSeconds: 24,
      jobId: 'JE-99201',
      failureLog: `[Copado Job Engine JE-99201]
Component Failure: classes/AccountComplianceService.cls
Error (Line 42): Variable does not exist or invalid field 'Compliance_Status__c' on SObject 'Account'.
PermissionSet Validation Error: Sales_Ops_PermSet does not grant Read/Edit access to Account.Compliance_Status__c in target org Alchemy_Staging.
STATUS: FAILED_VALIDATION`
    },
    diagnostic: {
      failureCategory: 'MISSING_FIELD_PERMISSION',
      failingComponent: 'permissionsets/Sales_Ops_PermSet.permissionset-meta.xml',
      rootCause: "Field 'Account.Compliance_Status__c' is referenced by new Apex logic in AccountComplianceService.cls, but the target permission set lacks fieldPermissions.",
      line: 42,
      suggestedPatch: {
        targetFile: 'force-app/main/default/permissionsets/Sales_Ops_PermSet.permissionset-meta.xml',
        description: 'Inject fieldPermissions for Account.Compliance_Status__c with readable=true and editable=true.',
        patchAction: 'ADD_PERMSET_PERMISSION',
        diffPreview: `+    <fieldPermissions>
+        <editable>true</editable>
+        <field>Account.Compliance_Status__c</field>
+        <readable>true</readable>
+    </fieldPermissions>`
      },
      confidenceScore: 0.98
    },
    repairedValidationResult: {
      deploymentId: 'DEP-849102-QA',
      status: 'SUCCESS',
      canQuickDeploy: true,
      totalTests: 14,
      testsPassed: 14,
      testsFailed: 0,
      codeCoveragePercentage: 86,
      durationSeconds: 18
    }
  },

  apex_test_failure: {
    id: 'apex_test_failure',
    name: 'Apex Test Mock Data Exception (NullPointerException)',
    description: 'OrderTriggerHandlerTest throws NullPointerException due to unpopulated BillingPostalCode required by new validation rule.',
    validationResult: {
      deploymentId: 'DEP-773194-UAT',
      status: 'FAILED',
      canQuickDeploy: false,
      totalTests: 28,
      testsPassed: 27,
      testsFailed: 1,
      codeCoveragePercentage: 68,
      durationSeconds: 36,
      jobId: 'JE-99245',
      failureLog: `[Copado Job Engine JE-99245]
Test Failure: OrderTriggerHandlerTest.testOrderDiscountCalculation
System.DmlException: Insert failed. First exception on row 0; first error: FIELD_CUSTOM_VALIDATION_EXCEPTION, Billing Postal Code is mandatory for Enterprise Accounts: [BillingPostalCode]
Class.OrderTestDataFactory.createAccount: line 23, column 1
Class.OrderTriggerHandlerTest.testOrderDiscountCalculation: line 48, column 1
Code Coverage: 68% (Minimum required: 75%)
STATUS: FAILED_VALIDATION`
    },
    diagnostic: {
      failureCategory: 'APEX_TEST_FAILURE',
      failingComponent: 'classes/OrderTestDataFactory.cls',
      rootCause: "Test setup method createAccount() did not provide 'BillingPostalCode', which tripped validation rule 'Enforce_Billing_Postal_Code'.",
      line: 23,
      suggestedPatch: {
        targetFile: 'force-app/main/default/classes/OrderTestDataFactory.cls',
        description: "Populate test account with mock postal code: BillingPostalCode = '94105'.",
        patchAction: 'UPDATE_TEST_DATA',
        diffPreview: `     Account acc = new Account(
         Name = 'Test Account Enterprise',
-        BillingCountry = 'USA'
+        BillingCountry = 'USA',
+        BillingPostalCode = '94105'
     );`
      },
      confidenceScore: 0.95
    },
    repairedValidationResult: {
      deploymentId: 'DEP-773194-UAT',
      status: 'SUCCESS',
      canQuickDeploy: true,
      totalTests: 28,
      testsPassed: 28,
      testsFailed: 0,
      codeCoveragePercentage: 84,
      durationSeconds: 22
    }
  }
};
