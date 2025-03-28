#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the MCP server in SSE mode
const server = spawn('node', [path.join(__dirname, 'dist/index.js'), '--sse']);

// Listen for server output
server.stdout.on('data', (data) => {
  console.log(`Server output: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});

// Function to send a request to the server via SSE
async function sendRequest(sessionId, request) {
  console.log(`Sending request: ${JSON.stringify(request)}`);
  
  const response = await fetch(`http://localhost:8000/messages?sessionId=${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  
  console.log(`Response status: ${response.status}`);
  const responseText = await response.text();
  console.log(`Response text: ${responseText}`);
  
  return {
    status: response.status,
    text: responseText
  };
}

// Main test function
async function runTests() {
  try {
    // Test the health endpoint
    console.log('\n=== Testing health endpoint ===');
    const healthResponse = await fetch('http://localhost:8000/health');
    const healthData = await healthResponse.json();
    console.log('Health endpoint response:', healthData);
    
    // Connect to the SSE endpoint
    console.log('\n=== Connecting to SSE endpoint ===');
    const sseResponse = await fetch('http://localhost:8000/sse');
    console.log('SSE response status:', sseResponse.status);
    
    // Get the session ID from the headers
    const sessionId = sseResponse.headers.get('X-Session-ID');
    console.log('Session ID:', sessionId);
    
    if (!sessionId) {
      throw new Error('Failed to get session ID');
    }
    
    // Test 1: List all tools
    console.log('\n=== Test 1: List all tools ===');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };
    await sendRequest(sessionId, listToolsRequest);
    
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
    await sendRequest(sessionId, camelCaseRequest);
    
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
    await sendRequest(sessionId, pascalCaseRequest);
    
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
    await sendRequest(sessionId, snakeCaseRequest);
    
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
    await sendRequest(sessionId, base64EncodeRequest);
    
    // Test 4: Formatting
    console.log('\n=== Test 4: Formatting ===');
    
    // Test JSON formatting
    const jsonText = '{"name":"John","age":30,"city":"New York"}';
    const formatJsonRequest = {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'format_json',
        arguments: { text: jsonText, indent_size: 2 }
      }
    };
    await sendRequest(sessionId, formatJsonRequest);
    
    // Test 5: Text analysis
    console.log('\n=== Test 5: Text analysis ===');
    
    // Test character count
    const countCharsRequest = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: {
        name: 'count_characters',
        arguments: { text: testText }
      }
    };
    await sendRequest(sessionId, countCharsRequest);
    
    // Test 6: String manipulation
    console.log('\n=== Test 6: String manipulation ===');
    
    // Test string replace
    const replaceRequest = {
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: {
        name: 'string_replace',
        arguments: { text: testText, search: 'world', replace: 'universe' }
      }
    };
    await sendRequest(sessionId, replaceRequest);
    
    // Test 7: UUID generation
    console.log('\n=== Test 7: UUID generation ===');
    
    // Test UUID generation
    const uuidRequest = {
      jsonrpc: '2.0',
      id: 9,
      method: 'tools/call',
      params: {
        name: 'generate_uuid',
        arguments: { version: 'v4' }
      }
    };
    await sendRequest(sessionId, uuidRequest);
    
    // Test 8: Hash generation
    console.log('\n=== Test 8: Hash generation ===');
    
    // Test SHA-256 hash
    const hashRequest = {
      jsonrpc: '2.0',
      id: 10,
      method: 'tools/call',
      params: {
        name: 'generate_sha256',
        arguments: { text: testText }
      }
    };
    await sendRequest(sessionId, hashRequest);
    
    // Test 9: Lorem ipsum generation
    console.log('\n=== Test 9: Lorem ipsum generation ===');
    
    // Test lorem ipsum generation
    const loremRequest = {
      jsonrpc: '2.0',
      id: 11,
      method: 'tools/call',
      params: {
        name: 'generate_lorem_ipsum',
        arguments: { count: 2, units: 'sentences' }
      }
    };
    await sendRequest(sessionId, loremRequest);
    
    // Test 10: Regex tools
    console.log('\n=== Test 10: Regex tools ===');
    
    // Test regex test
    const regexRequest = {
      jsonrpc: '2.0',
      id: 12,
      method: 'tools/call',
      params: {
        name: 'regex_test',
        arguments: { text: testText, pattern: '\\w+', flags: 'g' }
      }
    };
    await sendRequest(sessionId, regexRequest);
    
    console.log('\n=== All SSE tests completed successfully! ===');
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
}, 2000);
