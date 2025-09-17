/**
 * Formatting and beautification tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import beautify from "js-beautify";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register all formatting and beautification tools with the MCP server
 */
export function registerFormatting(server: McpServer): void {
  // Schema for formatting input
  const formattingInputSchema = z.object({
    text: z.string().describe("The text to format"),
    indent_size: z.number().int().min(1).max(8).default(2).describe("Number of spaces for indentation (1-8)")
  });

  // Register JSON formatting
  server.tool(
      "format_json",
      "Format and beautify JSON",
      {
        text: formattingInputSchema.shape.text,
        indent_size: formattingInputSchema.shape.indent_size
      },
      async ({ text, indent_size = 2 }) => {
        validateNonEmptyString(text, "Text");

        const result = withErrorHandling(() => {
          try {
            // Parse and stringify to validate and format JSON
            const parsed = JSON.parse(text);
            return {
              result: JSON.stringify(parsed, null, indent_size)
            };
          } catch (error) {
            throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid JSON string"
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

  // Register XML formatting
  server.tool(
      "format_xml",
      "Format and beautify XML",
      {
        text: formattingInputSchema.shape.text,
        indent_size: formattingInputSchema.shape.indent_size
      },
      async ({ text, indent_size = 2 }) => {
        validateNonEmptyString(text, "Text");

        const result = withErrorHandling(() => {
          try {
            return {
              result: beautify.html(text, {
                indent_size,
                indent_char: ' ',
                max_preserve_newlines: 1,
                preserve_newlines: true,
                wrap_line_length: 0
              })
            };
          } catch (error) {
            throw new McpError(
                ErrorCode.InvalidParams,
                "Error formatting XML"
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

  // Register SQL formatting
  server.tool(
      "format_sql",
      "Format and beautify SQL",
      {
        text: formattingInputSchema.shape.text,
        indent_size: formattingInputSchema.shape.indent_size
      },
      async ({ text, indent_size = 2 }) => {
        validateNonEmptyString(text, "Text");

        const result = withErrorHandling(() => {
          // Basic SQL formatting - replace multiple spaces with single space
          // and add newlines after common SQL keywords
          const formatted = text
              .replace(/\s+/g, ' ')
              .replace(/\s*,\s*/g, ', ')
              .replace(/\(\s*/g, '(')
              .replace(/\s*\)/g, ')')
              .replace(/\s*=\s*/g, ' = ')
              .replace(/\s*>\s*/g, ' > ')
              .replace(/\s*<\s*/g, ' < ')
              .replace(/\s*;\s*/g, ';\n')
              .replace(/\s+(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|UNION|INSERT INTO|UPDATE|DELETE FROM)\s+/gi,
                  (match) => `\n${' '.repeat(indent_size)}${match.trim()} `);

          return {
            result: formatted.trim()
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

  // Register HTML formatting
  server.tool(
      "format_html",
      "Format and beautify HTML",
      {
        text: formattingInputSchema.shape.text,
        indent_size: formattingInputSchema.shape.indent_size
      },
      async ({ text, indent_size = 2 }) => {
        validateNonEmptyString(text, "Text");

        const result = withErrorHandling(() => {
          try {
            return {
              result: beautify.html(text, {
                indent_size,
                indent_char: ' ',
                max_preserve_newlines: 1,
                preserve_newlines: true,
                wrap_line_length: 0,
                unformatted: ['code', 'pre', 'em', 'strong', 'span']
              })
            };
          } catch (error) {
            throw new McpError(
                ErrorCode.InvalidParams,
                "Error formatting HTML"
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
