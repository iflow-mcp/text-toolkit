import { expect } from 'chai';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerStringEncoding } from '../../src/tools/string-encoding.js';

describe('String Encoding Tools', () => {
  let server: McpServer;
  let mockHandler: any;

  beforeEach(() => {
    server = new McpServer({ name: "test-server", version: "1.0.0" });
    registerStringEncoding(server);

    // Access the tools directly
    mockHandler = async (toolName: string, params: any) => {
      // Access the registered tools directly
      const tool = (server as any)._registeredTools[toolName];
      if (!tool) throw new Error(`Tool ${toolName} not found`);
      return tool.callback(params);
    };
  });

  it('should encode text to Base64', async () => {
    const result = await mockHandler("encode_base64", { text: "Hello, World!" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'SGVsbG8sIFdvcmxkIQ==');
  });

  it('should decode Base64 to text', async () => {
    const result = await mockHandler("decode_base64", { text: "SGVsbG8sIFdvcmxkIQ==" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'Hello, World!');
  });

  it('should encode text for URLs', async () => {
    const result = await mockHandler("encode_url", { text: "Hello, World!" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'Hello%2C%20World!');
  });

  it('should decode URL-encoded text', async () => {
    const result = await mockHandler("decode_url", { text: "Hello%2C%20World!" });

    expect(result).to.have.property('content');
    expect(result.content[0]).to.have.property('type', 'text');

    const parsedResult = JSON.parse(result.content[0].text);
    expect(parsedResult).to.have.property('result', 'Hello, World!');
  });

  it('should handle empty input', async () => {
    try {
      await mockHandler("encode_base64", { text: "" });
      // Should not reach here
      expect.fail("Should have thrown an error for empty input");
    } catch (error: any) {
      expect(error.message).to.include("required");
    }
  });
});
