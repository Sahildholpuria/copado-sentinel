import { Command } from 'commander';
import chalk from 'chalk';
import { SentinelOrchestrator } from './orchestrator';
import { startMcpServer } from './mcp-server';
import { Gatekeeper } from './gatekeeper';
import { Healer } from './healer';
import { AgentiaClient } from './agentia-client';

const program = new Command();

program
  .name('copado-sentinel')
  .description('Autonomous Self-Healing DevOps & Release Agent for Copado Agentia Headless')
  .version('1.0.0');

// Global mock flag
program.option('-m, --mock', 'Run in simulated mock mode (ideal for demos or unauthenticated environments)', true);
program.option('-s, --scenario <scenario>', 'Scenario for testing (missing_permission, apex_test_failure)', 'missing_permission');

program
  .command('loop')
  .description('Run the autonomous end-to-end Check -> Validate -> Heal -> Deploy loop')
  .option('-d, --deployment <id>', 'Copado Deployment ID', 'DEP-849102-QA')
  .option('-o, --org <org>', 'Target Salesforce Sandbox', 'Alchemy_Staging')
  .action(async (options) => {
    const opts = program.opts();
    const orchestrator = new SentinelOrchestrator({
      useMock: opts.mock !== false,
      autoHeal: true,
      targetOrg: options.org,
      interactive: false,
    });
    if (opts.scenario) {
      orchestrator.setScenario(opts.scenario);
    }
    await orchestrator.runFullLoop(options.deployment);
  });

program
  .command('check')
  .description('Run Shift-Left Preflight Gatekeeper & Dependency Scan on staged metadata')
  .action(async () => {
    const opts = program.opts();
    const client = new AgentiaClient(opts.mock !== false);
    const gatekeeper = new Gatekeeper(client);

    console.log(chalk.bold.cyan('\n🔍 Running Shift-Left Quality Gatekeeper...'));
    const res = await gatekeeper.runChecks();
    console.log(`Gatekeeper Status:  ${res.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`);
    console.log(`Quality Score:      ${res.score >= 80 ? chalk.green(res.score) : chalk.yellow(res.score)}/100`);
    console.log(`Components Scanned: ${res.filesAnalyzed}`);
    console.log(`Estimated Coverage: ${res.coverageEstimate}%`);
    if (res.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      res.warnings.forEach(w => console.log(` • ${w}`));
    }
    console.log(chalk.cyan(`\nRecommended Apex Tests: ${res.recommendedTests.join(', ')}\n`));
  });

program
  .command('heal')
  .description('Diagnose a failed Copado validation or test run and generate a self-healing patch')
  .option('-d, --deployment <id>', 'Deployment ID to diagnose', 'DEP-849102-QA')
  .action(async (options) => {
    const opts = program.opts();
    const client = new AgentiaClient(opts.mock !== false);
    if (opts.scenario) client.setScenario(opts.scenario);

    const healer = new Healer();
    console.log(chalk.bold.cyan(`\n🩹 Diagnosing failure for deployment ${options.deployment}...`));
    const valResult = await client.validateDeployment(options.deployment, false);
    const diagnostic = healer.diagnoseFailure(valResult);

    console.log('\n' + chalk.bold.bgRed(' ❌ ROOT CAUSE IDENTIFIED '));
    console.log(`Category:    ${chalk.red(diagnostic.failureCategory)}`);
    console.log(`Component:   ${chalk.yellow(diagnostic.failingComponent)}`);
    console.log(`Reason:      ${diagnostic.rootCause}`);
    console.log(`Confidence:  ${(diagnostic.confidenceScore * 100).toFixed(0)}%`);

    console.log('\n' + chalk.bold.bgGreen(' 🩹 SUGGESTED PATCH '));
    console.log(`File:        ${chalk.cyan(diagnostic.suggestedPatch.targetFile)}`);
    console.log(`Action:      ${diagnostic.suggestedPatch.description}`);
    console.log(chalk.gray('\nProposed Patch:'));
    console.log(chalk.green(diagnostic.suggestedPatch.diffPreview) + '\n');
  });

program
  .command('deploy')
  .description('Execute zero-downtime quick-deploy for validated deployment')
  .argument('<deploymentId>', 'Validated deployment ID')
  .action(async (deploymentId) => {
    const opts = program.opts();
    const client = new AgentiaClient(opts.mock !== false);

    console.log(chalk.bold.cyan(`\n⚡ Quick-Deploying ${deploymentId} to target org...`));
    const res = await client.quickDeploy(deploymentId);
    console.log(chalk.green(`✓ Deployment ${res.deploymentId} completed successfully in ${res.targetOrg}.`));
    console.log(chalk.gray(`✓ Reused validated test run (zero duplicated test execution time).`));
    await client.completeStory();
    console.log(chalk.green(`✓ Copado User Story marked as complete.\n`));
  });

program
  .command('mcp')
  .description('Start Model Context Protocol (MCP) server over stdio for AI IDE integration')
  .action(async () => {
    await startMcpServer();
  });

program.parse(process.argv);
