# AGENTS.md — Copado Sentinel Operational Rules

This file provides operating guidelines for AI coding agents (Claude, Cursor, Copilot, Antigravity) executing commands in this repository.

## Guiding Principles
1. **Copado is the System of Record:** Every committed feature branch must link back to an active Copado User Story (`US-XXXXXXX`).
2. **Shift-Left Quality First:** Never execute cloud deployments (`agentia adv deployment deploy`) without running local tests (`sentinel check` / `agentia cicd work test --local`).
3. **Safe Credentials:** Do not store Salesforce credentials in plain text or scripts. Rely on Agentia CLI keychain authentication (`agentia setup`).
4. **Validation Reuse:** Whenever possible, run validation with code coverage first (`agentia adv deployment validate`), then quick-deploy (`agentia adv deployment quick-deploy --yes`) to save execution quotas.
5. **Human-in-the-Loop Governance:** Autonomous self-healing patches must be reviewed or prompted before modifying production-bound metadata.
