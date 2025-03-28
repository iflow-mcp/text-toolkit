/**
 * Utility functions for the TextToolkit MCP server
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Wraps a function to handle errors and convert them to McpErrors
 * @param fn The function to wrap
 * @returns A function that handles errors
 */
export function withErrorHandling<T, R>(fn: (input: T) => R): (input: T) => R {
  return (input: T) => {
    try {
      return fn(input);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      // Convert generic errors to MCP errors
      throw new McpError(
        ErrorCode.InternalError,
        `Error processing tool: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}

/**
 * Validates that a string input is not empty
 * @param input The input to validate
 * @param fieldName The name of the field being validated
 * @throws McpError if the input is empty
 */
export function validateNonEmptyString(input: string | undefined, fieldName: string): void {
  if (!input || input.trim() === '') {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} is required and cannot be empty`
    );
  }
}
