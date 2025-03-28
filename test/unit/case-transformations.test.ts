import { expect } from 'chai';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCaseTransformations } from '../../src/tools/case-transformations.js';

describe('Case Transformation Tools', () => {
  let server: McpServer;
  let mockHandler: any;

  beforeEach(() => {
    server = new McpServer({ name: "test-server", version: "1.0.0" });
    registerCaseTransformations(server);

    // Access the tools directly
    mockHandler = async (toolName: string, params: any) => {
      // Access the registered tools directly
      const tool = (server as any)._registeredTools[toolName];
      if (!tool) throw new Error(`Tool ${toolName} not found`);
      return tool.callback(params);
    };
  });

  it('should convert text to camelCase', async () => {
    const result = await mockHandler("case_to_camel", { text: "hello world test" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'helloWorldTest');
  });

  it('should convert text to PascalCase', async () => {
    const result = await mockHandler("case_to_pascal", { text: "hello world test" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'HelloWorldTest');
  });

  it('should convert text to snake_case', async () => {
    const result = await mockHandler("case_to_snake", { text: "hello world test" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'hello_world_test');
  });

  it('should handle empty input', async () => {
    try {
      await mockHandler("case_to_camel", { text: "" });
      // Should not reach here
      expect.fail("Should have thrown an error for empty input");
    } catch (error: any) {
      expect(error.message).to.include("required");
    }
  });

  it('should respect custom options', async () => {
    const result = await mockHandler("case_to_pascal", {
      text: "hello world test",
      delimiter: "_"
    });

    expect(result).to.have.property('content');
    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'Hello_World_Test');
  });
});
