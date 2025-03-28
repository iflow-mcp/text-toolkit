#!/usr/bin/env node

/**
 * Example script demonstrating how to use the TextToolkit MCP server
 * to transform text to different cases.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // Create a transport to communicate with the TextToolkit server
  const transport = new StdioClientTransport({
    command: "node",
    args: ["../dist/index.js"]
  });

  // Create an MCP client
  const client = new Client(
    {
      name: "text-toolkit-example",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  try {
    // Connect to the server
    await client.connect(transport);
    console.log("Connected to TextToolkit MCP server");

    // List available tools
    const tools = await client.listTools();
    console.log(`Available tools: ${tools.tools.map(t => t.name).join(", ")}`);

    // Example text to transform
    const text = "hello world example";
    console.log(`\nOriginal text: "${text}"`);

    // Transform to different cases
    const camelCase = await client.callTool({
      name: "case_to_camel",
      arguments: { text }
    });
    console.log(`camelCase: ${JSON.parse(camelCase.content[0].text).result}`);

    const pascalCase = await client.callTool({
      name: "case_to_pascal",
      arguments: { text }
    });
    console.log(`PascalCase: ${JSON.parse(pascalCase.content[0].text).result}`);

    const snakeCase = await client.callTool({
      name: "case_to_snake",
      arguments: { text }
    });
    console.log(`snake_case: ${JSON.parse(snakeCase.content[0].text).result}`);

    const kebabCase = await client.callTool({
      name: "case_to_kebab",
      arguments: { text }
    });
    console.log(`kebab-case: ${JSON.parse(kebabCase.content[0].text).result}`);

    // Custom options example
    const customCase = await client.callTool({
      name: "case_to_pascal",
      arguments: { 
        text,
        delimiter: "_"
      }
    });
    console.log(`Custom Pascal_Snake_Case: ${JSON.parse(customCase.content[0].text).result}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

main();
