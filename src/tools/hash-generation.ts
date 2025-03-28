/**
 * Hash generation tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import CryptoJS from "crypto-js";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register hash generation tools with the MCP server
 */
export function registerHashGeneration(server: McpServer): void {
  // Schema for hash generation input
  const hashInputSchema = z.object({
    text: z.string().describe("The text to hash")
  });

  // Register MD5 hash generation
  server.tool(
    "generate_md5",
    "Generate MD5 hash",
    {
      text: hashInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        hash: CryptoJS.MD5(text).toString()
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

  // Register SHA-1 hash generation
  server.tool(
    "generate_sha1",
    "Generate SHA-1 hash",
    {
      text: hashInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        hash: CryptoJS.SHA1(text).toString()
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

  // Register SHA-256 hash generation
  server.tool(
    "generate_sha256",
    "Generate SHA-256 hash",
    {
      text: hashInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        hash: CryptoJS.SHA256(text).toString()
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

  // Register SHA-512 hash generation
  server.tool(
    "generate_sha512",
    "Generate SHA-512 hash",
    {
      text: hashInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => ({
        hash: CryptoJS.SHA512(text).toString()
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

  // Register HMAC-SHA256 hash generation
  server.tool(
    "generate_hmac",
    "Generate HMAC hash",
    {
      text: hashInputSchema.shape.text,
      key: z.string().describe("The secret key for HMAC"),
      algorithm: z.enum(["SHA256", "SHA512", "MD5"]).default("SHA256").describe("The hashing algorithm to use")
    },
    async ({ text, key, algorithm = "SHA256" }) => {
      validateNonEmptyString(text, "Text");
      validateNonEmptyString(key, "Key");

      const result = withErrorHandling(() => {
        let hash: string;

        switch (algorithm) {
          case "SHA256":
            hash = CryptoJS.HmacSHA256(text, key).toString();
            break;
          case "SHA512":
            hash = CryptoJS.HmacSHA512(text, key).toString();
            break;
          case "MD5":
            hash = CryptoJS.HmacMD5(text, key).toString();
            break;
          default:
            hash = CryptoJS.HmacSHA256(text, key).toString();
        }

        return {
          hash
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
}
