/**
 * Lorem ipsum generation tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { loremIpsum } from "lorem-ipsum";
import { withErrorHandling } from "../utils/index.js";

/**
 * Register lorem ipsum generation tools with the MCP server
 */
export function registerLoremIpsum(server: McpServer): void {
  // Register lorem ipsum generation
  server.tool(
    "generate_lorem_ipsum",
    "Generate lorem ipsum text",
    {
      count: z.number().int().min(1).max(1000).default(5).describe("Number of units to generate"),
      units: z.enum(["words", "sentences", "paragraphs"]).default("sentences").describe("Type of units to generate"),
      paragraphLowerBound: z.number().int().min(1).max(10).default(3).describe("Minimum sentences per paragraph"),
      paragraphUpperBound: z.number().int().min(1).max(20).default(7).describe("Maximum sentences per paragraph"),
      sentenceLowerBound: z.number().int().min(1).max(20).default(5).describe("Minimum words per sentence"),
      sentenceUpperBound: z.number().int().min(1).max(50).default(15).describe("Maximum words per sentence"),
      format: z.enum(["plain", "html"]).default("plain").describe("Output format")
    },
    async ({
      count = 5,
      units = "sentences",
      paragraphLowerBound = 3,
      paragraphUpperBound = 7,
      sentenceLowerBound = 5,
      sentenceUpperBound = 15,
      format = "plain"
    }) => {
      if (paragraphUpperBound < paragraphLowerBound) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "paragraphUpperBound must be greater than or equal to paragraphLowerBound"
        );
      }

      if (sentenceUpperBound < sentenceLowerBound) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "sentenceUpperBound must be greater than or equal to sentenceLowerBound"
        );
      }

      const result = withErrorHandling(() => {
        const text = loremIpsum({
          count,
          units,
          sentenceLowerBound,
          sentenceUpperBound,
          paragraphLowerBound,
          paragraphUpperBound,
          format: format === "html" ? "html" : "plain"
        });

        return {
          text
        };
      })({});

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
