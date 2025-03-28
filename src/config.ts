/**
 * Configuration for the TextToolkit MCP server
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  name: 'text-toolkit',
  version: '1.0.0',
  description: 'Text Transformation & Formatting MCP Server',
  defaults: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
  }
};
