/**
 * Register all tools with the MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCaseTransformations } from "./case-transformations.js";
import { registerStringEncoding } from "./string-encoding.js";
import { registerFormatting } from "./formatting.js";
import { registerTextAnalysis } from "./text-analysis.js";
import { registerStringManipulation } from "./string-manipulation.js";
import { registerUuidGeneration } from "./uuid-generation.js";
import { registerHashGeneration } from "./hash-generation.js";
import { registerLoremIpsum } from "./lorem-ipsum.js";
import { registerRegexTools } from "./regex-tools.js";

export function registerTools(server: McpServer): void {
  // Register all tool categories
  registerCaseTransformations(server);
  registerStringEncoding(server);
  registerFormatting(server);
  registerTextAnalysis(server);
  registerStringManipulation(server);
  registerUuidGeneration(server);
  registerHashGeneration(server);
  registerLoremIpsum(server);
  registerRegexTools(server);
}
