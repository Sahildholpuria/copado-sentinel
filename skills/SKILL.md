---
name: copado-sentinel
description: Autonomous Self-Healing Release Agent for Copado Agentia Headless. Use this skill when modifying Salesforce metadata, validating deployments, diagnosing Copado job failures, or promoting user stories with zero downtime.
---

# Copado Sentinel Agent Skill

Copado Sentinel orchestrates Salesforce CI/CD by bridging local development to Copado Pipelines Advanced and Agentia Headless CLI.

## When to use this skill
- Whenever a Salesforce change (Apex, LWC, Flow, Permission Set) is ready for validation or release.
- When a Copado deployment or test run fails and requires root-cause analysis and automated patching.
- When performing pre-flight dependency and destructive change checks before git push.
- When promoting validated changes without re-running long test cycles via quick-deploy.

## Commands and Workflow

### 1. Shift-Left Preflight Checks
Before committing or publishing work, run:
```bash
sentinel check
```
Inspects staged git metadata, verifies permission sets, and executes local test gates (`agentia cicd work test --local`).

### 2. Autonomous Cloud Validation
Validate the deployment against the target sandbox:
```bash
sentinel validate --deployment <deployment-id>
```
Wraps `agentia adv deployment validate <id> --wait --json`. If the validation passes and `canQuickDeploy` is true, the deployment is staged for zero-downtime release.

### 3. Diagnose and Self-Heal
If the deployment or test run fails:
```bash
sentinel heal --deployment <deployment-id>
```
Fetches the Copado job execution log (`agentia cicd job log get --json`), isolates the failing stack trace, and synthesizes a patch (e.g. injects missing permission set fields or fixes unit test mock data).

### 4. Zero-Downtime Quick Deploy
Once validated, deploy without paying for duplicated test execution:
```bash
sentinel deploy <deployment-id>
```
Reuses the valid test run, deploys to target org, and updates the Copado user story (`agentia cicd work submit --done`).

### 5. Full Autonomous Loop
To run the complete check -> validate -> heal -> deploy sequence:
```bash
sentinel loop --deployment <deployment-id> --org <target-org>
```

## Governance Constraints
- Always preserve Copado as the system of record.
- Never bypass destructive change warnings without developer confirmation.
- Destructive operations require explicit confirmation (`--yes` in CLI or `confirm: true` in MCP).
