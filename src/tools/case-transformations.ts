/**
 * Case transformation tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase
} from "change-case";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register all case transformation tools with the MCP server
 */
export function registerCaseTransformations(server: McpServer): void {
  // Schema for case transformation input
  const caseInputSchema = z.object({
    text: z.string().describe("The text to transform"),
    delimiter: z.string().optional().describe("The character to use between words (optional)"),
    locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
    mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
  });

  // Register camelCase transformation
  server.tool(
    "case_to_camel",
    "Convert text to camelCase",
    {
      text: z.string().describe("The text to transform to camelCase"),
      delimiter: z.string().optional().describe("The character to use between words (optional)"),
      locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
      mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
    },
    async ({ text, delimiter, locale, mergeAmbiguousCharacters }) => {
      validateNonEmptyString(text, "Text");

      const options: Record<string, any> = {};

      if (delimiter !== undefined) options.delimiter = delimiter;
      if (locale !== undefined) options.locale = locale;
      if (mergeAmbiguousCharacters !== undefined) options.mergeAmbiguousCharacters = mergeAmbiguousCharacters;

      try {
        const result = camelCase(text, Object.keys(options).length > 0 ? options : undefined);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ result }, null, 2)
            }
          ]
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Register PascalCase transformation
  server.tool(
    "case_to_pascal",
    "Convert text to PascalCase",
    {
      text: z.string().describe("The text to transform to PascalCase"),
      delimiter: z.string().optional().describe("The character to use between words (optional)"),
      locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
      mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
    },
    async ({ text, delimiter, locale, mergeAmbiguousCharacters }) => {
      validateNonEmptyString(text, "Text");

      const options: Record<string, any> = {};

      if (delimiter !== undefined) options.delimiter = delimiter;
      if (locale !== undefined) options.locale = locale;
      if (mergeAmbiguousCharacters !== undefined) options.mergeAmbiguousCharacters = mergeAmbiguousCharacters;

      try {
        const result = pascalCase(text, Object.keys(options).length > 0 ? options : undefined);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ result }, null, 2)
            }
          ]
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Register snake_case transformation
  server.tool(
    "case_to_snake",
    "Convert text to snake_case",
    {
      text: z.string().describe("The text to transform to snake_case"),
      delimiter: z.string().optional().describe("The character to use between words (optional)"),
      locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
      mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
    },
    async ({ text, delimiter, locale, mergeAmbiguousCharacters }) => {
      validateNonEmptyString(text, "Text");

      const options: Record<string, any> = {};

      if (delimiter !== undefined) options.delimiter = delimiter;
      if (locale !== undefined) options.locale = locale;
      if (mergeAmbiguousCharacters !== undefined) options.mergeAmbiguousCharacters = mergeAmbiguousCharacters;

      try {
        const result = snakeCase(text, Object.keys(options).length > 0 ? options : undefined);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ result }, null, 2)
            }
          ]
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Register kebab-case transformation
  server.tool(
    "case_to_kebab",
    "Convert text to kebab-case",
    {
      text: z.string().describe("The text to transform to kebab-case"),
      delimiter: z.string().optional().describe("The character to use between words (optional)"),
      locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
      mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
    },
    async ({ text, delimiter, locale, mergeAmbiguousCharacters }) => {
      validateNonEmptyString(text, "Text");

      const options: Record<string, any> = {};

      if (delimiter !== undefined) options.delimiter = delimiter;
      if (locale !== undefined) options.locale = locale;
      if (mergeAmbiguousCharacters !== undefined) options.mergeAmbiguousCharacters = mergeAmbiguousCharacters;

      try {
        const result = kebabCase(text, Object.keys(options).length > 0 ? options : undefined);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ result }, null, 2)
            }
          ]
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Register other case transformations
  const registerCaseTool = (
    name: string,
    description: string,
    transformFn: (text: string, options?: any) => string
  ) => {
    server.tool(
      name,
      `Convert text to ${description}`,
      {
        text: z.string().describe(`The text to transform to ${description}`),
        delimiter: z.string().optional().describe("The character to use between words (optional)"),
        locale: z.union([z.array(z.string()), z.string(), z.boolean()]).optional().describe("Locale for case conversion (optional)"),
        mergeAmbiguousCharacters: z.boolean().optional().describe("Whether to merge ambiguous characters (optional)")
      },
      async ({ text, delimiter, locale, mergeAmbiguousCharacters }) => {
        validateNonEmptyString(text, "Text");

        const options: Record<string, any> = {};

        if (delimiter !== undefined) options.delimiter = delimiter;
        if (locale !== undefined) options.locale = locale;
        if (mergeAmbiguousCharacters !== undefined) options.mergeAmbiguousCharacters = mergeAmbiguousCharacters;

        try {
          const result = transformFn(text, Object.keys(options).length > 0 ? options : undefined);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ result }, null, 2)
              }
            ]
          };
        } catch (error) {
          if (error instanceof McpError) {
            throw error;
          }
          throw new McpError(
            ErrorCode.InternalError,
            `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );
  };

  // Register remaining case transformation tools
  registerCaseTool("case_to_constant", "CONSTANT_CASE", constantCase);
  registerCaseTool("case_to_dot", "dot.case", dotCase);
  registerCaseTool("case_to_no", "no case", noCase);
  registerCaseTool("case_to_pascal_snake", "Pascal_Snake_Case", pascalSnakeCase);
  registerCaseTool("case_to_path", "path/case", pathCase);
  registerCaseTool("case_to_sentence", "Sentence case", sentenceCase);
  registerCaseTool("case_to_train", "Train-Case", trainCase);
  registerCaseTool("case_to_capital", "Capital Case", capitalCase);
}
