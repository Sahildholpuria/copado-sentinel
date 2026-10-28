import chalk from 'chalk';
import ora from 'ora';
import { AgentiaClient } from './agentia-client';
import { Gatekeeper } from './gatekeeper';
import { Healer } from './healer';
import { SentinelConfig, DiagnosticResult } from './types';

export class SentinelOrchestrator {
  private client: AgentiaClient;
  private gatekeeper: Gatekeeper;
  private healer: Healer;

  constructor(private config: SentinelConfig) {
    this.client = new AgentiaClient(config.useMock);
    this.gatekeeper = new Gatekeeper(this.client);
    this.healer = new Healer();
  }

  /**
   * Set active scenario for demo
   */
  public setScenario(name: string) {
    this.client.setScenario(name);
  }

  /**
   * Run the complete self-healing deployment loop
   */
  public async runFullLoop(deploymentId: string = 'DEP-849102-QA') {
    console.log(chalk.bold.cyan('\n🛡️  COPADO SENTINEL — AUTONOMOUS RELEASE AGENT'));
    console.log(chalk.gray('─────────────────────────────────────────────────────────────'));
    console.log(chalk.white(`Tracking User Story:  ${chalk.yellow(this.client.getCurrentUserStory())}`));
    console.log(chalk.white(`Deployment Target:    ${chalk.magenta(this.config.targetOrg || 'Alchemy_Staging')}`));
    console.log(chalk.white(`Execution Mode:       ${this.config.useMock ? chalk.yellow('Simulated (Offline Safe)') : chalk.green('Live Agentia CLI')}`));
    console.log(chalk.gray('─────────────────────────────────────────────────────────────\n'));

    // STEP 1: Preflight Gatekeeper
    const spinPre = ora('Step 1/4: Running Shift-Left Gatekeeper & Dependency Checks...').start();
    const preflight = await this.gatekeeper.runChecks();
    if (preflight.passed) {
      spinPre.succeed(chalk.green(`Gatekeeper Passed! Quality Score: ${preflight.score}/100`));
      console.log(chalk.gray(`   • Files analyzed: ${preflight.filesAnalyzed} metadata components`));
      console.log(chalk.gray(`   • Estimated coverage: ${preflight.coverageEstimate}%`));
      console.log(chalk.gray(`   • Recommended tests: ${preflight.recommendedTests.join(', ')}`));
    } else {
      spinPre.fail(chalk.red(`Gatekeeper Failed with score: ${preflight.score}/100`));
      return;
    }

    // STEP 2: Validate Deployment in Cloud
    console.log('');
    const spinVal = ora(`Step 2/4: Triggering Cloud Validation via Pipelines Advanced (${deploymentId})...`).start();
    let validation = await this.client.validateDeployment(deploymentId, false);

    if (validation.status === 'SUCCESS') {
      spinVal.succeed(chalk.green(`Initial Validation Succeeded! (${validation.totalTests} tests passed)`));
    } else {
      spinVal.fail(chalk.red(`Validation Failed in target org: ${validation.testsFailed} test failure(s)`));
      console.log(chalk.yellow('\n--- Copado Job Engine Error Log ---'));
      console.log(chalk.dim(validation.failureLog || 'Unknown error'));
      console.log(chalk.yellow('------------------------------------\n'));

      // STEP 3: Autonomous Healer Diagnosis
      const spinDiag = ora('Step 3/4: Sentinel AI Healer diagnosing root cause...').start();
      await new Promise(r => setTimeout(r, 1000));
      const diagnostic = this.healer.diagnoseFailure(validation);
      spinDiag.succeed(chalk.cyan(`Diagnostic Complete (Confidence: ${(diagnostic.confidenceScore * 100).toFixed(0)}%)`));

      console.log('\n' + chalk.bold.bgRed(' ❌ ROOT CAUSE IDENTIFIED '));
      console.log(chalk.white(`Category:    ${chalk.redBright(diagnostic.failureCategory)}`));
      console.log(chalk.white(`Component:   ${chalk.yellow(diagnostic.failingComponent)}`));
      console.log(chalk.white(`Reason:      ${diagnostic.rootCause}`));
      if (diagnostic.line) {
        console.log(chalk.white(`Line Number: ${diagnostic.line}`));
      }

      console.log('\n' + chalk.bold.bgGreen(' 🩹 SYNTHESIZED SELF-HEALING PATCH '));
      console.log(chalk.white(`Target:      ${chalk.cyan(diagnostic.suggestedPatch.targetFile)}`));
      console.log(chalk.white(`Action:      ${diagnostic.suggestedPatch.description}`));
      console.log(chalk.gray('\nProposed Patch Preview:'));
      console.log(chalk.green(diagnostic.suggestedPatch.diffPreview));

      // In interactive or auto-heal mode:
      console.log('');
      const spinPatch = ora('Applying automated patch to branch & committing audit trail...').start();
      await this.healer.applyPatch(diagnostic);
      spinPatch.succeed(chalk.green('Patch applied successfully. Feature branch updated.'));

      // Re-running validation
      const spinReval = ora('Re-running cloud validation on patched branch...').start();
      validation = await this.client.validateDeployment(deploymentId, true);
      if (validation.status === 'SUCCESS') {
        spinReval.succeed(chalk.green(`Re-validation Passed! (100% tests passing, coverage: ${validation.codeCoveragePercentage}%)`));
      } else {
        spinReval.fail(chalk.red('Re-validation failed. Manual intervention required.'));
        return;
      }
    }

    // STEP 4: Governance-Preserved Quick Deploy
    console.log('');
    const spinDeploy = ora('Step 4/4: Executing zero-downtime quick-deploy (reusing validation)...').start();
    const deployResult = await this.client.quickDeploy(deploymentId);
    spinDeploy.succeed(chalk.green(`Quick-Deploy Completed to ${deployResult.targetOrg}!`));

    const spinDone = ora('Updating Copado User Story as system of record (agentia cicd work submit --done)...').start();
    await this.client.completeStory();
    spinDone.succeed(chalk.green(`User Story ${this.client.getCurrentUserStory()} moved to Completed.`));

    console.log(chalk.gray('\n─────────────────────────────────────────────────────────────'));
    console.log(chalk.bold.green('🎉 COPADO SENTINEL PIPELINE COMPLETE — 100% QUALITY GOVERNANCE'));
    console.log(chalk.white(`• Promotion Status:    ${chalk.green('SUCCESS')}`));
    console.log(chalk.white(`• Quick-Deploy Used:   ${chalk.cyan('Yes (0 duplicated test execution time)')}`));
    console.log(chalk.white(`• System of Record:    ${chalk.magenta('Copado Cloud Synchronized')}`));
    console.log(chalk.gray('─────────────────────────────────────────────────────────────\n'));
  }
}
