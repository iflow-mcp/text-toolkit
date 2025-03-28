/**
 * String manipulation tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register all string manipulation tools with the MCP server
 */
export function registerStringManipulation(server: McpServer): void {
  // Register trim tool
  server.tool(
    "string_trim",
    "Trim whitespace from text",
    {
      text: z.string().describe("The text to trim"),
      trim_type: z.enum(["both", "start", "end"]).default("both").describe("Type of trimming to perform")
    },
    async ({ text, trim_type = "both" }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        let trimmed: string;

        switch (trim_type) {
          case "start":
            trimmed = text.trimStart();
            break;
          case "end":
            trimmed = text.trimEnd();
            break;
          case "both":
          default:
            trimmed = text.trim();
            break;
        }

        return {
          result: trimmed
        };
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

  // Register substring tool
  server.tool(
    "string_substring",
    "Extract a substring",
    {
      text: z.string().describe("The text to extract a substring from"),
      start: z.number().int().min(0).default(0).describe("Starting index (inclusive)"),
      end: z.number().int().optional().describe("Ending index (exclusive, optional)")
    },
    async ({ text, start = 0, end }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        if (start < 0 || start >= text.length) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Start index must be between 0 and ${text.length - 1}`
          );
        }

        if (end !== undefined && (end < start || end > text.length)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `End index must be between ${start} and ${text.length}`
          );
        }

        return {
          result: text.substring(start, end)
        };
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

  // Register replace tool
  server.tool(
    "string_replace",
    "Replace text",
    {
      text: z.string().describe("The text to perform replacements on"),
      search: z.string().describe("The string to search for"),
      replace: z.string().describe("The string to replace with"),
      replace_all: z.boolean().default(true).describe("Whether to replace all occurrences")
    },
    async ({ text, search, replace, replace_all = true }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(search, "Search string");

      const result = withErrorHandling(() => {
        if (replace_all) {
          return {
            result: text.split(search).join(replace)
          };
        } else {
          return {
            result: text.replace(search, replace)
          };
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

  // Register split tool
  server.tool(
    "string_split",
    "Split text into an array",
    {
      text: z.string().describe("The text to split"),
      delimiter: z.string().default(" ").describe("The delimiter to split by"),
      limit: z.number().int().min(1).optional().describe("Maximum number of splits (optional)")
    },
    async ({ text, delimiter = " ", limit }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        return {
          result: text.split(delimiter, limit)
        };
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

  // Register join tool
  server.tool(
    "string_join",
    "Join an array into text",
    {
      parts: z.array(z.string()).describe("The array of strings to join"),
      delimiter: z.string().default("").describe("The delimiter to join with")
    },
    async ({ parts, delimiter = "" }) => {
      if (!parts || !Array.isArray(parts) || parts.length === 0) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Parts array is required and cannot be empty"
        );
      }

      const result = withErrorHandling(() => {
        return {
          result: parts.join(delimiter)
        };
      })(parts);

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
