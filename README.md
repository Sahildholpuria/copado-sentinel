# Copado Sentinel 🛡️
> **Autonomous Self-Healing DevOps & Release Agent for Copado Agentia Headless**  
> *Built for the Copado Agentia™ Headless Virtual Hackathon 2026*

[![Copado Agentia](https://img.shields.io/badge/Copado%20Agentia-v1.2.0-blue?logo=salesforce)](https://developer.copado.com/docs)
[![MCP Server](https://img.shields.io/badge/Protocol-Model%20Context%20Protocol-orange)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Executive Summary

Modern AI coding agents (Claude, Cursor, Windsurf, Antigravity) generate Salesforce Apex classes, LWC components, and Flows at lightning speed. However, releasing those changes remains bottlenecked by brittle metadata dependencies, missing permission set entries, validation rule exceptions, and cryptic Copado Job Engine error logs spread across browser tabs.

**Copado Sentinel** is an autonomous, developer-first CI/CD orchestrator and CLI plugin built directly on top of the `@copado/agentia-cli` foundation and Model Context Protocol (MCP). Sentinel introduces a closed-loop **Shift-Left Check → Cloud Validation → Autonomous Diagnosis & Healing → Zero-Downtime Quick Deploy** lifecycle right inside the developer terminal and AI agent IDEs.

```
┌─────────────────────────────────────────────────────────────┐
│                   Developer / AI Coding Agent               │
│          (Cursor, Claude Desktop, Antigravity, Terminal)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ MCP Tools / CLI commands
┌──────────────────────────────▼──────────────────────────────┐
│                    COPADO SENTINEL CORE                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │    Gatekeeper    │  │  AI Healer Engine│  │MCP Server │  │
│  │ (Preflight Gate) │  │ (RCA & Patching) │  │ (Stdio)   │  │
│  └─────────┬────────┘  └─────────▲────────┘  └─────┬─────┘  │
└────────────┼─────────────────────┼─────────────────┼────────┘
             │                     │                 │
┌────────────▼─────────────────────┴─────────────────▼────────┐
│                   COPADO AGENTIA HEADLESS                   │
│ • agentia adv deployment (validate / quick-deploy)          │
│ • agentia cicd work (set / test / publish / submit --done)   │
│ • agentia cicd job (get / log get --json)                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│             Copado Cloud System of Record & Orgs            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

1. **Shift-Left Preflight Gatekeeper (`sentinel check`)**:
   - Inspects staged Git metadata before work publication.
   - Audits metadata dependencies (`agentia cicd metadata dependency list --from-changes`).
   - Runs local test gates (`agentia cicd work test --local`).
   - Flags destructive changes, profile-wide regressions, and recommends test classes.

2. **Pipelines Advanced Validation (`sentinel validate`)**:
   - Drives multi-org deployments safely using `agentia adv deployment validate <id> --wait --json`.
   - Requires **zero local Salesforce credentials** on the developer's machine.
   - Preserves test runs with `canQuickDeploy` to eliminate duplicate test execution times.

3. **Autonomous Self-Healing Engine (`sentinel heal`)**:
   - Ingests raw Copado Job Engine failure logs (`agentia cicd job log get --json`).
   - Diagnoses root causes (`MISSING_FIELD_PERMISSION`, `FIELD_CUSTOM_VALIDATION_EXCEPTION`, `APEX_TEST_FAILURE`).
   - Automatically synthesizes a code/permission set patch, updates the feature branch, and triggers re-validation.

4. **Zero-Downtime Quick Deployment (`sentinel deploy`)**:
   - Reuses validated test runs to deploy immediately with `agentia adv deployment quick-deploy --yes`.
   - Finalizes the user story and synchronizes Copado as the system of record (`agentia cicd work submit --done`).

5. **Native Model Context Protocol (MCP) Server (`sentinel mcp`)**:
   - Exposes Sentinel tools directly to AI IDEs (Claude Desktop, Cursor, Antigravity) over standard input/output.
   - Includes a production-ready `SKILL.md` for Agentia agent workflows.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 20+ (tested on Node v24)
- Copado Agentia CLI (`npm install -g @copado/agentia-cli`)

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/copado-sentinel.git
cd copado-sentinel

# Install dependencies and build
npm install
npm run build

# Link CLI globally (optional)
npm link
```

---

## 💻 CLI Commands & Usage

### 1. Run the Full Autonomous Self-Healing Loop
```bash
sentinel loop --deployment DEP-849102-QA --org Alchemy_Staging
```
*Executes the complete sequence: Gatekeeper check → Cloud validation → Automatic failure diagnosis & patch → Re-validation → Zero-downtime quick-deploy → Copado User Story completion.*

### 2. Pre-flight Shift-Left Inspection
```bash
sentinel check
```
*Scans local staged metadata and outputs a Quality Score (0–100) and recommended Apex test classes.*

### 3. Diagnose and Synthesize Healer Patch
```bash
sentinel heal --deployment DEP-849102-QA
```
*Parses Copado Job Engine logs, isolates root cause with confidence scoring, and prints the synthesized patch diff.*

### 4. Zero-Downtime Quick Deploy
```bash
sentinel deploy DEP-849102-QA
```
*Deploys validated metadata without repeating test execution and marks the user story complete in Copado.*

### 5. Test Realistic Failure Scenarios (Demo Mode)
Sentinel includes built-in realistic mock scenarios so anyone can test or evaluate without active Salesforce sandbox credentials:
```bash
# Scenario 1: Missing Field Permission in Permission Set
sentinel loop --scenario missing_permission

# Scenario 2: Apex Test Data Mock Exception
sentinel loop --scenario apex_test_failure
```

---

## 🤖 MCP Server & AI Agent Integration

Copado Sentinel can be driven autonomously by AI agents (Claude Desktop, Cursor, Antigravity) through its native MCP server.

### Cursor / Claude Desktop MCP Configuration (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "copado-sentinel": {
      "command": "node",
      "args": ["/path/to/copado-sentinel/dist/index.js", "mcp"]
    }
  }
}
```

### Exposed MCP Tools:
- `sentinel_preflight_check`: Runs shift-left quality gates and dependency checks.
- `sentinel_validate_deployment`: Validates deployment in target sandbox via Pipelines Advanced.
- `sentinel_diagnose_and_heal`: Ingests Copado Job Engine logs, pinpoints root cause, and synthesizes code diff.
- `sentinel_quick_deploy`: Executes zero-downtime quick-deployment and updates the user story.

---

## 🔒 Security & Governance

- **Zero Credentials on Developer Laptops:** Copado Pipelines Advanced acts as the deployment broker. No Salesforce passwords or security tokens are exposed or stored locally.
- **System of Record Preserved:** Git remains the source of truth for code; Copado remains the authoritative system of record for promotion audits, compliance, and work items.
- **Confirmation Safety Gate:** Destructive deployments require explicit `--yes` confirmation flags in the CLI and `confirm: true` over MCP.

---

## 📁 Repository Structure

```
copado-sentinel/
├── README.md                 # Project documentation & architecture
├── SUBMISSION.md             # Hackathon form responses
├── PITCH_DECK.md             # 7-Slide presentation deck outline
├── DEMO_SCRIPT.md            # 5-minute video recording script
├── package.json              # Package definition & scripts
├── tsconfig.json             # TypeScript compiler config
├── bin/
│   └── sentinel.js           # CLI executable entrypoint
├── src/
│   ├── index.ts              # Commander CLI command routing
│   ├── agentia-client.ts     # Copado Agentia CLI & Pipelines Advanced client
│   ├── gatekeeper.ts         # Shift-left quality gates & dependency analysis
│   ├── healer.ts             # RCA diagnostic engine & patch synthesizer
│   ├── orchestrator.ts       # Closed-loop autonomous release coordinator
│   ├── mcp-server.ts         # Native Model Context Protocol (MCP) server
│   ├── scenarios.ts          # Realistic Salesforce DevOps failure scenarios
│   └── types.ts              # TypeScript interfaces
├── skills/
│   └── SKILL.md              # Copado Agentia Skill specification
└── AGENTS.md                 # Agent governance rules & safety boundaries
```

---

## 🏆 Hackathon Submission Metadata

- **Category:** Copado Agentia™ Headless Virtual Hackathon 2026
- **Primary CLI Extensibility:** `@copado/agentia-cli` (`agentia adv`, `agentia cicd work`, `agentia cicd job`)
- **Protocol:** Model Context Protocol (MCP) `@modelcontextprotocol/sdk`
- **License:** MIT
