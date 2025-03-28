#!/usr/bin/env node

/**
 * TextToolkit MCP Server
 *
 * A Text Transformation & Formatting MCP Server for the Cline Marketplace
 * that provides developers with common text manipulation functions.
 */

// Import necessary modules
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { config } from "./config.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

// Handle version flag (important to place at the top)
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(config.version);
  process.exit(0);
}

// Check if running in SSE mode
const sseMode = process.argv.includes('--sse') || process.argv.includes('--transport=sse');
const port = process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || config.defaults.port.toString();

// Create an MCP server
const server = new McpServer({
  name: config.name,
  version: config.version
});

// Register tools and resources
registerTools(server);
registerResources(server);

// Start the server with the appropriate transport
async function startServer() {
  try {
    if (sseMode) {
      console.log(`Starting server in SSE mode on port ${port}...`);

      // Create Express app
      const app = express();
      app.use(cors());

      // Add rate limiting
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests from this IP, please try again later'
      });

      // Apply rate limiting to all routes
      app.use(limiter);

      // Add health check endpoint
      app.get('/health', (_: Request, res: Response) => {
        res.json({ status: 'ok', name: config.name, version: config.version });
      });

      // Create a simple SSE endpoint for testing
      app.get("/sse-test", (_: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Send a test event every 2 seconds
        const interval = setInterval(() => {
          res.write(`data: ${JSON.stringify({timestamp: new Date().toISOString()})}

`);
        }, 2000);

        // Clean up on close
        res.on('close', () => {
          clearInterval(interval);
        });
      });

      // Set up SSE transport with session management
      const transports: {[sessionId: string]: SSEServerTransport} = {};

      app.get("/sse", async (req: Request, res: Response) => {
        try {
          // Create a new SSE transport for this session
          const transport = new SSEServerTransport('/messages', res);
          const sessionId = transport.sessionId;

          // Store the transport in our lookup object
          transports[sessionId] = transport;

          // Add the session ID to the response headers
          res.setHeader('X-Session-ID', sessionId);

          // Clean up on close
          res.on("close", () => {
            delete transports[sessionId];
            console.log(`Session ${sessionId} closed`);
          });

          console.log(`New SSE session established: ${sessionId}`);

          // Connect the transport to the server
          await server.connect(transport);
        } catch (error) {
          console.error('Error establishing SSE connection:', error);
          res.status(500).end();
        }
      });

      app.post("/messages", async (req: Request, res: Response) => {
        try {
          const sessionId = req.query.sessionId as string;
          if (!sessionId) {
            res.status(400).send('Missing sessionId parameter');
            return;
          }

          const transport = transports[sessionId];
          if (!transport) {
            res.status(404).send(`No session found with ID ${sessionId}`);
            return;
          }

          await transport.handlePostMessage(req, res);
        } catch (error) {
          console.error('Error handling message:', error);
          res.status(500).send('Internal server error');
        }
      });

      // Start the Express server
      const server_port = parseInt(port, 10);
      app.listen(server_port, () => {
        console.log(`Express server listening on port ${server_port}`);
      });
    } else {
      console.log('Starting server in stdio mode...');
      const transport = new StdioServerTransport();
      await server.connect(transport);
    }
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
