/**
 * UUID/GUID generation tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, NIL as NIL_UUID, validate } from "uuid";
import { withErrorHandling } from "../utils/index.js";

/**
 * Register UUID generation tools with the MCP server
 */
export function registerUuidGeneration(server: McpServer): void {
  // Register UUID v4 generation (random)
  server.tool(
    "generate_uuid",
    "Generate a UUID",
    {
      version: z.enum(["v1", "v4", "v5", "nil"]).default("v4").describe("UUID version to generate"),
      namespace: z.string().optional().describe("Namespace for v5 UUID (required for v5)"),
      name: z.string().optional().describe("Name for v5 UUID (required for v5)"),
      uppercase: z.boolean().default(false).describe("Whether to return the UUID in uppercase")
    },
    async ({ version = "v4", namespace, name, uppercase = false }) => {
      const result = withErrorHandling(() => {
        let uuid: string;

        switch (version) {
          case "v1":
            // Time-based UUID
            uuid = uuidv1();
            break;
          case "v4":
            // Random UUID
            uuid = uuidv4();
            break;
          case "v5":
            // Name-based UUID with SHA-1 hashing
            if (!namespace || !name) {
              throw new Error("Both namespace and name are required for v5 UUID");
            }

            // Validate namespace is a valid UUID
            if (!validate(namespace)) {
              throw new Error("Namespace must be a valid UUID");
            }

            uuid = uuidv5(name, namespace);
            break;
          case "nil":
            // Nil UUID (all zeros)
            uuid = NIL_UUID;
            break;
          default:
            uuid = uuidv4();
        }

        return {
          uuid: uppercase ? uuid.toUpperCase() : uuid
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

  // Register UUID validation
  server.tool(
    "validate_uuid",
    "Validate a UUID",
    {
      uuid: z.string().describe("The UUID to validate")
    },
    async ({ uuid }) => {
      if (!uuid) {
        throw new Error("UUID is required");
      }

      const result = withErrorHandling(() => {
        return {
          is_valid: validate(uuid)
        };
      })(uuid);

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
