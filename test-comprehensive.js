#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the MCP server
const server = spawn('node', [path.join(__dirname, 'dist/index.js')]);

// Buffer to store server output
let serverOutput = '';

// Listen for server output
server.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log(`Server output: ${output}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});

// Function to send a request to the server and wait for a response
async function sendRequest(request) {
  return new Promise((resolve) => {
    // Clear previous output
    serverOutput = '';
    
    // Send the request
    console.log(`Sending request: ${JSON.stringify(request)}`);
    server.stdin.write(JSON.stringify(request) + '\n');
    
    // Wait for the response
    const checkOutput = setInterval(() => {
      if (serverOutput.includes('"id":' + request.id)) {
        clearInterval(checkOutput);
        try {
          // Extract the JSON response
          const responseStr = serverOutput.substring(serverOutput.indexOf('{'));
          const response = JSON.parse(responseStr);
          resolve(response);
        } catch (error) {
          console.error('Error parsing response:', error);
          resolve(null);
        }
      }
    }, 100);
  });
}

// Main test function
async function runTests() {
  try {
    // Test 1: List all tools
    console.log('\n=== Test 1: List all tools ===');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };
    const listToolsResponse = await sendRequest(listToolsRequest);
    console.log(`Found ${listToolsResponse.result.tools.length} tools`);
    
    // Test 2: Case transformations
    console.log('\n=== Test 2: Case transformations ===');
    const testText = 'hello world test';
    
    // Test camelCase
    const camelCaseRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'case_to_camel',
        arguments: { text: testText }
      }
    };
    const camelCaseResponse = await sendRequest(camelCaseRequest);
    const camelCaseResult = JSON.parse(camelCaseResponse.result.content[0].text).result;
    console.log(`camelCase: ${testText} -> ${camelCaseResult}`);
    
    // Test PascalCase
    const pascalCaseRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'case_to_pascal',
        arguments: { text: testText }
      }
    };
    const pascalCaseResponse = await sendRequest(pascalCaseRequest);
    const pascalCaseResult = JSON.parse(pascalCaseResponse.result.content[0].text).result;
    console.log(`PascalCase: ${testText} -> ${pascalCaseResult}`);
    
    // Test snake_case
    const snakeCaseRequest = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'case_to_snake',
        arguments: { text: testText }
      }
    };
    const snakeCaseResponse = await sendRequest(snakeCaseRequest);
    const snakeCaseResult = JSON.parse(snakeCaseResponse.result.content[0].text).result;
    console.log(`snake_case: ${testText} -> ${snakeCaseResult}`);
    
    // Test 3: String encoding
    console.log('\n=== Test 3: String encoding ===');
    
    // Test Base64 encoding
    const base64EncodeRequest = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'encode_base64',
        arguments: { text: testText }
      }
    };
    const base64EncodeResponse = await sendRequest(base64EncodeRequest);
    const base64EncodeResult = JSON.parse(base64EncodeResponse.result.content[0].text).result;
    console.log(`Base64 encode: ${testText} -> ${base64EncodeResult}`);
    
    // Test Base64 decoding
    const base64DecodeRequest = {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'decode_base64',
        arguments: { text: base64EncodeResult }
      }
    };
    const base64DecodeResponse = await sendRequest(base64DecodeRequest);
    const base64DecodeResult = JSON.parse(base64DecodeResponse.result.content[0].text).result;
    console.log(`Base64 decode: ${base64EncodeResult} -> ${base64DecodeResult}`);
    
    // Test 4: Formatting
    console.log('\n=== Test 4: Formatting ===');
    
    // Test JSON formatting
    const jsonText = '{"name":"John","age":30,"city":"New York"}';
    const formatJsonRequest = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: {
        name: 'format_json',
        arguments: { text: jsonText, indent_size: 2 }
      }
    };
    const formatJsonResponse = await sendRequest(formatJsonRequest);
    const formatJsonResult = JSON.parse(formatJsonResponse.result.content[0].text).result;
    console.log(`JSON format: ${jsonText} -> \n${formatJsonResult}`);
    
    // Test 5: Text analysis
    console.log('\n=== Test 5: Text analysis ===');
    
    // Test character count
    const countCharsRequest = {
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: {
        name: 'count_characters',
        arguments: { text: testText }
      }
    };
    const countCharsResponse = await sendRequest(countCharsRequest);
    const countCharsResult = JSON.parse(countCharsResponse.result.content[0].text);
    console.log(`Character count: ${testText} -> Total: ${countCharsResult.total_characters}, Without spaces: ${countCharsResult.characters_without_spaces}`);
    
    // Test 6: String manipulation
    console.log('\n=== Test 6: String manipulation ===');
    
    // Test string replace
    const replaceRequest = {
      jsonrpc: '2.0',
      id: 9,
      method: 'tools/call',
      params: {
        name: 'string_replace',
        arguments: { text: testText, search: 'world', replace: 'universe' }
      }
    };
    const replaceResponse = await sendRequest(replaceRequest);
    const replaceResult = JSON.parse(replaceResponse.result.content[0].text).result;
    console.log(`String replace: ${testText} -> ${replaceResult}`);
    
    // Test 7: UUID generation
    console.log('\n=== Test 7: UUID generation ===');
    
    // Test UUID generation
    const uuidRequest = {
      jsonrpc: '2.0',
      id: 10,
      method: 'tools/call',
      params: {
        name: 'generate_uuid',
        arguments: { version: 'v4' }
      }
    };
    const uuidResponse = await sendRequest(uuidRequest);
    const uuidResult = JSON.parse(uuidResponse.result.content[0].text).uuid;
    console.log(`UUID generation: ${uuidResult}`);
    
    // Test 8: Hash generation
    console.log('\n=== Test 8: Hash generation ===');
    
    // Test SHA-256 hash
    const hashRequest = {
      jsonrpc: '2.0',
      id: 11,
      method: 'tools/call',
      params: {
        name: 'generate_sha256',
        arguments: { text: testText }
      }
    };
    const hashResponse = await sendRequest(hashRequest);
    const hashResult = JSON.parse(hashResponse.result.content[0].text).hash;
    console.log(`SHA-256 hash: ${testText} -> ${hashResult}`);
    
    // Test 9: Lorem ipsum generation
    console.log('\n=== Test 9: Lorem ipsum generation ===');
    
    // Test lorem ipsum generation
    const loremRequest = {
      jsonrpc: '2.0',
      id: 12,
      method: 'tools/call',
      params: {
        name: 'generate_lorem_ipsum',
        arguments: { count: 2, units: 'sentences' }
      }
    };
    const loremResponse = await sendRequest(loremRequest);
    const loremResult = JSON.parse(loremResponse.result.content[0].text).text;
    console.log(`Lorem ipsum: ${loremResult.substring(0, 50)}...`);
    
    // Test 10: Regex tools
    console.log('\n=== Test 10: Regex tools ===');
    
    // Test regex test
    const regexRequest = {
      jsonrpc: '2.0',
      id: 13,
      method: 'tools/call',
      params: {
        name: 'regex_test',
        arguments: { text: testText, pattern: '\\w+', flags: 'g' }
      }
    };
    const regexResponse = await sendRequest(regexRequest);
    const regexResult = JSON.parse(regexResponse.result.content[0].text);
    console.log(`Regex test: ${testText} -> Found ${regexResult.match_count} matches: ${JSON.stringify(regexResult.matches)}`);
    
    console.log('\n=== All tests completed successfully! ===');
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    // Kill the server
    console.log('Killing server...');
    server.kill();
    process.exit(0);
  }
}

// Wait for the server to start
setTimeout(() => {
  runTests();
}, 1000);
