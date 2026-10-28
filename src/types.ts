export interface PreflightCheckResult {
  passed: boolean;
  score: number; // 0 to 100
  filesAnalyzed: number;
  warnings: string[];
  errors: string[];
  destructiveChangesDetected: boolean;
  missingDependencies: string[];
  coverageEstimate: number;
  recommendedTests: string[];
}

export interface DeploymentValidationResult {
  deploymentId: string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  canQuickDeploy: boolean;
  totalTests: number;
  testsPassed: number;
  testsFailed: number;
  codeCoveragePercentage: number;
  failureLog?: string;
  jobId?: string;
  durationSeconds: number;
}

export interface DiagnosticResult {
  failureCategory: 
    | 'APEX_TEST_FAILURE' 
    | 'MISSING_FIELD_PERMISSION' 
    | 'FIELD_CUSTOM_VALIDATION_EXCEPTION' 
    | 'CIRCULAR_DEPENDENCY' 
    | 'GENERIC_DEPLOYMENT_ERROR';
  failingComponent: string;
  rootCause: string;
  line?: number;
  suggestedPatch: {
    targetFile: string;
    description: string;
    diffPreview: string;
    patchAction: 'MODIFY_APEX' | 'ADD_PERMSET_PERMISSION' | 'UPDATE_TEST_DATA' | 'BYPASS_VALIDATION_IN_TEST';
  };
  confidenceScore: number; // 0.0 - 1.0
}

export interface DeploymentResult {
  deploymentId: string;
  status: 'COMPLETED' | 'FAILED';
  quickDeployUsed: boolean;
  deployedComponentsCount: number;
  targetOrg: string;
  copadoUserStoryId?: string;
  timestamp: string;
}

export interface SentinelConfig {
  useMock: boolean;
  autoHeal: boolean;
  targetOrg?: string;
  userStoryId?: string;
  interactive: boolean;
}
