/**
 * Text analysis tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { validateNonEmptyString, withErrorHandling } from "../utils/index.js";

/**
 * Register all text analysis tools with the MCP server
 */
export function registerTextAnalysis(server: McpServer): void {
  // Schema for text analysis input
  const textAnalysisInputSchema = z.object({
    text: z.string().describe("The text to analyze")
  });

  // Register character count
  server.tool(
    "count_characters",
    "Count characters in text",
    {
      text: textAnalysisInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        const totalChars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;

        return {
          total_characters: totalChars,
          characters_without_spaces: charsNoSpaces
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

  // Register word count
  server.tool(
    "count_words",
    "Count words in text",
    {
      text: textAnalysisInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        // Split by whitespace and filter out empty strings
        const words = text.split(/\s+/).filter(word => word.length > 0);

        return {
          word_count: words.length
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

  // Register line count
  server.tool(
    "count_lines",
    "Count lines in text",
    {
      text: textAnalysisInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        // Split by newlines and count
        const lines = text.split(/\r\n|\r|\n/);

        return {
          line_count: lines.length
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

  // Register readability score
  server.tool(
    "analyze_readability",
    "Calculate readability metrics",
    {
      text: textAnalysisInputSchema.shape.text
    },
    async ({ text }) => {
      validateNonEmptyString(text, "Text");

      const result = withErrorHandling(() => {
        // Calculate basic readability metrics

        // Count sentences (roughly)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;

        // Count words
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;

        // Count syllables (very rough approximation)
        const syllableCount = words.reduce((count, word) => {
          // Simple syllable counting heuristic
          return count + countSyllables(word);
        }, 0);

        // Calculate Flesch-Kincaid Grade Level
        let fleschKincaidGrade = 0;
        let fleschReadingEase = 0;

        if (wordCount > 0 && sentenceCount > 0) {
          // Flesch-Kincaid Grade Level formula
          fleschKincaidGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

          // Flesch Reading Ease formula
          fleschReadingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
        }

        return {
          sentence_count: sentenceCount,
          word_count: wordCount,
          syllable_count: syllableCount,
          flesch_kincaid_grade: Math.round(fleschKincaidGrade * 10) / 10,
          flesch_reading_ease: Math.round(fleschReadingEase * 10) / 10,
          reading_level: getReadingLevel(fleschReadingEase)
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
}

/**
 * Count syllables in a word (rough approximation)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();

  // Remove non-alphanumeric characters
  word = word.replace(/[^a-z0-9]/g, '');

  if (word.length <= 3) {
    return 1;
  }

  // Remove silent e at the end
  word = word.replace(/e$/, '');

  // Count vowel groups as syllables
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

/**
 * Get reading level based on Flesch Reading Ease score
 */
function getReadingLevel(score: number): string {
  if (score >= 90) return "Very Easy (5th grade)";
  if (score >= 80) return "Easy (6th grade)";
  if (score >= 70) return "Fairly Easy (7th grade)";
  if (score >= 60) return "Standard (8th-9th grade)";
  if (score >= 50) return "Fairly Difficult (10th-12th grade)";
  if (score >= 30) return "Difficult (College)";
  return "Very Difficult (College Graduate)";
}
