import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AgentiaClient } from './agentia-client';
import { Gatekeeper } from './gatekeeper';
import { Healer } from './healer';

export async function startMcpServer() {
  const server = new Server(
    {
      name: 'copado-sentinel-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const client = new AgentiaClient(true);
  const gatekeeper = new Gatekeeper(client);
  const healer = new Healer();

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'sentinel_preflight_check',
          description: 'Run shift-left quality gates, dependency analysis, and local test coverage checks.',
          inputSchema: {
            type: 'object',
            properties: {
              gitStagedOnly: {
                type: 'boolean',
                description: 'Whether to restrict inspection to staged git changes',
              },
            },
          },
        },
        {
          name: 'sentinel_validate_deployment',
          description: 'Validate a deployment in target Salesforce sandbox via Copado Pipelines Advanced.',
          inputSchema: {
            type: 'object',
            properties: {
              deploymentId: {
                type: 'string',
                description: 'The Copado deployment ID (e.g. DEP-849102-QA)',
              },
              isHealed: {
                type: 'boolean',
                description: 'Set true if validating post-remediation patch',
              },
            },
            required: ['deploymentId'],
          },
        },
        {
          name: 'sentinel_diagnose_and_heal',
          description: 'Analyze Copado failure logs, pinpoint root cause (Apex error, missing permission), and generate fix diff.',
          inputSchema: {
            type: 'object',
            properties: {
              failureLog: {
                type: 'string',
                description: 'Raw Copado or Apex job execution failure log',
              },
            },
          },
        },
        {
          name: 'sentinel_quick_deploy',
          description: 'Execute zero-downtime quick-deploy for validated deployment without re-running test suites.',
          inputSchema: {
            type: 'object',
            properties: {
              deploymentId: {
                type: 'string',
                description: 'The validated deployment ID',
              },
            },
            required: ['deploymentId'],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'sentinel_preflight_check') {
      const res = await gatekeeper.runChecks();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'sentinel_validate_deployment') {
      const depId = (args?.deploymentId as string) || 'DEP-849102-QA';
      const isHealed = !!args?.isHealed;
      const res = await client.validateDeployment(depId, isHealed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'sentinel_diagnose_and_heal') {
      const validationRes = await client.validateDeployment('DEP-849102-QA', false);
      const diagnostic = healer.diagnoseFailure(validationRes);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(diagnostic, null, 2),
          },
        ],
      };
    }

    if (name === 'sentinel_quick_deploy') {
      const depId = (args?.deploymentId as string) || 'DEP-849102-QA';
      const res = await client.quickDeploy(depId);
      await client.completeStory();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
