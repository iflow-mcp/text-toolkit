/**
 * String encoding/decoding tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { encode, decode } from "html-entities";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register all string encoding/decoding tools with the MCP server
 */
export function registerStringEncoding(server: McpServer): void {
  // Schema for encoding/decoding input
  const encodingInputSchema = z.object({
    text: z.string().describe("The text to encode or decode")
  });

  // Register Base64 encoding
  server.tool(
    "encode_base64",
    "Encode text to Base64",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        result: Buffer.from(text).toString('base64')
      }))(text);

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

  // Register Base64 decoding
  server.tool(
    "decode_base64",
    "Decode Base64 to text",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        try {
          return {
            result: Buffer.from(text, 'base64').toString('utf-8')
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Invalid Base64 string"
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

  // Register URL encoding
  server.tool(
    "encode_url",
    "Encode text for URLs",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        result: encodeURIComponent(text)
      }))(text);

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

  // Register URL decoding
  server.tool(
    "decode_url",
    "Decode URL-encoded text",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        try {
          return {
            result: decodeURIComponent(text)
          };
        } catch (error) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Invalid URL encoded string"
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

  // Register HTML entity encoding
  server.tool(
    "encode_html",
    "Encode HTML entities",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        result: encode(text)
      }))(text);

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

  // Register HTML entity decoding
  server.tool(
    "decode_html",
    "Decode HTML entities",
    {
      text: encodingInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        result: decode(text)
      }))(text);

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
