/**
 * Regex pattern testing and extraction tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register regex tools with the MCP server
 */
export function registerRegexTools(server: McpServer): void {
  // Register regex test tool
  server.tool(
    "regex_test",
    "Test a regex pattern against text",
    {
      text: z.string().describe("The text to test against the pattern"),
      pattern: z.string().describe("The regex pattern to test"),
      flags: z.string().default("g").describe("Regex flags (e.g., 'g', 'i', 'gi')")
    },
    async ({ text, pattern, flags = "g" }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(pattern, "Pattern");

      const result = withErrorHandling(() => {
        try {
          const regex = new RegExp(pattern, flags);
          const matches = text.match(regex);

          return {
            matches: matches ? matches : [],
            match_count: matches ? matches.length : 0,
            is_match: matches !== null && matches.length > 0
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      })(text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  // Register regex replace tool
  server.tool(
    "regex_replace",
    "Replace text using a regex pattern",
    {
      text: z.string().describe("The text to perform replacements on"),
      pattern: z.string().describe("The regex pattern to match"),
      replacement: z.string().describe("The replacement string"),
      flags: z.string().default("g").describe("Regex flags (e.g., 'g', 'i', 'gi')")
    },
    async ({ text, pattern, replacement, flags = "g" }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(pattern, "Pattern");

      const result = withErrorHandling(() => {
        try {
          const regex = new RegExp(pattern, flags);
          const replaced = text.replace(regex, replacement);

          return {
            result: replaced
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      })(text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  // Register regex extract tool
  server.tool(
    "regex_extract",
    "Extract matches using a regex pattern",
    {
      text: z.string().describe("The text to extract from"),
      pattern: z.string().describe("The regex pattern with capture groups"),
      flags: z.string().default("g").describe("Regex flags (e.g., 'g', 'i', 'gi')")
    },
    async ({ text, pattern, flags = "g" }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(pattern, "Pattern");

      const result = withErrorHandling(() => {
        try {
          const regex = new RegExp(pattern, flags);
          const matches = [];
          let match;

          // If global flag is set, find all matches
          if (flags.includes('g')) {
            while ((match = regex.exec(text)) !== null) {
              // Extract the full match and all capture groups
              matches.push({
                full_match: match[0],
                groups: match.slice(1)
              });
            }
          } else {
            // If global flag is not set, find only the first match
            match = regex.exec(text);
            if (match) {
              matches.push({
                full_match: match[0],
                groups: match.slice(1)
              });
            }
          }

          return {
            matches,
            match_count: matches.length
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      })(text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  // Register regex split tool
  server.tool(
    "regex_split",
    "Split text using a regex pattern",
    {
      text: z.string().describe("The text to split"),
      pattern: z.string().describe("The regex pattern to split by"),
      flags: z.string().default("").describe("Regex flags (e.g., 'i')")
    },
    async ({ text, pattern, flags = "" }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(pattern, "Pattern");

      const result = withErrorHandling(() => {
        try {
          const regex = new RegExp(pattern, flags);
          const parts = text.split(regex);

          return {
            parts,
            part_count: parts.length
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      })(text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );
}
