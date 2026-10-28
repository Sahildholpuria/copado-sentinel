# Copado Sentinel: 5-Minute Hackathon Demo Script

Follow this script to record your video submission (must be ≤ 5 minutes and ≤ 300 MB).

---

### [0:00 - 0:45] Intro & The Pain Point
- **Visual:** Show title slide or terminal.
- **Spoken Script:**
  > "Hi everyone, I’m thrilled to present **Copado Sentinel**, an autonomous, self-healing release agent built for the Copado Agentia Headless Hackathon.
  > Today, AI coding agents help us write Apex and Salesforce features faster than ever. But when it's time to release, developers still hit a wall: long 40-minute test suites, missing permission set entries, validation rule exceptions, and cryptic Copado Job Engine logs spread across browser tabs.
  > Copado Sentinel solves this by giving developers and AI agents a closed-loop CLI and MCP server that validates, diagnoses, self-heals, and quick-deploys Salesforce changes without leaving the terminal."

---

### [0:45 - 1:30] Step 1: Shift-Left Gatekeeper (`sentinel check`)
- **Action:** Open terminal and run:
  ```bash
  sentinel check
  ```
- **Spoken Script:**
  > "Here, I've got a feature branch for user story US-0013994. Before pushing or opening a promotion, Sentinel runs our shift-left gatekeeper.
  > It analyzes staged Git metadata, checks dependencies using `agentia cicd metadata dependency list`, and runs local unit tests with `agentia cicd work test --local`.
  > It awards a Quality Score of 88/100, detects that a new custom field `Compliance_Status__c` is present, and recommends the exact Apex test classes to run."

---

### [1:30 - 3:00] Steps 2 & 3: The Star Feature — Autonomous Self-Healing
- **Action:** Run the autonomous loop command:
  ```bash
  sentinel loop
  ```
- **Spoken Script:**
  > "Now watch what happens when we run `sentinel loop`.
  > Step 2 kicks off: Sentinel triggers cloud validation in our staging sandbox using Copado Pipelines Advanced (`agentia adv deployment validate`). Notice how the terminal waits for real-time progress.
  > And look: validation failed! In a traditional workflow, a developer would have to open Copado, find Job Execution JE-99201, download the log, and figure out what went wrong.
  > But Copado Sentinel takes over in Step 3:
  > The AI Healer automatically parses the failure log, identifies the root cause with 98% confidence — `MISSING_FIELD_PERMISSION` on `Sales_Ops_PermSet` for `Account.Compliance_Status__c`.
  > Sentinel immediately synthesizes the exact XML patch, updates the feature branch, and triggers re-validation.
  > And boom — re-validation passes with 100% tests passing and 86% code coverage!"

---

### [3:00 - 4:00] Step 4: Zero-Downtime Quick Deploy
- **Visual:** Terminal finishes quick-deploy.
- **Spoken Script:**
  > "Because Copado Pipelines Advanced tracks `canQuickDeploy`, Sentinel doesn't make us wait for another 30-minute test cycle.
  > In Step 4, it instantly executes `agentia adv deployment quick-deploy --yes`, deploying the validated metadata to staging.
  > Finally, it updates Copado as the system of record using `agentia cicd work submit --done`. Git stays the source of truth, Copado stays the system of record, and zero browser tabs were needed."

---

### [4:00 - 4:45] MCP Server & Agent Skill Integration
- **Action:** Briefly show `skills/SKILL.md` or start `sentinel mcp`.
- **Spoken Script:**
  > "What makes Sentinel truly built for the agentic era is that it exposes these capabilities as native Model Context Protocol (MCP) tools and an Agent Skill (`SKILL.md`).
  > Any AI agent in Cursor, Claude Desktop, or VS Code can call `sentinel_preflight_check`, `sentinel_diagnose_and_heal`, or `sentinel_quick_deploy` directly from chat."

---

### [4:45 - 5:00] Conclusion & Wrap-up
- **Spoken Script:**
  > "With Copado Sentinel and Agentia Headless, releases are faster, safer, and self-healing.
  > Thank you Copado team for this hackathon!"
